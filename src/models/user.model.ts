import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';
import { renderMailHtml, sendMail } from '../utils/mails/mail';
import { CLIENT_HOST, EMAIL_SMTP_USER } from '../utils/env';
import { ROLES } from '../utils/constant';
import * as Yup from 'yup';

const Schema = mongoose.Schema;
export const USER_MODEL_NAME = 'User';

const validatePassword = Yup.string()
  .required()
  .min(8, 'Password must be at least 6 characters')
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

const validateConfirmPassword = Yup.string()
  .required()
  .oneOf([Yup.ref('password'), ''], "Password doesn't match");

export const userDTO = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  phone: Yup.string(),
  address: Yup.string(),
});

export const userLoginDTO = Yup.object({
  identifier: Yup.string().required(),
  password: validatePassword,
});

export const userUpdatePasswordDTO = Yup.object({
  oldPassword: validatePassword,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});

export type TypeUser = Yup.InferType<typeof userDTO>;
export interface User extends Omit<TypeUser, 'confirmPassword'> {
  role: string;
  profilePicture: string;
  active: boolean;
  activationCode: string;
  createdAt?: string;
}

const UserSchema = new Schema<User>(
  {
    fullName: {
      type: Schema.Types.String,
      required: true,
    },
    username: {
      type: Schema.Types.String,
      required: true,
      unique: true,
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
    phone: {
      type: Schema.Types.String,
    },
    address: {
      type: Schema.Types.String,
      required: true,
    },
    profilePicture: {
      type: Schema.Types.String,
      default: 'profile.png',
    },
    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
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

UserSchema.pre('save', function (next) {
  const user = this;
  user.password = encrypt(user.password);
  user.activationCode = encrypt(user.id);
  next();
});

UserSchema.post('save', async function (doc, next) {
  try {
    const user = doc;
    const contentMail = await renderMailHtml('registration-succes.ejs', {
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
    });
    await sendMail({
      from: EMAIL_SMTP_USER,
      to: user.email,
      subject: 'Activation account',
      html: contentMail,
    });
  } catch (error) {
    console.log(error);
  } finally {
    next();
  }
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model(USER_MODEL_NAME, UserSchema);
export default UserModel;
