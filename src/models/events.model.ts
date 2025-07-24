import mongoose, { ObjectId } from 'mongoose';
import * as Yup from 'yup';
import { ORGANIZER_MODEL_NAME } from './organizers.model';
import { CATEGORY_MODEL_NAME } from './categories.model';

export const EVENT_MODEL_NAME = 'Event';
const Schema = mongoose.Schema;

export const EventDAO = Yup.object({
  name: Yup.string().required(),
  startDate: Yup.string().required(),
  endDate: Yup.string().required(),
  description: Yup.string().required(),
  image: Yup.string().required(),
  isOnline: Yup.boolean().required(),
  isPublish: Yup.boolean(),
  category: Yup.string().required(),
  slug: Yup.string(),
  createdBy: Yup.string().required(),
  createdAt: Yup.string(),
  updatedAt: Yup.string(),
  location: Yup.object()
    .shape({
      region: Yup.number().required(),
      address: Yup.string().required(),
    })
    .required(),
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
      default: false,
    },
    description: {
      type: Schema.Types.String,
      required: true,
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
