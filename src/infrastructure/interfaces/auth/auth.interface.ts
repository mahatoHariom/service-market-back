import { User } from "@prisma/client";
import { AuthDto, LoginDto, Tokens } from 'src/application/dtos/auth/auth.dto';

export interface IAuthInterfaces {
  createUser(data: AuthDto): Promise<User>;
  loginUser(data:LoginDto):Promise<{user:User,token:Tokens}>
  refreshToken(data:{refreshToken:string}):Promise<Tokens>
}