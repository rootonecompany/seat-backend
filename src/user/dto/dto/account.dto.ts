import { IsNumber, IsString } from 'class-validator';

export class AccountDto {
  @IsString()
  provider: string;

  @IsString()
  type: string;

  @IsString()
  providerAccountId: string;

  @IsString()
  access_token: string;

  @IsString()
  token_type: string;

  @IsString()
  refresh_token: string;

  @IsNumber()
  expires_at: number;

  @IsString()
  scope: string;

  @IsNumber()
  refresh_token_expires_in: number;

  @IsString()
  id_token: string;
}
