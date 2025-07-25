import { Types } from 'mongoose';
import { User } from '../models/user.model';
import { Request } from 'express';
import { IOrganizer } from '../models/organizers.model';

export interface IUserToken
  extends Omit<
    User,
    | 'fullName'
    | 'email'
    | 'username'
    | 'password'
    | 'activationCode'
    | 'active'
    | 'address'
    | 'phone'
    | 'profilePicture'
  > {
  id?: Types.ObjectId;
}

export interface IOrganizerToken
  extends Omit<
    IOrganizer,
    | 'organizerName'
    | 'email'
    | 'password'
    | 'active'
    | 'activationCode'
    | 'location'
    | 'phone'
    | 'contactPerson'
    | 'descriptionOrganizer'
    | 'dateEstablished'
    | 'logo'
    | 'verified'
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
