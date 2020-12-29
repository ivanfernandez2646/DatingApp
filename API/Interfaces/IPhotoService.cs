using System.Threading.Tasks;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace API.Interfaces
{
    public interface IPhotoService
    {
        Task<ImageUploadResult> UploadPhotoToCloudinary(IFormFile img);
        Task<DelResResult> DeletePhotoFromCloudinary(string publicPhotoId);
    }
}