import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Object {

    let response = {
      message: 'Hello World!'
    };

    return response;
  }
}
