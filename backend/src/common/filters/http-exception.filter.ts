import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '../errors/base.exception';
import { ErrorCode } from '../errors/error-codes';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let code: string;
        let message: string | string[];
        let data: any = null;

        if (exception instanceof BaseException) {
            status = exception.getStatus();
            code = exception.code;
            message = (exception.getResponse() as any).message;
            data = exception.data;
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
                code = ErrorCode.BAD_REQUEST;
            } else {
                const resObj: any = res;
                message = resObj.message || 'Bad Request';
                code = resObj.error || ErrorCode.BAD_REQUEST;
            }
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            code = ErrorCode.INTERNAL_ERROR;
            message = 'Internal server error';
        }

        response.status(status).json({
            statusCode: status,
            success: false,
            error: {
                code,
                message,
            },
            data,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}