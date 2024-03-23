using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class AvailableTime
    {
        [Key]
        public int AvailableTimeId { get; set; }
        public required DateTime Time { get; set; }

        public ICollection<Person>? PersonAvailableTimes { get; set; }

    }
}
