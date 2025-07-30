import { Request, Response } from 'express';
import UserModel, {
  userDTO,
  userUpdatePasswordDTO,
} from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import { isValidObjectId } from 'mongoose';

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
