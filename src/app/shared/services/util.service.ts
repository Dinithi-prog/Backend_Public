import {Injectable} from '@nestjs/common';

@Injectable()
export class UtilService {
  capitalizeText(text: string): string {
    const formattedText = text.trim();

    if (formattedText.length === 0) {
      return '';
    } else if (formattedText.length === 1) {
      return formattedText.toUpperCase();
    } else {
      return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }
  }

  generateUniqueId(prefix:string):string{
    const currentTimeStamp = new Date().getTime();
    const timeStampString = currentTimeStamp.toString().slice(6);
    const randomIntegers = Math.floor(100000 + Math.random()*900000);
    const uniqueId = `${prefix}${timeStampString}${randomIntegers}`;
    return uniqueId;
  }
  getEnvironmentSpecificValue<T>(dev: T, production: T): T {
    return process.env.NODE_ENV === 'production' ? production : dev;
  }
}
