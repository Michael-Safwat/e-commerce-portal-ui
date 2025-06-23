export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  isLocked: boolean;
  roles?: string[];
  password?: string;
  token?: string;
}
