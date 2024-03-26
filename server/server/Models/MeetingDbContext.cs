using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Client;

namespace server.Models
{
    public class MeetingDbContext:DbContext
    {
        public MeetingDbContext(DbContextOptions<MeetingDbContext> options) : base(options) { }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<Person> Participants { get; set; }
        public DbSet<AvailableTime> AvailableTime { get; set; }
        public DbSet<Person_AvailableTime> AvailableParticipants { get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person_AvailableTime>()
                .HasOne(x => x.Person)
                .WithMany(xy => xy.Person_AvailableTimes)
                .HasForeignKey(xz => xz.PersonId);


            modelBuilder.Entity<Person_AvailableTime>()
                .HasOne(x => x.AvailableTime)
                .WithMany(xy => xy.Person_AvailableTimes)
                .HasForeignKey(xz => xz.AvailableTimeId);
        }
    }
}
