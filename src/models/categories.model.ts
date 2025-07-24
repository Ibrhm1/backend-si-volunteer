import mongoose from 'mongoose';
import * as Yup from 'yup';

const Schema = mongoose.Schema;
export const CATEGORY_MODEL_NAME = 'Category';

export const categoryDAO = Yup.object({
  name: Yup.string().required(),
  description: Yup.string().required(),
  image: Yup.string().required(),
});

export type category = Yup.InferType<typeof categoryDAO>;

const categorySchema = new Schema<category>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
).index({ name: 'text' });

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;
