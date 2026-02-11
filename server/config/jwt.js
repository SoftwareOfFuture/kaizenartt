import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Generate JWT secret if not exists
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

export const JWT_SECRET = process.env.JWT_SECRET || generateJWTSecret();
export const JWT_EXPIRES_IN = '7d';

// Log secret generation (only in development)
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'development') {
  console.log('⚠️  Generated JWT_SECRET:', JWT_SECRET);
  console.log('⚠️  Please add this to your .env file: JWT_SECRET=' + JWT_SECRET);
}
