import mongoose from 'mongoose';
import * as Yup from 'yup';
import { encrypt } from '../utils/encryption';
import { ROLES } from '../utils/constant';

const Schema = mongoose.Schema;
export const ORGANIZER_MODEL_NAME = 'Orginizer';

const validatePasswordOrganizer = Yup.string()
  .required()
  .min(6, 'Password must be at least 6 characters')
  .test(
    'at least one uppercase',
    'Password must contain at least one uppercase letter',
    (value) => /[A-Z]/.test(value || '')
  )
  .test(
    'at least one number',
    'Password must contain at least one number',
    (value) => /[0-9]/.test(value || '')
  );

const validateConfirmPasswordOrganizer = Yup.string()
  .required()
  .oneOf([Yup.ref('password'), ''], "Password doesn't match");

export const organizerDTO = Yup.object({
  organizerName: Yup.string().required(),
  email: Yup.string().email().required(),
  password: validatePasswordOrganizer,
  confirmPassword: validateConfirmPasswordOrganizer,
  contactPerson: Yup.string().required(),
  phone: Yup.string().required(),
  descriptionOrganizer: Yup.string(),
  dateEstablished: Yup.string().required(),
  location: Yup.object({
    domicile: Yup.string(),
    address: Yup.string(),
  }).required(),
});

export const organizerLoginDTO = Yup.object({
  identifier: Yup.string().required(),
  password: validatePasswordOrganizer,
});

export const organizerUpdatePasswordDTO = Yup.object({
  oldPassword: validatePasswordOrganizer,
  password: validatePasswordOrganizer,
  confirmPassword: validateConfirmPasswordOrganizer,
});

export type TyperOrganizer = Yup.InferType<typeof organizerDTO>;
export interface IOrganizer extends Omit<TyperOrganizer, 'confirmPassword'> {
  role: string;
  logo: string;
  verified: boolean;
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
    descriptionOrganizer: {
      type: Schema.Types.String,
    },
    dateEstablished: {
      type: Schema.Types.String,
    },
    location: {
      type: {
        domicile: {
          type: Schema.Types.String,
        },
        address: {
          type: Schema.Types.String,
        },
      },
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
).index({ organizerName: 'text' });

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
