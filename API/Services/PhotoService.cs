using System.IO;
using System.Threading.Tasks;
using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace API.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        public PhotoService(IOptions<CloudinarySettings> config)
        {
            var acc = new Account(
                config.Value.Cloud,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        public async Task<ImageUploadResult> UploadPhotoToCloudinary(IFormFile img)
        {
            var uploadParams = new ImageUploadParams()
            {
                Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")                
            };
           
            using (var memoryStream = new MemoryStream())
            {
                await img.CopyToAsync(memoryStream);

                memoryStream.Position = 0;

                uploadParams.File = new FileDescription(img.FileName, memoryStream);
                return await _cloudinary.UploadAsync(uploadParams);
            }
        }

        public async Task<DelResResult> DeletePhotoFromCloudinary(string publicPhotoId)
        {
            var result = await _cloudinary.DeleteResourcesAsync(ResourceType.Image, new string[] {publicPhotoId});
            return result;
        }
    }
}