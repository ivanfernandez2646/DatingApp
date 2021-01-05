using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int PageNumber { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PagedList(IEnumerable<T> list, int pageNumber, int pageSize, int totalCount)
        {
            PageNumber = pageNumber;
            TotalPages = (int) Math.Ceiling((double)totalCount / pageSize);
            PageSize = pageSize;
            TotalCount = totalCount;
            AddRange(list);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var count = await source.CountAsync();
            var query = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

            return new PagedList<T>(query, pageNumber, pageSize, count);
        }
    }
}