import {PickType} from '@nestjs/swagger';
import {User} from '../entity/user.entity';

export class CreateUserDto extends PickType(User, [
  'userId',
  'firstName',
  'lastName',
  'dob',
  'nic',
  'gender',
  'eid', // Employee ID
  'email',
  'mobileNumber',
  'streetNumber',
  'city',
  'province',
  'jobTitle',
  'workAddress',
  'scannedEid', // Optional: Scanned Employee ID document
  'letterOfAppointment', // Optional: Letter of Appointment document
  'schoolName', // School/Institution Name
  'status', // Status of the user (e.g., active/inactive)
  'createAt',
  'updatedAt',
  'password',
  'userRole',
] as const) {}
