import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto): Promise<AuthResponseDto> {
    return this.authService.signup(body);
  }

  @Post('login')
  async login(@Body() body: LoginUserDto): Promise<AuthResponseDto> {
    return this.authService.login(body);
  }
}
