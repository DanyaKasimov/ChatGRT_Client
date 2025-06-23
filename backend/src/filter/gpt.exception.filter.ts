import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";
import {ApiException} from "../exception/api.exception";

@Catch()
export class GptExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GptExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message } = this.handleException(exception);

    response.status(status).json({ statusCode: status, message });
  }

  private handleException(exception: unknown): { status: number, message: string } {
    if (exception instanceof ApiException) {
      return this.handleApiException(exception);
    }
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }
    if (exception instanceof Error) {
      return this.handleGenericError(exception);
    }
    return this.handleUnknownError();
  }

  private handleApiException(exception: ApiException) {
    this.logger.error(`ApiException. Произошла ошибка: ${exception.message}`);
    return { status: exception.getStatus(), message: exception.message };
  }

  private handleHttpException(exception: HttpException) {
    this.logger.error(`HttpException. Произошла ошибка: ${exception.message}`);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "Непредвиденная ошибка." };
  }

  private handleGenericError(exception: Error) {
    this.logger.error(`Error. Произошла ошибка: ${exception.message}`);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "Непредвиденная ошибка." };
  }

  private handleUnknownError() {
    this.logger.error(`Произошла ошибка. Сработал метод handleUnknownError`);
    return { status: HttpStatus.INTERNAL_SERVER_ERROR, message: "Непредвиденная ошибка." };
  }
}