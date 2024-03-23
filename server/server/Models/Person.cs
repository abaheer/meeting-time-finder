using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Person
    {
        [Key]
        public int PersonId { get; set; }
        public required string Name { get; set; }

        public required Room Room { get; set; }
        public ICollection<AvailableTime>? PersonAvailableTimes { get; set; }
    }
}