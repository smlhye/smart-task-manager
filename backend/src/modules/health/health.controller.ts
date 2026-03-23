import { Controller, Get } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiResponse({
        status: 200,
        description: 'Health check endpoint',
    })
    check() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
}