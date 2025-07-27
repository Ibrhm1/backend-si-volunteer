import { Response } from 'express';
import { IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import EventVolunteerModel, {
  eventVolunteerDAO,
  TypeEventVolunteer,
} from '../models/eventVolunteer.model';
import { FilterQuery, isValidObjectId } from 'mongoose';
import EventModel from '../models/events.model';

export default {
  async createEventVolunteer(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;
      if (!isValidObjectId(eventId))
        return response.notFound(res, 'Event not found');
      //* ambil event berdasarkan id yang dipilih
      const event = await EventModel.findById(eventId);
      if (!event) return response.notFound(res, 'Event not found');
      //* cek current volunteer
      const currentCount = Array.isArray(event.currentVolunteers)
        ? event.currentVolunteers.length
        : 0;
      //* cek apakah event sudah penuh
      if (currentCount >= event.requiredVolunteers)
        return response.conflict(res, 'Event is full');
      //* cek apakah sudah mendaftar
      const exiting = await EventVolunteerModel.findOne({
        eventId,
        userId: req.user?.id,
      });
      if (exiting) return response.conflict(res, 'You are already registered');

      const payload = {
        ...req.body,
        eventId: eventId,
        userId: req.user?.id,
      };
      await eventVolunteerDAO.validate(payload);

      await EventModel.findByIdAndUpdate(
        eventId,
        {
          $addToSet: { currentVolunteers: req.user?.id },
        },
        { new: true }
      );

      const result = await EventVolunteerModel.create(payload);
      if (!result) return response.notFound(res, 'EventVolunteer not found');
      response.success(res, result, 'Success create eventVolunteer');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getAllEventVolunteers(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeEventVolunteer> = {};
        if (filter.eventId) query.eventId = filter.eventId;
        if (filter.userId) query.userId = filter.userId;
        return query;
      };

      const { limit = 10, page = 1, eventId, userId } = req.query;
      const query = buildQuery({ eventId, userId });

      const result = await EventVolunteerModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();

      const count = await EventVolunteerModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        'Success get eventVolunteers'
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getEventVolunteerByEvent(req: IReqUser, res: Response) {
    try {
      const { eventId } = req.params;
      if (!isValidObjectId(eventId))
        return response.notFound(res, 'Id is not valid');

      const result = await EventVolunteerModel.find({ eventId });
      if (!result) return response.notFound(res, 'Event Volunteer not found');

      response.success(res, result, 'Success get eventVolunteer');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async updateStatusEventVolunteer(req: IReqUser, res: Response) {
    try {
      const { eventVolunteerId } = req.params;
      if (!isValidObjectId(eventVolunteerId))
        return response.notFound(res, 'EventVolunteer not found');

      const result = await EventVolunteerModel.findByIdAndUpdate(
        eventVolunteerId,
        { status: req.body.status },
        { new: true }
      );
      if (!result) return response.notFound(res, 'EventVolunteer not found');
      response.success(res, result, 'Success update eventVolunteer');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async deleteEventVolunteer(req: IReqUser, res: Response) {
    try {
      const { eventVolunteerId } = req.params;
      if (!isValidObjectId(eventVolunteerId))
        return response.notFound(res, 'Id is not valid');

      const volunteer = await EventVolunteerModel.findById(eventVolunteerId);
      if (!volunteer)
        return response.notFound(res, 'Event Volunteer not found');

      await EventModel.findByIdAndUpdate(
        volunteer.eventId,
        {
          $pull: { currentVolunteers: volunteer.userId },
        },
        { new: true }
      );

      const result = await EventVolunteerModel.findByIdAndDelete(
        eventVolunteerId,
        { new: true }
      );
      response.success(res, result, 'Success delete eventVolunteer');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
