import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ResponseFormat<T> {
    statusCode: number;
    success: boolean;
    error: any;
    data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<ResponseFormat<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode = response?.statusCode || 200;

        return next.handle().pipe(
            map((data) => ({
                statusCode,
                success: true,
                error: null,
                data,
            })),
        );
    }
}