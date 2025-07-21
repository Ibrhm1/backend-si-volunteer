import { Types } from 'mongoose';
import { IUser } from '../models/user.model';
import { Request } from 'express';

export interface IReqUser extends Request {
  user?: IUserToken;
}

export interface IUserToken
  extends Omit<
    IUser,
    | 'fullName'
    | 'email'
    | 'username'
    | 'password'
    | 'activationCode'
    | 'isActive'
  > {
  id?: Types.ObjectId;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}
