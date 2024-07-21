import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/application/controllers/auth/auth-controllers';
import { AtStrategy, RtStrategy } from 'src/application/strategies';
import { AuthRepository } from 'src/infrastructure/repositories/auth/auth.repository';
import { AuthServices } from 'src/infrastructure/services/auth/auth-services';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthRepository, AtStrategy, RtStrategy, AuthServices],
  controllers: [AuthController],
})
export class AuthModule {}
