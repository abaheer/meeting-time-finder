using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class AvailableTime
    {
        [Key]
        public int AvailableTimeId { get; set; }
        public required DateTime Time { get; set; }

        // navigation
        public int? RoomId { get; set; }
        public Room? Room { get; set; }
        public ICollection<Person_AvailableTime>? Person_AvailableTimes { get; set; }

    }
}
