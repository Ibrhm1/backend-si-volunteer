import mongoose, { ObjectId } from 'mongoose';
import * as Yup from 'yup';
import { ORGANIZER_MODEL_NAME } from './organizers.model';
import { CATEGORY_MODEL_NAME } from './categories.model';

export const EVENT_MODEL_NAME = 'Event';
const Schema = mongoose.Schema;

export const EventDAO = Yup.object({
  name: Yup.string()
    .required('Event name is required')
    .max(100, 'Event name must not be more than 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description must be at least 20 characters'),
  startDate: Yup.string().required('Start date is required'),
  endDate: Yup.string().required('End Date Is Required'),
  image: Yup.string().required('Image is required'),
  category: Yup.string().required('Category is required'),
  isOnline: Yup.boolean().required('Online status is required'),
  isPublish: Yup.boolean().required('Publish status is required'),
  isFeatured: Yup.boolean().required('Featured status is required'),
  location: Yup.object().shape({
    region: Yup.number().required('Region is required'),
    address: Yup.string().required('Address is required'),
  }),
  requiredVolunteers: Yup.number()
    .required('The number of volunteers needed must be filled in')
    .min(1, 'Minimum number of volunteers is 1'),
  currentVolunteers: Yup.number(),
  requirements: Yup.string().required('Requirements are required'),
  benefits: Yup.string(),
  tags: Yup.array().of(Yup.string().max(30)).optional(),
  slug: Yup.string(),
  createdAt: Yup.string(),
  updatedAt: Yup.string(),
  createdBy: Yup.string().required(),
});

export type TypeEvent = Yup.InferType<typeof EventDAO>;

export interface IEvent extends Omit<TypeEvent, 'category' | 'createdBy'> {
  category: ObjectId;
  createdBy: ObjectId;
}

const EventSchema = new Schema<IEvent>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
    },
    startDate: {
      type: Schema.Types.String,
      required: true,
    },
    endDate: {
      type: Schema.Types.String,
      required: true,
    },
    image: {
      type: Schema.Types.String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: CATEGORY_MODEL_NAME,
    },
    isOnline: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isPublish: {
      type: Schema.Types.Boolean,
      required: true,
    },
    isFeatured: {
      type: Schema.Types.Boolean,
      required: true,
    },
    location: {
      type: {
        region: {
          type: Schema.Types.Number,
        },
        address: {
          type: Schema.Types.String,
        },
      },
    },
    requiredVolunteers: {
      type: Schema.Types.Number,
      reuired: true,
    },
    currentVolunteers: {
      type: Schema.Types.Number,
    },
    requirements: {
      type: Schema.Types.String,
      required: true,
    },
    benefits: {
      type: Schema.Types.String,
    },
    tags: {
      type: [Schema.Types.String],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: ORGANIZER_MODEL_NAME,
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
).index({ name: 'text' });

EventSchema.pre('save', function () {
  if (!this.slug) {
    const slug = this.name.split(' ').join('-').toLowerCase();
    this.slug = `${slug}`;
  }
});

const EventModel = mongoose.model(EVENT_MODEL_NAME, EventSchema);
export default EventModel;
