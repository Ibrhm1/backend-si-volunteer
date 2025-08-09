import { NextFunction, Request, Response } from 'express';
import response from '../utils/response';

export default {
  serverRouter() {
    return (req: Request, res: Response, next: NextFunction) => {
      response.notFound(res, 'Route not found');
    };
  },
  serverError() {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
      response.error(res, err, err.message);
    };
  },
};
