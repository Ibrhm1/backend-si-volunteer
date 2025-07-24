import { Response } from 'express';
import { IReqUser } from '../utils/interfaces';
import uploader from '../utils/uploader';
import response from '../utils/response';

export default {
  async uploadSingle(req: IReqUser, res: Response) {
    if (!req.file) return response.error(res, null, 'File is not exist');
    try {
      const result = await uploader.uploadSingle(
        req.file as Express.Multer.File
      );
      response.success(res, result, 'Success upload a file');
    } catch {
      response.error(res, null, 'Failed upload file');
    }
  },
  async deleteFile(req: IReqUser, res: Response) {
    try {
      const { fileUrl } = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      response.success(res, result, 'Success remove file');
    } catch {
      response.error(res, null, 'Failed remove file');
    }
  },
};
