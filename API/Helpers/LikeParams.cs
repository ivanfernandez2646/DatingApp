namespace API.Helpers
{
    public class LikeParams : UserParams
    {
        public string Predicate { get; set; } = "liked";
    }
}