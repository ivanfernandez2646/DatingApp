using System.Text.Json;
using API.Helpers;
using Microsoft.AspNetCore.Http;

namespace API.Extensions
{
    public static class HttpResponseExtensions
    {
        public static void AddPaginationHeaders(this HttpResponse response, int pageNumber, int totalPages, 
            int pageSize, int totalCount)
        {
            var paginationHeader = new PaginationHeader(pageNumber, totalPages, pageSize, totalCount);

            var options = new JsonSerializerOptions()
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            response.Headers.Add("X-Pagination", JsonSerializer.Serialize<PaginationHeader>(paginationHeader, options));
            response.Headers.Add("Access-Control-Expose-Headers", "X-Pagination");
        }
    }
}