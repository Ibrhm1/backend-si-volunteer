import dotenv from 'dotenv';
dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || '';
export const SECRET: string = process.env.SECRET || '';

//* send email
export const EMAIL_SMTP_SECURE: boolean =
  Boolean(process.env.EMAIL_SMTP_SECURE) || false;
export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || '';
export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || '';
export const EMAIL_SMTP_PORT: number =
  Number(process.env.EMAIL_SMTP_PORT) || 465;
export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || '';
export const EMAIL_SMTP_SERVICE_NAME: string =
  process.env.EMAIL_SMTP_SERVICE_NAME || '';

//* client
export const CLIENT_HOST: string =
  process.env.CLIENT_HOST || 'http://localhost:3001';

//* cloudinary
export const API_CLOUDINARY_NAME: string =
  process.env.API_CLOUDINARY_NAME || '';
export const API_CLOUDINARY_KEY: string = process.env.API_CLOUDINARY_KEY || '';
export const API_CLOUDINARY_SECRET: string =
  process.env.API_CLOUDINARY_SECRET || '';
export const API_CLOUDINARY_URL: string = process.env.API_CLOUDINARY_URL || '';
