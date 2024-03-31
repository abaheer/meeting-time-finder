using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AvailableTimesController : ControllerBase
    {
        private readonly MeetingDbContext _context;

        public AvailableTimesController(MeetingDbContext context)
        {
            _context = context;
        }

        // GET: api/AvailableTimes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AvailableTime>>> GetAvailableTime()
        {
            return await _context.AvailableTime.ToListAsync();
        }

        // GET: api/AvailableTimes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AvailableTime>> GetAvailableTime(int id)
        {
            var availableTime = await _context.AvailableTime.FindAsync(id);

            if (availableTime == null)
            {
                return NotFound();
            }

            return availableTime;
        }

        // PUT: api/AvailableTimes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAvailableTime(int id, AvailableTime availableTime)
        {
            if (id != availableTime.AvailableTimeId)
            {
                return BadRequest();
            }

            _context.Entry(availableTime).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AvailableTimeExists(id))
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

        // POST: api/AvailableTimes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AvailableTime>> PostAvailableTime(AvailableTime availableTime)
        {
            _context.AvailableTime.Add(availableTime);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAvailableTime", new { id = availableTime.AvailableTimeId }, availableTime);
        }

        // DELETE: api/AvailableTimes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAvailableTime(int id)
        {
            var availableTime = await _context.AvailableTime.FindAsync(id);
            if (availableTime == null)
            {
                return NotFound();
            }

            _context.AvailableTime.Remove(availableTime);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AvailableTimeExists(int id)
        {
            return _context.AvailableTime.Any(e => e.AvailableTimeId == id);
        }
    }
}
