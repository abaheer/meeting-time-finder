using Microsoft.Identity.Client;

namespace server.Models
{
    public class Person_AvailableTime
    {
        public int Id { get; set; }

        public int? AvailableTimeId { get; set; }
        public AvailableTime? AvailableTime { get; set; }

        public int? PersonId { get; set; }
        public Person? Person { get; set; }

    }
}
