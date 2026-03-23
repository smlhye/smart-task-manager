import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { CurrentUserPayload } from "../strategies/jwt.strategy";

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) : CurrentUserPayload => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);