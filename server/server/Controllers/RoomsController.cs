﻿using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.EntityFrameworkCore;
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

        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Room>>> GetRooms()
        {
            return await _context.Rooms.Include(p => p.Participants).ThenInclude(pa => pa.Person_AvailableTimes).ToListAsync();
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

        // GET: api/Rooms/5
        [HttpGet("{id}/timeslot")]
        public async Task<ActionResult<List<int>>> GetSlotCount(int id)
        {
            var room = _context.Rooms
            .Include(r => r.AvailableTimes)
            .FirstOrDefault(r => r.RoomId == id);

            if (room == null || room.AvailableTimes == null)
            {
                return NotFound();
            }

            List<int> result = new List<int>();
            foreach (var availableTime in room.AvailableTimes)
            {
                if (availableTime.Person_AvailableTimes != null)
                {
                    result.Add(availableTime.Person_AvailableTimes.Count);
                }
            }
            return result;
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

        // GET: api/5/Participants/AvailableTimes/Counts
        [HttpGet("{roomId}/Participants/AvailableTimes/Counts2")]
        public async Task<ActionResult<IEnumerable<Room>>> GetAvailableTimeCountsForParticipants2(int roomId)
        {
            // Retrieve the room with participants
            var room = await _context.Rooms
                                    .Include(r => r.Participants)
                                    .ThenInclude(n => n.Person_AvailableTimes) // Include the Participants collection
                                    .FirstOrDefaultAsync(r => r.RoomId == roomId);

            if (room == null)
            {
                return NotFound(); // Return 404 if room not found
            }

            var timesWithUserId = _context.AvailableParticipants.Where(n => n.PersonId == roomId);

            return Ok(timesWithUserId);
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
