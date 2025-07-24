import { Response } from 'express';
import { IPaginationQuery, IReqUser } from '../utils/interfaces';
import response from '../utils/response';
import CategoryModel, { categoryDAO } from '../models/categories.model';
import { create } from 'ts-node';
import { isValidObjectId } from 'mongoose';

export default {
  async createCategory(req: IReqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.success(res, result, 'Success create category');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getCategory(req: IReqUser, res: Response) {
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

      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: page,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
        'Success get category'
      );
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async getCategoryById(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return response.notFound(res, 'Category not found');

      const result = await CategoryModel.findById(id);
      if (!result) return response.notFound(res, 'Category not found');

      response.success(res, result, 'Success get category');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async updateCategory(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return response.notFound(res, 'Category not found');

      const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!result) return response.notFound(res, 'Category not found');

      response.success(res, result, 'Success update category');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
  async deleteCategory(req: IReqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id))
        return response.notFound(res, 'Category not found');

      const result = await CategoryModel.findByIdAndDelete(id, { new: true });
      if (!result) return response.notFound(res, 'Category not found');

      response.success(res, result, 'Success delete category');
    } catch (error) {
      const err = error as unknown as Error;
      response.error(res, error, err.message);
    }
  },
};
