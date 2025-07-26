import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import EventModel, { EventDAO, TypeEvent } from '../models/events.model';
import { FilterQuery, isValidObjectId } from 'mongoose';

export default {
  async createEvent(req: IReqUser, res: Response) {
    try {
      const payload = {
        ...req.body,
        createdBy: req.organizer?.id,
      } as TypeEvent;
      await EventDAO.validate(payload);
      const result = await EventModel.create(payload);
      response.success(res, result, 'Success create event');
    } catch (error) {
      response.error(res, error, 'Failed');
    }
  },
  async getAllEvents(req: IReqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeEvent> = {};

        if (filter.search) query.$text = { $search: filter.search };
        if (filter.category) query.category = filter.category;
        if (filter.isOnline) query.isOnline = filter.isOnline;
        if (filter.isPublish) query.isPublish = filter.isPublish;
        return query;
      };

      const {
        limit = 10,
        page = 1,
        search,
        isOnline,
        isPublish,
        category,
      } = req.query;

      const query = buildQuery({
        search,
        category,
        isOnline,
        isPublish,
      });

      const result = await EventModel.find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .lean()
        .exec();
      const count = await EventModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        'Success get all events'
      );
    } catch (error) {
      response.error(res, error, 'Failed get all events');
    }
  },
  async getEventById(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return response.notFound(res, 'Event not found');

      const result = await EventModel.findById(id);

      if (!result) return response.notFound(res, 'Event not found');

      response.success(res, result, 'Success get event by id');
    } catch (error) {
      response.error(res, error, 'Failed get event by id');
    }
  },
  async updateEvent(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return response.notFound(res, 'Event not found');

      const result = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, 'Success update event');
    } catch (error) {
      response.error(res, error, 'Failed update event');
    }
  },
  async deleteEvent(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id))
        return response.notFound(res, 'Event not found');

      const result = await EventModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, 'Success delete event');
    } catch (error) {
      response.error(res, error, 'Failed delete event');
    }
  },
  async getEventBySlug(req: IReqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await EventModel.findOne({ slug });

      if (!result) return response.notFound(res, 'Event not found');

      response.success(res, result, 'Success get event by slug');
    } catch (error) {
      response.error(res, error, 'Failed get event by slug');
    }
  },
};
