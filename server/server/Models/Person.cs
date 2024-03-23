using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Person
    {
        [Key]
        public int PersonId { get; set; }
        public List<DateTime>? AvailibleTimes { get; set; }
    }
}
