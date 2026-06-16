import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First run JWT validation
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const tokenUser = request.user;

    if (!tokenUser || !tokenUser.id) {
      throw new ForbiddenException('No user found');
    }

    // Fetch fresh user from DB to ensure up-to-date role/isAdmin
    const user = await this.usersRepository.findOne({ where: { id: tokenUser.id } });
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role !== 'admin' && user.isAdmin !== true) {
      throw new ForbiddenException('Admin access required');
    }

    // attach full user to request
    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    return true;
  }
}
