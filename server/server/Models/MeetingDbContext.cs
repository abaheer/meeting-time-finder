using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace server.Models
{
    public class MeetingDbContext:DbContext
    {
        public MeetingDbContext(DbContextOptions<MeetingDbContext> options) : base(options) { }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Person> Participants { get; set; }
        public DbSet<AvailableTime> AvailableTime { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    modelBuilder.Entity<Person>()
        //        .HasMany(e => e.AvailableTimes)
        //        .WithMany(e => e.AvailableParticipants)
       //         .UsingEntity<PersonAvailableTime>();
        //}
    }
}
