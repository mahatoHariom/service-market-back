import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  LoginDto,
  AuthDto,
  Tokens,
  refreshDto,
} from 'src/application/dtos/auth/auth.dto';
import { User } from '@prisma/client';

import { AtGuard, RtGuard } from 'src/application/guards';
import { AuthServices } from 'src/infrastructure/services/auth/auth-services';

@ApiTags('Auth Routes')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('login')
  @ApiOperation({
    description: 'Login a new user',
    operationId: 'Login',
    summary: 'Login User',
  })
  @UseGuards(AtGuard)
  async loginUser(
    @Body() data: LoginDto,
    // @Req() req: Request,
  ): Promise<{ user: User; token: Tokens }> {
    return await this.authService.loginUser(data);
  }

  @Post('register')
  @ApiOperation({
    description: 'Register a new user',
    operationId: 'Register',
    summary: 'Create or register new User',
  })
  async createUser(@Body() data: AuthDto): Promise<User> {
    const user = await this.authService.createUser(data);
    console.log(user, 's');
    return user;
  }

  @Post('refresh')
  @ApiOperation({
    description: 'Refresh a token',
    operationId: 'Refresh',
    summary: 'Refresh Token',
  })
  @UseGuards(AtGuard, RtGuard)
  async refreshToken(@Body() data: refreshDto): Promise<Tokens> {
    return await this.authService.refreshToken(data);
  }
}
