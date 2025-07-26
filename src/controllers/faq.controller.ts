import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import FaqModel, { faqDAO } from '../models/faq.model';
import { isValidObjectId } from 'mongoose';

export default {
  async createFAQ(req: IReqUser, res: Response) {
    try {
      await faqDAO.validate(req.body);
      const result = await FaqModel.create(req.body);
      response.success(res, result, 'Success create faq');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getFAQ(req: IReqUser, res: Response) {
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
      const result = await FaqModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await FaqModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        'Success get faqs'
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getFAQById(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) return response.notFound(res, 'FAQ not found');

      const result = await FaqModel.findById(id);
      if (!result) return response.notFound(res, 'FAQ not found');

      response.success(res, result, 'Success get faq by id');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async updateFAQ(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) return response.notFound(res, 'FAQ not found');

      const result = await FaqModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!result) return response.notFound(res, 'FAQ not found');

      response.success(res, result, 'Success update faq');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async deleteFAQ(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) return response.notFound(res, 'FAQ not found');

      const result = await FaqModel.findByIdAndDelete(id, { new: true });
      if (!result) return response.notFound(res, 'FAQ not found');

      response.success(res, result, 'Success delete');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
