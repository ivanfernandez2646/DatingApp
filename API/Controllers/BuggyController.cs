using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        /*
            5 TYPE OF ERRORS:

            1 -. 400 Bad Request
            2 -. 401 Unathourized
            3 -. 404 Not Found
            4 -. 500 Server Error
            5 -. 400 Bad Request(Validation fields)
        */

        public BuggyController(DataContext context) : base(context)
        {
        }

        [HttpGet("bad-request")]
        public ActionResult<string> Get400BadRequest()
        {
            return BadRequest("This route doesn't exist");
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> Get401Unauthorized()
        {
            return "secret text";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> Get404NotFound()
        {
            AppUser user = _context.Users.Find(-1);

            if(user == null) return NotFound();

            return Ok();
        }

        [HttpGet("server-error")]
        public ActionResult<string> Get500ServerError(){
            AppUser user = _context.Users.Find(-1);
            return user.ToString(); 
        }
    }
}