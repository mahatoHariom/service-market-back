import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  LoginDto,
  AuthDto,
  Tokens,
  refreshDto,
} from 'src/application/dtos/auth/auth.dto';
import { AuthRepository } from 'src/infrastructure/repositories/auth/auth.repository';

@Injectable()
export class AuthServices {
  constructor(private authRepository: AuthRepository) {}

  async loginUser(data: LoginDto): Promise<{ user: User; token: Tokens }> {
    return await this.authRepository.loginUser(data);
  }

  async createUser(data: AuthDto): Promise<User> {
    return await this.authRepository.createUser(data);
  }

  async refreshToken(data: refreshDto): Promise<Tokens> {
    return await this.authRepository.refreshToken(data);
  }
}
