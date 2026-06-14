import { Injectable, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

@Injectable()
export class AdminGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First run JWT validation
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found');
    }

    // Check if user has admin role — adjust field name to match your User entity
    if (user.role !== 'admin' && user.isAdmin !== true) {
      throw new ForbiddenException('Admin access required');
    }

    return true;
  }
}