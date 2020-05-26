import { User } from './user.model';

export interface Group {
  id: string;
  name: string;
  admin: User;
  invitations: string[];
}
