import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
    constructor(message: string, status: HttpStatus) {
        super(message, status);
        this.name = 'ApiException';

        Object.setPrototypeOf(this, new.target.prototype);
    }
}