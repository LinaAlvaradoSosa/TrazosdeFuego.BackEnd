import streamifier from 'streamifier';
import cloudinary from './cloudinary.js';

export function uploadToCloudinary(buffer, folder = 'uploads') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
            if (result) {
            resolve(result);
            } else {
            reject(error);
            }
        }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}
