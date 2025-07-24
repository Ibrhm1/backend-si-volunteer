import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
});

export default {
  singleUpload(fieldName: string) {
    return upload.single(fieldName);
  },
};
