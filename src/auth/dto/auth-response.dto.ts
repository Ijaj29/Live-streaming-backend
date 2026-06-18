import { User } from '../../entities/user.entity';

export class AuthResponseDto {
  token!: string;
  user!: Omit<User, 'password'>;
}
