import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel, {
  userDTO,
  userLoginDTO,
  userUpdatePasswordDTO,
} from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';
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

  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      await userLoginDTO.validate({ identifier, password });
      const userByIdentifier = await UserModel.findOne({
        $or: [
          {
            email: identifier,
          },
          {
            username: identifier,
          },
        ],
        active: true,
      });
      if (!userByIdentifier)
        return response.unauthorized(res, 'User not found');

      const validatePassword: boolean =
        encrypt(password) === userByIdentifier.password;
      if (!validatePassword)
        return response.unauthorized(res, 'Invalid password');

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      response.success(res, token, 'Success login!');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },

  async getProfile(req: IReqUser, res: Response) {
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);
      response.success(res, result, 'Success get user profile');
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

      if (!user) return response.notFound(res, 'User not found');

      response.success(res, user, 'Success activation');
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
