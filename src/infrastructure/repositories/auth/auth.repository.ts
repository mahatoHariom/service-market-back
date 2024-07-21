import { $Enums, User } from '@prisma/client';
import { AuthDto, Tokens } from 'src/application/dtos/auth/auth.dto';
import { AlreadyExistException, ERROR_MESSAGES } from 'src/application/errors';
import { PrismaService } from 'src/infrastructure/persistence/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthInterfaces } from 'src/infrastructure/interfaces/auth/auth.interface';


@Injectable()
export class AuthRepository implements IAuthInterfaces {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  async createUser(data: AuthDto): Promise<User> {
    const existingUser = await this.findUserByEmail(data.email);
    if (existingUser) {
      throw new AlreadyExistException(ERROR_MESSAGES.USER_EXISTS);
    }
    const hash = await bcrypt.hash(data.password, 10);
    return await this.prisma.user.create({
      data: {
        ...data,
        password: hash,
      },
    });
  }
  async loginUser(dto: Partial<AuthDto>) {
    const user = await this.findUserByEmail(dto.email);
    this.validateUser(user);
    this.validatePassword(dto.password, user.password);
    const token=await  this.getTokens(user)
    const data={user:user,token:token}
    return data
  }
  async refreshToken(data: { refreshToken: string }): Promise<Tokens> {
   
    const decodedToken = this.jwtService.decode(data.refreshToken) as User
    if (!decodedToken || !decodedToken.email) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }
    const user = await this.findUserByEmail(decodedToken.email);
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
    return this.getTokens(user);
  }

  private async findUserByEmail(email: string): Promise<User | null> {
    const user = this.prisma.user.findUnique({ where: { email } });
    return user;
  }
  private validateUser(user: User | null): void {
    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }
  }
  private validatePassword(
    inputPassword: string,
    storedPassword: string,
  ): void {
    const passwordMatches = bcrypt.compare(inputPassword, storedPassword);
    if (!passwordMatches) {
      throw new UnauthorizedException(ERROR_MESSAGES.INCORRECT_PASSWORD);
    }
  }
  private async getTokens(user: User): Promise<Tokens> {
    const accessToken = await this.signToken(
      user,
      this.config.get('ACCESS_TOKEN_EXPIRES'),
    );
    const refreshToken = await this.signToken(
      user,
      this.config.get('REFRESH_TOKEN_EXPIRES'),
    );
    return { accessToken, refreshToken };
  }
  private async signToken(user: User, expiresIn: string): Promise<string> {
    return this.jwtService.signAsync(user, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn,
    });
  }
}
