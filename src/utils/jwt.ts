import jwt from 'jsonwebtoken';
import { SECRET } from './env';
import { IOrganizerToken, IUserToken } from './interfaces';

export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export const generateTokenOrganizer = (organizer: IOrganizerToken): string => {
  const token = jwt.sign(organizer, SECRET, {
    expiresIn: '1h',
  });
  return token;
};

export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};

export const getOrganizerData = (token: string) => {
  const organizer = jwt.verify(token, SECRET) as IOrganizerToken;
  return organizer;
};
