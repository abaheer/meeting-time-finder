using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.DotNet.Scaffolding.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using Microsoft.Identity.Client;
using Microsoft.SqlServer.Server;
using Newtonsoft.Json.Linq;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomsController : ControllerBase
    {
        private readonly MeetingDbContext _context;

        public RoomsController(MeetingDbContext context)
        {
            _context = context;
        }

        // GET: api/Rooms/Person/{roomid}/{personname} --> method to return Person given roomid and personname (for login page)
        [HttpPost("Person/{roomid}/{personname}")]
        public async Task<ActionResult<Person>> GetUser(int roomid, string personname) {
            var room = await _context.Rooms.Include(r => r.Participants).FirstOrDefaultAsync(r => r.RoomId == roomid);
            if (room==null)
            {
                return NotFound(roomid);
            }
            var person = room.Participants.FirstOrDefault(e => e.PersonName == personname);
            if (person == null)
            {
                // Create a new Person object with the provided person's name
                Person newPerson = new Person { PersonName = personname, RoomId = roomid, Room = room };

                // Add the new Person to the Room's Participants collection
                room.Participants.Add(newPerson);

                // Save changes to the database
                await _context.SaveChangesAsync();

                // Return the newly created Person object
                return CreatedAtAction("GetUser", new { id = newPerson.PersonId }, newPerson);
            }
            

            return Ok(person);
        }

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms.Include(p => p.Participants).ThenInclude(pa => pa.Person_AvailableTimes).ToListAsync();
        }

        [HttpGet("hastime/{roomId}/{dateString}")]
        public async Task<ActionResult<AvailableTime>> HasAvailableTime(int roomId, string dateString)
        {
            var room_time = await _context.Rooms
                                        .Include(t => t.AvailableTimes)
                                        .FirstOrDefaultAsync(t => t.RoomId == roomId);

            if (room_time == null)
            {
                return NotFound();
            }

            // Decode the URL encoded date string
            string decodedDateString = HttpUtility.UrlDecode(dateString);
            string format = "dd/MM/yyyy HH:mm";

            DateTime newDate;
            try
            {
                newDate = DateTime.ParseExact(decodedDateString, format, CultureInfo.InvariantCulture);
            }
            catch (FormatException)
            {
                return BadRequest("Invalid date format (use dd/mm/yyyy HH:mm)");
            }

            var times = room_time.AvailableTimes
                                 .Where(t => t.Time == newDate)
                                 .Select(t => new { t.Time, t.RoomId });

            return Ok(times);
        }

        [HttpPost("/addTime/{roomId}/{personId}/{dateString}")]
        public async Task<ActionResult<Room>> PostRoom(int roomId, int personId, string dateString)
        {

            var room = await _context.Rooms
                            .FirstOrDefaultAsync(t => t.RoomId == roomId);

            if (room == null)
            {
                return NotFound();
            }

            // Decode the URL encoded date string
            string decodedDateString = HttpUtility.UrlDecode(dateString);
            string format = "dd/MM/yyyy HH:mm";

            DateTime newDate;
            try
            {
                newDate = DateTime.ParseExact(decodedDateString, format, CultureInfo.InvariantCulture);
            }
            catch (FormatException)
            {
                return BadRequest("Invalid date format (use dd/mm/yyyy HH:mm)");
            }


            var times = await _context.AvailableTime.FirstOrDefaultAsync(t => t.Time == newDate && t.RoomId == roomId);


            var person = await _context.Participants.FindAsync(personId);

            if (person == null)
            {
                return NotFound("Person not found");
            }

            // case where time does not exist in room: create a new availableTime object and add it to room and Person_AvailableTimes
            if (times == null)
            {
                AvailableTime newTime = new AvailableTime { Time = newDate, RoomId = roomId, Room = room };

                if (room.AvailableTimes == null)
                {
                    room.AvailableTimes = new List<AvailableTime>();
                }

                var AvailableParticiapnts = new Person_AvailableTime { AvailableTime = newTime, Person = person };

                newTime.Person_AvailableTimes = new Collection<Person_AvailableTime>();

                if (person.Person_AvailableTimes == null)
                {
                    person.Person_AvailableTimes = new Collection<Person_AvailableTime>();
                }

                person.Person_AvailableTimes.Add(AvailableParticiapnts);

                room.AvailableTimes.Add(newTime);
            }

            // case where time exists but not for current user
            else
            {
                var userTime = await _context.AvailableParticipants.FirstOrDefaultAsync(e => e.PersonId == personId && e.AvailableTime.RoomId == roomId && e.AvailableTime.Time == newDate);
                if (userTime == null)
                {

                    AvailableTime existingTime = await _context.AvailableTime.FirstOrDefaultAsync(e => e.Time == newDate && e.RoomId == roomId);
                    
                    if (existingTime != null)
                    {
                        Person_AvailableTime newAvailableParticipant = new Person_AvailableTime { Person = person, AvailableTime = existingTime };
                        if (existingTime.Person_AvailableTimes == null)
                        {
                            existingTime.Person_AvailableTimes = new Collection<Person_AvailableTime>();
                        }
                        existingTime.Person_AvailableTimes.Add(newAvailableParticipant);
                        
                        if (person.Person_AvailableTimes == null)
                        {
                            person.Person_AvailableTimes = new Collection<Person_AvailableTime>();
                        }
                        person.Person_AvailableTimes.Add(newAvailableParticipant);
                    }
                    

                }
            }

            // otherwise, the participant is already available for the selected time and we dont have to do anything.
            await _context.SaveChangesAsync();
            return Ok(room);
        }


        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Room>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return room;
        }

        // GET: api/5/SelectedTimes
        [HttpGet("{roomId}/SelectedTimes")]
        public async Task<ActionResult<IEnumerable<int>>> GetSelectedTimes(int roomId)
        {
            var room = await _context.Rooms
                                    .Include(r => r.Participants) // Include the Participants collection
                                    .FirstOrDefaultAsync(r => r.RoomId == roomId);


            if (room == null)
            {
                return NotFound(); // Return 404 if room not found
            }

            var participantIds = room.Participants?.Select(p => p.PersonId);
            var availableTimes = await _context.AvailableParticipants
                                    .Where(ap => participantIds.Any(pid => pid == ap.PersonId))
                                    .Select(ap => new { ap.PersonId, ap.AvailableTime.Time })
                                    .Distinct() // Remove duplicate available times
                                    .ToListAsync();

            if (participantIds == null || !participantIds.Any())
            {
                return NoContent(); // Return 204 if no participants found
            }

            return Ok(availableTimes); // Return participant IDs with 200 OK
        }

        // GET: api/5/Participants
        [HttpGet("{roomId}/Participants")]
        public async Task<ActionResult<IEnumerable<int>>> GetParticipantIdsForRoom(int roomId)
        {
            var room = await _context.Rooms
                                    .Include(r => r.Participants) // Include the Participants collection
                                    .FirstOrDefaultAsync(r => r.RoomId == roomId);


            if (room == null)
            {
                return NotFound(); // Return 404 if room not found
            }

            var participantIds = room.Participants?.Select(p => new { p.PersonId, p.Person_AvailableTimes });

            if (participantIds == null || !participantIds.Any())
            {
                return NoContent(); // Return 204 if no participants found
            }

            return Ok(participantIds); // Return participant IDs with 200 OK
        }

        // GET: api/5/Participants/AvailableTimes/Counts
        [HttpGet("{roomId}/Participants/AvailableTimes/Counts")]
        public async Task<ActionResult<IEnumerable<object>>> GetAvailableTimeCountsForParticipants(int roomId)
        {
            // Retrieve the room with participants
            var room = await _context.Rooms
                                    .Include(r => r.Participants) // Include the Participants collection
                                    .FirstOrDefaultAsync(r => r.RoomId == roomId);

            if (room == null)
            {
                return NotFound(); // Return 404 if room not found
            }

            // Retrieve the participant IDs
            var participantIds = room.Participants?.Select(p => p.PersonId);

            if (participantIds == null || !participantIds.Any())
            {
                return NoContent(); // Return 204 if no participants found
            }

            // Query available times for the retrieved participant IDs
            var availableTimes = await _context.AvailableParticipants
                                                .Where(ap => participantIds.Any(id => id == ap.PersonId)) // Check if the participant ID is in the collection
                                                .Select(ap => ap.AvailableTime.Time) // Select the time only
                                                .Distinct() // Remove duplicate times
                                                .ToListAsync();

            // Create a dictionary to store the counts of each time
            var timeCounts = new Dictionary<DateTime, int>();

            // Count occurrences of each time
            foreach (var time in availableTimes)
            {
                int count = await _context.AvailableParticipants
                                            .Where(ap => ap.AvailableTime.Time == time && participantIds.Any(id => id == ap.PersonId)) // Check if the participant ID is in the collection
                                            .CountAsync();

                // Add the count to the dictionary
                timeCounts[time] = count;
            }

            return timeCounts.Select(kvp => new { Time = kvp.Key, Count = kvp.Value }).ToList();
        }

        // PUT: api/Rooms/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, Room room)
        {
            if (id != room.RoomId)
            {
                return BadRequest();
            }

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Rooms
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{name}")]
        public async Task<ActionResult<Room>> PostRoom(Room room, string name)
        {
            // Create a new Person object with the provided person's name
            Person newPerson = new Person { PersonName = name };

            // Add the new Person to the Room's Participants collection
            room.Participants = new Collection<Person> { newPerson };

            // Add the new AvailableTime to the Room's AvailableTimes collection
            room.AvailableTimes = new Collection<AvailableTime> { };

            // Add the new Room and Person to the context
            _context.Rooms.Add(room);
            _context.Participants.Add(newPerson);
            

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Return the newly created Room object
            return CreatedAtAction("GetRoom", new { id = room.RoomId }, room);
        }

        // DELETE: api/Rooms/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.RoomId == id);
        }
    }
}
