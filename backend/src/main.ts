import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { AppConfig } from "./config/app-config.service";
import { GlobalExceptionFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = app.get(AppConfig);

    app.setGlobalPrefix('api/v1');

    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    app.use(helmet());
    app.use(hpp());

    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    )

    app.use(
        (rateLimit as any).default({
            windowMs: Number(config.RATE_LIMIT_TTL) * 1000,
            max: Number(config.RATE_LIMIT_MAX),
            message: 'Too many requests, please try again later.',
        })
    );

    if (config.ENABLE_SWAGGER) {
        const swaggerConfig = new DocumentBuilder()
            .setTitle('Smart Task Management API')
            .setDescription('API Documentation for Smart Task Manager')
            .setVersion('1.0')
            .addBearerAuth({
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }, 'access_token')
            .addCookieAuth('refresh_token', {
                type: 'apiKey',
                in: 'cookie',
                name: 'refresh_token',
            })
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
            }
        });
    }
    app.enableCors({ origin: config.FRONTEND_URL, credentials: true });

    await app.listen(config.PORT);

    console.log(`🚀 Application running on http://localhost:${config.PORT}/api/v1`);
    if (config.ENABLE_SWAGGER) {
        console.log(`📄 Swagger docs: http://localhost:${config.PORT}/api/docs`);
    }
}

bootstrap();