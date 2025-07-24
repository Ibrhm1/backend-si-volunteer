import { NextFunction, Request, Response } from 'express';
import { getUserData } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';
import response from '../utils/response';

export default (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers?.authorization;
  if (!authorization) return response.unauthorized(res);

  const [prefix, token] = authorization.split(' ');
  if (!(prefix === 'Bearer' && token))
    return response.unauthorized(res, 'Prefix not found');

  const user = getUserData(token);
  if (!user) return response.unauthorized(res, 'Invalid token');

  (req as IReqUser).user = user;

  const organizer = getUserData(token);
  if (!organizer) return response.unauthorized(res, 'Invalid token');

  (req as IReqUser).organizer = organizer;

  next();
};
