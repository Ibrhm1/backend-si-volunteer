import { v2 as cloudinary } from 'cloudinary';
import {
  API_CLOUDINARY_NAME,
  API_CLOUDINARY_KEY,
  API_CLOUDINARY_SECRET,
} from './env';

cloudinary.config({
  cloud_name: API_CLOUDINARY_NAME,
  api_key: API_CLOUDINARY_KEY,
  api_secret: API_CLOUDINARY_SECRET,
});

const toDataUrl = (file: Express.Multer.File) => {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataUrl = `data:${file.mimetype};base64,${b64}`;
  return dataUrl;
};

const getPublicIdFromFileUrl = (fileUrl: string) => {
  const fileNameUsingSubstring = fileUrl.substring(
    fileUrl.lastIndexOf('/') + 1
  );
  const publicId = fileNameUsingSubstring.substring(
    0,
    fileNameUsingSubstring.lastIndexOf('.')
  );
  return publicId;
};

export default {
  async uploadSingle(file: Express.Multer.File) {
    const fileDataUrl = toDataUrl(file);

    const result = await cloudinary.uploader.upload(fileDataUrl, {
      resource_type: 'auto',
    });
    return result;
  },
  async uploadMultiple(files: Express.Multer.File[]) {
    const uploadBatch = files.map((item) => {
      const result = this.uploadSingle(item);
      return result;
    });
    const results = await Promise.all(uploadBatch);
    return results;
  },
  async remove(fileUrl: string) {
    const publicId = getPublicIdFromFileUrl(fileUrl);
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  },
};
