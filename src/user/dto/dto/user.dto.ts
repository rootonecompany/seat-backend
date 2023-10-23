import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  /**
   * id: providerAccountId
   */
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  // @IsString()
  // image: string;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  image: string;
}
