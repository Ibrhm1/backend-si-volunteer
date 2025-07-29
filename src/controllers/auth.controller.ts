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
  async register(req: Request, res: Response) {
    const {
      fullName,
      username,
      email,
      password,
      confirmPassword,
      address,
      phone,
    } = req.body;
    try {
      await userDTO.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
        address,
        phone,
      });

      const user = await UserModel.create({
        fullName,
        username,
        email,
        password,
        address,
        phone,
      });

      response.success(res, user, 'Success registration');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },

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
      if (user?.role === 'member') {
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
  async getAllUser(req: IReqUser, res: Response) {
    try {
      const { limit = 10, page = 1 } = req.query as unknown as IPaginationQuery;

      const result = await UserModel.find({ role: 'member' })
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await UserModel.countDocuments({ role: 'member' });
      response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        'Success get users'
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) return response.notFound(res, 'User not found');

      const result = await UserModel.findById(id);
      if (!result) return response.error(res, result, 'User not found');
      response.success(res, result, 'Success get user by id');
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

  async updateProfile(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return response.notFound(res, 'User not found');
      const { fullName, profilePicture, phone, address } = req.body;
      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          fullName,
          profilePicture,
          phone,
          address,
        },
        {
          new: true,
        }
      );
      if (!result) return response.notFound(res, 'User not found');

      response.success(res, result, 'Success update profile');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async updatePassword(req: IReqUser, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return response.notFound(res, 'User not found');
      const { oldPassword, password, confirmPassword } = req.body;

      await userUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      const user = await UserModel.findById(userId);
      if (!user || user.password !== encrypt(oldPassword))
        return response.notFound(res, 'User not found');

      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          password: encrypt(password),
        },
        { new: true }
      );
      response.success(res, result, 'Success update password');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
