import { Injectable, Logger } from "@nestjs/common";
import { RevokedTokenRepository } from "../repositories/revoked-token.repository";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class RevokedTokenCleanupService {
    private readonly logger = new Logger(RevokedTokenCleanupService.name);
    private isRunning = false;
    constructor(private readonly revokedTokenRepo: RevokedTokenRepository) { }
    @Cron("0 */10 * * * *")
    async handleCleanup() {
        if (this.isRunning) {
            this.logger.warn("Cleanup job skipped (already running)");
            return;
        }

        this.isRunning = true;

        try {
            const start = Date.now();

            const result = await this.revokedTokenRepo.cleanExpiredTokens();

            const duration = Date.now() - start;

            this.logger.log(
                `Cleanup success: deleted ${result.count} revoked tokens in ${duration}ms`
            );
        } catch (error) {
            this.logger.error("Cleanup failed", error.stack);
        } finally {
            this.isRunning = false;
        }
    }
}