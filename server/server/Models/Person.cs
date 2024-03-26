using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Person
    {
        [Key]
        public int PersonId { get; set; }
        public required string PersonName { get; set; }

        // navigation
        public int? RoomId { get; set; }
        public Room? Room { get; set; }
        public ICollection<Person_AvailableTime>? Person_AvailableTimes { get; set; }
    }
}