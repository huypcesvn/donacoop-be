import { Controller, Request, Post, UseGuards, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { SkipAuth } from 'src/decorators/skip-auth';
import { RegisterDto } from './dto/register.dto';
import type { Response } from 'express';

@Controller({ path: 'auth', version: '1' }) // /api/v1/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Res({ passthrough: true }) res: Response) { // import từ express
    const { access_token, userInfo } = await this.authService.login(req.user);

    // Lưu token vào cookie httpOnly
    res.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return { userInfo }; // trả về thông tin user mà không cần gửi token
  }

  @SkipAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
