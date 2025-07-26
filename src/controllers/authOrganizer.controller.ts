import { Request, Response } from 'express';
import response from '../utils/response';
import OrganizerModel, {
  organizerDTO,
  organizerLoginDTO,
  organizerUpdatePasswordDTO,
} from '../models/organizers.model';
import { encrypt } from '../utils/encryption';
import { generateTokenOrganizer } from '../utils/jwt';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import { isValidObjectId } from 'mongoose';

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
      if (!loginOrganizer) return response.notFound(res, 'Organizer not found');
      if (!loginOrganizer?.activationCode)
        return response.unauthorized(res, 'Organizer is not active');

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
  async getAllOrganizers(req: IReqUser, res: Response) {
    const {
      limit = 10,
      page = 1,
      search,
    } = req.query as unknown as IPaginationQuery;
    try {
      const query = {};
      if (search) {
        Object.assign(query, {
          ...query,
          $text: { $search: search },
        });
      }

      const result = await OrganizerModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await OrganizerModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        'Success get all organizers'
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getOrganizerById(req: IReqUser, res: Response) {
    try {
      const { organizerId } = req.params;
      if (!isValidObjectId(organizerId))
        return response.notFound(res, 'Id is invalid');

      const result = await OrganizerModel.findById(organizerId);
      if (!result) return response.notFound(res, 'Organizer not found');

      response.success(res, result, 'Success get organizer by id');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async deleteOrganizer(req: IReqUser, res: Response) {
    try {
      const { organizerId } = req.params;
      if (!isValidObjectId(organizerId))
        return response.notFound(res, 'Id is invalid');

      const result = await OrganizerModel.findByIdAndDelete(organizerId, {
        new: true,
      });
      if (!result) return response.notFound(res, 'Organizer not found');

      response.success(res, result, 'Success delete organizer');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
