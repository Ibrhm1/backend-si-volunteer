import mongoose, { ObjectId } from 'mongoose';
import * as Yup from 'yup';
import { STATUS } from '../utils/constant';
import { EVENT_MODEL_NAME } from './events.model';
import { USER_MODEL_NAME } from './user.model';

export const EVENTVOLUNTEER_MODEL_NAME = 'EventVolunteer';
const Schema = mongoose.Schema;

export const eventVolunteerDAO = Yup.object({
  eventId: Yup.string().required(),
  userId: Yup.string().required(),
  status: Yup.string().oneOf([
    STATUS.PENDING,
    STATUS.ACCEPTED,
    STATUS.REJECTED,
  ]),
  motivation: Yup.string().min(10).required(),
  experience: Yup.string().optional().max(500),
  skills: Yup.array().of(Yup.string()).min(1).required(),
  portfolioUrl: Yup.string().url().nullable(),
  registeredAt: Yup.string(),
  isVerified: Yup.boolean().default(false),
});

export type TypeEventVolunteer = Yup.InferType<typeof eventVolunteerDAO>;

export interface IEventVolunteer
  extends Omit<TypeEventVolunteer, 'eventId' | 'userId'> {
  eventId: ObjectId;
  userId: ObjectId;
}

const eventVolunteerSchema = new Schema<IEventVolunteer>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: EVENT_MODEL_NAME,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_MODEL_NAME,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: [STATUS.PENDING, STATUS.ACCEPTED, STATUS.REJECTED],
      default: STATUS.PENDING,
    },
    motivation: {
      type: Schema.Types.String,
      required: true,
    },
    experience: {
      type: Schema.Types.String,
      required: false,
    },
    skills: {
      type: [Schema.Types.String],
      required: true,
    },
    portfolioUrl: {
      type: Schema.Types.String,
      required: false,
    },
    registeredAt: {
      type: Schema.Types.String,
      required: false,
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const EventVolunteerModel = mongoose.model(
  EVENTVOLUNTEER_MODEL_NAME,
  eventVolunteerSchema
);
export default EventVolunteerModel;
