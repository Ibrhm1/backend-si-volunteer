import { Request, Response } from 'express';
import * as Yup from 'yup';
import UserModel from '../models/user.model';
import { encrypt } from '../utils/encryption';
import { generateToken } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';
import response from '../utils/response';

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string()
    .required()
    .min(6, 'Password must be at least 6 characters')
    .test(
      'at least one uppercase',
      'Password must contain at least one uppercase letter',
      (value) => /[A-Z]/.test(value || '')
    )
    .test(
      'at least one number',
      'Password must contain at least one number',
      (value) => /[0-9]/.test(value || '')
    ),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('password'), ''], "Password doesn't match"),
});

export default {
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } =
      req.body as unknown as TRegister;
    try {
      await registerValidateSchema.validate({
        fullName,
        username,
        email,
        password,
        confirmPassword,
      });

      const user = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });

      response.success(res, user, 'Success registration');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async login(req: Request, res: Response) {
    const { identifier, password } = req.body as unknown as TLogin;
    try {
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
};
