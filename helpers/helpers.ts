import { jwtVerify } from 'jose';

export type DecodedToken = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_key';

const encoder = new TextEncoder();
const secret = encoder.encode(JWT_SECRET);


export function calculateAge(birthdayDate: string): number {
  const today = new Date();
  const birthDate = new Date(birthdayDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}


export async function verifyToken(token: string): Promise<DecodedToken | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as DecodedToken;
  } catch (error) {
    console.error('JWT VERIFY ERROR:', error);
    return null;
  }
}



