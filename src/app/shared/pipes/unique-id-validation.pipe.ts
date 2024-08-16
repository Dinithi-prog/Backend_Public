import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';

/**
 * A custom validation pipe for checking the validity of unique identifiers (IDs).
 * This pipe ensures that an ID is provided, is a string, and matches a specific format.
 * If the provided ID is invalid or doesn't match the expected format, it throws a BadRequestException.
 */
@Injectable()
export class UniqueIdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('ID must be provided');
    }

    if (typeof value !== 'string') {
      throw new BadRequestException('ID must be a string');
    }

    // Define a regular expression pattern for valid IDs and check if the ID matches it.
    const isValid = /^((ROL|USR)\d{13})$/.test(value);

    if (!isValid) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
