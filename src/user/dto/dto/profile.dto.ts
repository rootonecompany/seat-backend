import { IsBoolean, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  nickname: string | null;

  @IsString()
  thumbnail_image: string | null;

  @IsString()
  locale: string | null;

  @IsString()
  given_name: string | null;

  @IsString()
  family_name: string | null;

  @IsBoolean()
  is_email_valid: boolean | null;

  @IsBoolean()
  is_email_verified: boolean | null;

  @IsString()
  age_range: string | null;

  @IsString()
  birthday: string | null;

  @IsString()
  gender: string | null;

  @IsString()
  mobile: string | null;

  @IsString()
  mobile_e164: string | null;

  @IsString()
  birthYear: string | null;

  @IsString()
  name: string | null;
}
