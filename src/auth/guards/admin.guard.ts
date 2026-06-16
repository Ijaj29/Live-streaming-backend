import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { AuthService } from '../auth.service';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const tokenUser = request.user;

    if (!tokenUser || !tokenUser.id) {
      throw new ForbiddenException('No user found');
    }

    const user = await this.authService.findUserById(tokenUser.id);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.role !== 'admin' && user.isAdmin !== true) {
      throw new ForbiddenException('Admin access required');
    }

    request.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
    };

    return true;
  }
}
