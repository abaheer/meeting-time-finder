using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Person_AvailableTimeController : ControllerBase
    {
        private readonly MeetingDbContext _context;

        public Person_AvailableTimeController(MeetingDbContext context)
        {
            _context = context;
        }

        // GET: api/Person_AvailableTime
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person_AvailableTime>>> GetAvailableParticipants()
        {
            return await _context.AvailableParticipants.Include(av => av.AvailableTime).ToListAsync();
        }

        // GET: api/Person_AvailableTime/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person_AvailableTime>> GetPerson_AvailableTime(int id)
        {
            var person_AvailableTime = await _context.AvailableParticipants.FindAsync(id);

            if (person_AvailableTime == null)
            {
                return NotFound();
            }

            return person_AvailableTime;
        }


        // PUT: api/Person_AvailableTime/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson_AvailableTime(int id, Person_AvailableTime person_AvailableTime)
        {
            if (id != person_AvailableTime.Id)
            {
                return BadRequest();
            }

            _context.Entry(person_AvailableTime).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Person_AvailableTimeExists(id))
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

        // POST: api/Person_AvailableTime
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Person_AvailableTime>> PostPerson_AvailableTime(Person_AvailableTime person_AvailableTime)
        {
            _context.AvailableParticipants.Add(person_AvailableTime);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPerson_AvailableTime", new { id = person_AvailableTime.Id }, person_AvailableTime);
        }

        // DELETE: api/Person_AvailableTime/5
        [HttpDelete("{roomId}/{personId}/{dateString}")]
        public async Task<IActionResult> DeletePerson_AvailableTime(int roomId, int personId, string dateString)
        {
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

            var availableTimeId = await _context.AvailableTime.FirstOrDefaultAsync(t => t.RoomId == roomId && t.Time == newDate);
            
            
            if (availableTimeId == null)
            {
                return NotFound(newDate);
            }

            var person_AvailableTime = await _context.AvailableParticipants.FirstOrDefaultAsync(p => p.PersonId == personId && p.AvailableTimeId == availableTimeId.AvailableTimeId);
            if (person_AvailableTime == null)
            {
                return NotFound(availableTimeId);
            }

            _context.AvailableParticipants.Remove(person_AvailableTime);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool Person_AvailableTimeExists(int id)
        {
            return _context.AvailableParticipants.Any(e => e.Id == id);
        }
    }
}
