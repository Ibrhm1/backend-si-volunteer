import { Request, Response } from 'express';
import response from '../utils/response';
import OrganizerModel, {
  organizerDTO,
  organizerLoginDTO,
  organizerUpdatePasswordDTO,
} from '../models/organizers.model';
import { encrypt } from '../utils/encryption';
import { generateTokenOrganizer } from '../utils/jwt';
import { IReqUser } from '../utils/interfaces';

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
    } = req.body;

    try {
      await organizerDTO.validate({
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
    try {
      const { identifier, password } = req.body;
      await organizerLoginDTO.validate({ identifier, password });
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

  async updateProfileOrganizer(req: IReqUser, res: Response) {
    try {
      const organizerId = req.organizer?.id;
      if (!organizerId) return response.notFound(res, 'Organizer not found');

      const {
        organizerName,
        contactPerson,
        phone,
        descriptionOrganizer,
        dateEstablished,
        logo,
        location,
        domicile,
        address,
      } = req.body;
      const result = await OrganizerModel.findByIdAndUpdate(
        organizerId,
        {
          organizerName,
          contactPerson,
          phone,
          descriptionOrganizer,
          dateEstablished,
          logo,
          location,
          domicile,
          address,
        },
        { new: true }
      );
      if (!result) return response.notFound(res, 'Organizer not found');

      response.success(res, result, 'Success update profile');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async updatePasswordOrganizer(req: IReqUser, res: Response) {
    try {
      const organizerId = req.organizer?.id;
      if (!organizerId) return response.notFound(res, 'Organizer not found');
      const { oldPassword, password, confirmPassword } = req.body;

      await organizerUpdatePasswordDTO.validate({
        oldPassword,
        password,
        confirmPassword,
      });

      const organizer = await OrganizerModel.findById(organizerId);
      if (!organizer || organizer.password !== encrypt(oldPassword))
        return response.notFound(res, 'User not found');

      const result = await OrganizerModel.findByIdAndUpdate(
        organizerId,
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
