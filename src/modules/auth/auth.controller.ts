import { Controller, Request, Post, UseGuards, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
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
    res.cookie('accessToken', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/',
    });

    return { userInfo, access_token };
  }

  @SkipAuth()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    // Clear cookies with the EXACT same options they were set with
    const loginCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    // Clear accessToken cookie with the same options it was set with
    res.clearCookie('accessToken', loginCookieOptions);

    // Also try with different combinations to ensure it's cleared
    const additionalOptions = [
      { path: '/', httpOnly: true, secure: false, sameSite: 'lax' as const },
      { path: '/', httpOnly: true, secure: true, sameSite: 'lax' as const },
      { path: '/', httpOnly: false, secure: false, sameSite: 'lax' as const },
      { path: '/', httpOnly: false, secure: true, sameSite: 'lax' as const },
      { path: '/', httpOnly: true, secure: false },
      { path: '/', httpOnly: true, secure: true },
      { path: '/', httpOnly: false, secure: false },
      { path: '/', httpOnly: false, secure: true },
      { path: '/' },
    ];

    // Clear with all possible combinations
    additionalOptions.forEach(options => {
      res.clearCookie('accessToken', options);
    });

    // Also clear userInfo cookie if it exists
    res.clearCookie('userInfo', { path: '/' });
    additionalOptions.forEach(options => {
      res.clearCookie('userInfo', options);
    });

    return { message: 'Logged out successfully' };
  }
}
