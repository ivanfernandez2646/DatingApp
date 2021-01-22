namespace API.Helpers
{
    public class MessageParams : GenericParams
    {
        public int MessageId { get; set; }
        public string UserName { get; set; }
        public string Container { get; set; } = "unread";
    }
}