import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "./error-codes";

export interface BaseExceptionPayload {
    code: ErrorCode,
    message: string | string[],
    status?: HttpStatus,
    data?: any,
}

export class BaseException extends HttpException {
    public readonly code: ErrorCode;
    public readonly data: any;

    constructor(payload: BaseExceptionPayload) {
        super({
            error: payload.code, message: payload.message
        },
            payload.status || HttpStatus.BAD_REQUEST)
        this.code = payload.code;
        this.data = payload.data || null;
    }
}