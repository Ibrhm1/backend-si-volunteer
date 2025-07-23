import { Types } from 'mongoose';
import { IUser } from '../models/user.model';
import { Request } from 'express';
import { IOrganizer } from '../models/organizers.model';

export interface IUserToken
  extends Omit<
    IUser,
    'fullName' | 'email' | 'username' | 'password' | 'activationCode' | 'active'
  > {
  id?: Types.ObjectId;
}

export interface IOrganizerToken
  extends Omit<
    IOrganizer,
    'organizerName' | 'email' | 'password' | 'active' | 'activationCode'
  > {
  id?: Types.ObjectId;
}

export interface IReqUser extends Request {
  user?: IUserToken;
  organizer?: IOrganizerToken;
}

export interface IPaginationQuery {
  page: number;
  limit: number;
  search?: string;
}
