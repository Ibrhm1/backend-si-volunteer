import mongoose from 'mongoose';
import { encrypt } from '../utils/encryption';
import { renderMailHtml, sendMail } from '../utils/mails/mail';
import { CLIENT_HOST, EMAIL_SMTP_USER } from '../utils/env';
import { ROLES } from '../utils/constant';

const Schema = mongoose.Schema;

export const USER_MODEL_NAME = 'User';
export interface IUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: string;
  phone?: number;
  active: boolean;
  activationCode: string;
  createdAt?: string;
}

const UserSchema = new Schema<IUser>(
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
    role: {
      type: Schema.Types.String,
      enum: [ROLES.ADMIN, ROLES.MEMBER],
      default: ROLES.MEMBER,
    },
    profilePicture: {
      type: Schema.Types.String,
      default: 'profile.png',
    },
    phone: {
      type: Schema.Types.Number,
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

// UserSchema.post('save', async function (doc, next) {
//   try {
//     const user = doc;
//     const contentMail = await renderMailHtml('registration-succes.ejs', {
//       username: user.username,
//       fullName: user.fullName,
//       email: user.email,
//       createdAt: user.createdAt,
//       activationLink: `${CLIENT_HOST}/auth/activation?code=${user.activationCode}`,
//     });
//     await sendMail({
//       from: EMAIL_SMTP_USER,
//       to: user.email,
//       subject: 'Activation account',
//       html: contentMail,
//     });
//   } catch (error) {
//     console.log(error);
//   } finally {
//     next();
//   }
// });

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model(USER_MODEL_NAME, UserSchema);
export default UserModel;
