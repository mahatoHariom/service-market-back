import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/infrastructure/common/types/jwtPayload.type';


export const GetCurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user;
  },
);
