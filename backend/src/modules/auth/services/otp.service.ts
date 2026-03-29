import { HttpStatus, Injectable } from "@nestjs/common";
import { BaseException } from "src/common/errors/base.exception";
import { ErrorCode } from "src/common/errors/error-codes";
import { MailService } from "src/modules/mail/service/mail.service";
import { RedisConfig } from "src/modules/redis/services/redis.service";

@Injectable()
export class OtpService {
    constructor(
        private redisConfig: RedisConfig,
    ) { }
    async sendOtp(email: string) {
        const requestCountKey = `otp_request_count:${email}`;
        const requestCount = parseInt((await this.redisConfig.get(requestCountKey)) ?? '0');
        if (requestCount >= 5) throw new BaseException({
            code: ErrorCode.BAD_REQUEST,
            message: 'You have sent the OTP more than 5 times in 1 hour, please try again later',
            status: HttpStatus.BAD_REQUEST,
        })

        const otp = Math.floor(100000 + Math.random() * 900000);
        await this.redisConfig.set(`otp:${email}`, otp, 60);
        await this.redisConfig.incr(requestCountKey);
        if (requestCount === 0) {
            await this.redisConfig.expire(requestCountKey, 3600);
        }
        return otp.toString();
    }

    async verifyOtp(email: string, otpInput: string) {
        const otpStored = await this.redisConfig.get(`otp:${email}`);
        const failedCountKey = `otp_failed_count:${email}`;
        if (!otpStored) throw new BaseException({
            code: ErrorCode.OTP_INVALID,
            message: 'The OTP has expired or has not been sent',
            status: HttpStatus.BAD_REQUEST,
        });

        if (otpStored === otpInput) {
            await this.redisConfig.del(`otp:${email}`);
            await this.redisConfig.del(failedCountKey);
            return true;
        }
        const failedCount = await this.redisConfig.incr(failedCountKey);
        if (failedCount === 1) {
            await this.redisConfig.expire(failedCountKey, 3600);
        }
        if (failedCount >= 5) {
            throw new BaseException({
                code: ErrorCode.TOO_MANY_REQUESTS,
                message: 'You have entered the wrong OTP more than 5 times. Please try again later',
                status: HttpStatus.TOO_MANY_REQUESTS,
            })
        }
        throw new BaseException({
            code: ErrorCode.OTP_INVALID,
            message: 'OTP is incorrect. Please try again',
            status: HttpStatus.BAD_REQUEST,
        })
    }
}