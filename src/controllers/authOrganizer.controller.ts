import { Request, Response } from 'express';
import * as Yup from 'yup';
import response from '../utils/response';
import OrganizerModel from '../models/organizers.model';
import { encrypt } from '../utils/encryption';
import { generateTokenOrganizer } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';

type TypeRegisterOrganizer = {
  organizerName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contactPerson?: string;
  phone?: string;
  descriptionOrganizer?: string;
  dateEstablished: string;
  location: {
    domicile?: string;
    address?: string;
  };
};

type TypeOrganizerLogin = {
  identifier: string;
  password: string;
};

const registerOrganizerSchema = Yup.object({
  organizerName: Yup.string().required(),
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
  contactPerson: Yup.string(),
  descriptionOrganizer: Yup.string(),
  dateEstablished: Yup.string(),
  location: Yup.object({
    domicile: Yup.string(),
    address: Yup.string(),
  }).required(),
});

export default {
  async registerOrganizer(req: Request, res: Response) {
    const {
      organizerName,
      email,
      password,
      confirmPassword,
      contactPerson,
      phone,
      dateEstablished,
      descriptionOrganizer,
      location,
    } = req.body as unknown as TypeRegisterOrganizer;

    try {
      await registerOrganizerSchema.validate({
        organizerName,
        email,
        password,
        confirmPassword,
        contactPerson,
        phone,
        descriptionOrganizer,
        dateEstablished,
        location,
      });

      const organizer = await OrganizerModel.create({
        organizerName,
        email,
        password,
        contactPerson,
        phone,
        descriptionOrganizer,
        dateEstablished,
        location,
      });

      response.success(res, organizer, 'Success registration');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async loginOrganizer(req: Request, res: Response) {
    const { identifier, password } = req.body as unknown as TypeOrganizerLogin;
    try {
      const loginOrganizer = await OrganizerModel.findOne({
        $or: [
          {
            organizerName: identifier,
          },
          {
            email: identifier,
          },
        ],
        active: true,
      });
      if (!loginOrganizer)
        return response.unauthorized(res, 'Organizer not found');

      const validatePassword: boolean =
        encrypt(password) === loginOrganizer.password;
      if (!validatePassword)
        return response.unauthorized(res, 'Invalid password');

      const token = generateTokenOrganizer({
        id: loginOrganizer._id,
        role: loginOrganizer.role,
      });
      response.success(res, token, 'Success login!');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async activationOrganizer(req: Request, res: Response) {
    try {
      const { code } = req.body as { code: string };
      const organizer = await OrganizerModel.findOneAndUpdate(
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
      if (!organizer) return response.notFound(res, 'Organizer not found');

      response.success(res, organizer, 'Success activation');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getOrganizer(req: IReqUser, res: Response) {
    try {
      const organizer = req.organizer;
      const result = await OrganizerModel.findById(organizer?.id);
      if (!result)
        return response.notFound(res, 'Organizer not found or token invalid');

      response.success(res, result, 'Success get organizer profile');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
