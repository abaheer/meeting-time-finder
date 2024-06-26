﻿using System;
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
    public class PeopleController : ControllerBase
    {
        private readonly MeetingDbContext _context;

        public PeopleController(MeetingDbContext context)
        {
            _context = context;
        }

        // GET: api/People
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetParticipants()
        {
            var participants = await _context.Participants
                                            .Include(p => p.Room) // EAGER LOADING OR WHATEVER
                                            .ToListAsync();

            return participants;
        }

        // GET: api/People/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await _context.Participants.FindAsync(id);

            if (person == null)
            {
                return NotFound();
            }

            return person;
        }
        // GET: api/People/5/GetTimes
        [HttpGet("{id}/GetTimes")]
        public async Task<ActionResult<IEnumerable<AvailableTime>>> GetPersonAvailableTimes(int id)
        {
            var person = await _context.Participants
                                        .Include(p => p.Person_AvailableTimes)
                                            .ThenInclude(pt => pt.AvailableTime)
                                        .FirstOrDefaultAsync(p => p.PersonId == id);

            if (person == null)
            {
                return NotFound();
            }

            var availableTimes = person.Person_AvailableTimes.Select(pt => pt.AvailableTime).ToList();

            return Ok(availableTimes);
        }
        // PUT: api/People/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(int id, Person person)
        {
            if (id != person.PersonId)
            {
                return BadRequest();
            }

            _context.Entry(person).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonExists(id))
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

        // POST: api/People
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Person>> PostPerson(Person person)
        {
            _context.Participants.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPerson", new { id = person.PersonId }, person);
        }

        // DELETE: api/People/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Participants.FindAsync(id);
            if (person == null)
            {
                return NotFound();
            }

            _context.Participants.Remove(person);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PersonExists(int id)
        {
            return _context.Participants.Any(e => e.PersonId == id);
        }
    }
}
