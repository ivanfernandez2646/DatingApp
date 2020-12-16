using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class MemberUpdateDTO
    {
        [Required]
        public string Introduction { get; set; }

        [Required]
        public string LookingFor { get; set; }

        [Required]
        public string Interests { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Country { get; set; }
    }
}