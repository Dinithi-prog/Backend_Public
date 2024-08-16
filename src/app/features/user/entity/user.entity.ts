import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Length} from 'class-validator';

export enum UserRole {
  PublicUser = 'public_user',
  AdminUser = 'admin_user',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Pending = 'pending',
}

export class User {
  userId: string;

  // Personal Information Section
  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  lastName: string;

  @IsNotEmpty()
  dob: Date; // Date object for Date of Birth

  @IsNotEmpty()
  @IsString()
  @Length(10, 12)
  nic: string; // National Identification Card (NIC)

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 25)
  eid: string; // Employee ID/Staff ID

  // Contact Information Section
  @IsNotEmpty()
  @IsEmail()
  @Length(8, 100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 10)
  mobileNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  streetNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  province: string;

  // Employment Information Section
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  workAddress: string;

  @IsOptional()
  @IsString()
  scannedEid?: string; // Scanned copy of Employee ID (file path or base64 string)

  @IsOptional()
  @IsString()
  letterOfAppointment?: string; // Letter of Appointment (file path or base64 string)

  @IsNotEmpty()
  @IsString()
  schoolName: string; // School/Institution Name

  // Role Section
  @IsNotEmpty()
  @IsEnum(UserRole)
  userRole: UserRole;

  // Status Section
  @IsNotEmpty()
  @IsEnum(UserStatus)
  status: UserStatus;

  @IsNotEmpty()
  @IsString()
  @Length(8, 50) // Example password validation rule
  password: string;

  @IsNotEmpty()
  createAt: Date;

  @IsNotEmpty()
  updatedAt: Date;

  @IsOptional()
  deletedAt?: Date;
}
