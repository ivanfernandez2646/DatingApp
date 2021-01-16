namespace API.Helpers
{
    public class UserParams : GenericParams
    {
        public string CurrentUsername { get; set; }
        public int MinAge { get; set; } = 18;
        public int MaxAge { get; set; } = 120;
        public string Gender { get; set; }
        public string OrderBy { get; set; } = "lastActive";
    }
}