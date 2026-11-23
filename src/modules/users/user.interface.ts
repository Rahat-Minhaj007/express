export interface IUser {
  name: string;
  email: string;
  password: string;
  age?: number | null;
  role?: string;
}

export type UpdateUser = Partial<IUser> & { is_active?: boolean };
