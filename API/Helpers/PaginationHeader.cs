namespace API.Helpers
{
    public class PaginationHeader
    {
        public int PageNumber { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PaginationHeader(int pageNumber, int totalPages, int pageSize, int totalCount) 
        {
            this.PageNumber = pageNumber;
            this.TotalPages = totalPages;
            this.PageSize = pageSize;
            this.TotalCount = totalCount; 
        }     
    }
}