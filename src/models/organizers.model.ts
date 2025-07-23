import mongoose from 'mongoose';
import * as Yup from 'yup';
import { encrypt } from '../utils/encryption';
import { ROLES } from '../utils/constant';

const Schema = mongoose.Schema;

export const ORGANIZER_MODEL_NAME = 'Orginizer';

export interface IOrganizer {
  organizerName: string;
  email: string;
  password: string;
  role: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  logo?: string;
  verified?: boolean;
  active: boolean;
  activationCode: string;
  createdAt?: string;
}

const OrganizerSchema = new Schema<IOrganizer>(
  {
    organizerName: {
      type: Schema.Types.String,
      required: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    role: {
      type: Schema.Types.String,
      default: ROLES.ORGANIZER,
    },
    contactPerson: {
      type: Schema.Types.String,
    },
    phone: {
      type: Schema.Types.String,
    },
    address: {
      type: Schema.Types.String,
    },
    logo: {
      type: Schema.Types.String,
      default: 'logo.png',
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    active: {
      type: Schema.Types.Boolean,
      default: false,
    },
    activationCode: {
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

OrganizerSchema.pre('save', function (next) {
  const organizer = this;
  organizer.password = encrypt(organizer.password);
  organizer.activationCode = encrypt(organizer.id);
  next();
});

OrganizerSchema.methods.toJSON = function () {
  const organizer = this.toObject();
  delete organizer.password;
  return organizer;
};

const OrganizerModel = mongoose.model(ORGANIZER_MODEL_NAME, OrganizerSchema);
export default OrganizerModel;
