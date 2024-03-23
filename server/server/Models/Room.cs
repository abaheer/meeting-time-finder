using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }
        public string? RoomName { get; set; }
        public string? Password { get; set; }
        public DateTime? MeetingStart { get; set; }
        public DateTime? MeetingEnd { get; set; }
        public int? TimeInterval {  get; set; }
        public required ICollection<Person> Participants { get; set; }

    }
}
