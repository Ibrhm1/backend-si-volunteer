import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel, {
  userDTO,
  userLoginDTO,
  userUpdatePasswordDTO,
} from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import { isValidObjectId } from 'mongoose';
import OrganizerModel from '../models/organizers.model';

export default {
  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      await userLoginDTO.validate({ identifier, password });

      const user = await UserModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
        active: true,
      });

      if (user) {
        const isPasswordValid = encrypt(password) === user.password;
        if (!isPasswordValid)
          return response.unauthorized(res, 'Invalid password');

        const token = generateToken({
          id: user._id,
          role: user.role,
        });
        return response.success(res, token, 'Success login as user!');
      }

      const organizer = await OrganizerModel.findOne({
        $or: [{ email: identifier }, { organizerName: identifier }],
        active: true,
      });
      if (!organizer) {
        return response.notFound(res, 'Account not found');
      }

      const isPasswordValid = encrypt(password) === organizer.password;
      if (!isPasswordValid)
        return response.unauthorized(res, 'Invalid password');

      const token = generateToken({
        id: organizer._id,
        role: organizer.role,
      });

      return response.success(res, token, 'Success login as organizer!');
    } catch (error) {
      const err = error as Error;
      return response.error(res, error, err.message);
    }
  },
  async getProfile(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      if (user?.role === 'member' || user?.role === 'admin') {
        const result = await UserModel.findById(user.id);
        if (!result) return response.notFound(res, 'User not found');
        response.success(res, result, 'Success get profile user');
      }

      if (user?.role === 'organizer') {
        const result = await OrganizerModel.findById(user.id);
        if (!result) return response.notFound(res, 'Organizer not found');
        response.success(res, result, 'Success get profile organizer');
      }
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async activation(req: Request, res: Response) {
    try {
      const { code } = req.body as { code: string };
      const user = await UserModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        {
          active: true,
        },
        {
          new: true,
        }
      );
      if (user)
        return response.success(
          res,
          user,
          'User account activated successfully'
        );

      const organizer = await OrganizerModel.findOneAndUpdate(
        {
          activationCode: code,
        },
        { active: true },
        { new: true }
      );
      if (organizer)
        return response.success(
          res,
          organizer,
          'Organizer account activated successfully'
        );

      return response.notFound(res, 'Activation code not found');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
