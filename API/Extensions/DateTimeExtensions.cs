using System;

namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            //Subtract one year if dateOfBirth is bigger than (currentDate - age)
            if(dateOfBirth.Date > DateTime.Today.AddYears(-age)) age--;
            return age;  
        }
    }
}