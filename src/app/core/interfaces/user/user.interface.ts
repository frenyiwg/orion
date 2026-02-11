export interface IUser {
  id: number;
  username: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'USER' | 'SUPPORT';
}
