using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }
        public required string RoomName { get; set; }
        public string? Password { get; set; }
        public int? MeetingStart { get; set; }
        public int? MeetingEnd { get; set; }
        public int? TimeInterval { get; set; }
        public ICollection<AvailableTime>? AvailableTimes { get; set; }
        public ICollection<Person>? Participants {  get; set; }

    }
}
