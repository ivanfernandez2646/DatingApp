namespace API.DTOs
{
    public class LoginRegisterUserOutputDTO
    {
        public string UserName { get; set; }
        
        public string Token { get; set; }
        public string PhotoUrl { get; set; }
        public string KnownAs { get; set; }
    }
}