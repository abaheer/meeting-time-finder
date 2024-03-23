using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }
        public string? Password { get; set; }
        public List<Person> Participants { get; set; }

    }
}
