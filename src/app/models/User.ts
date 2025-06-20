export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isLocked: boolean;
  password?: string;
  token?: string;
}
