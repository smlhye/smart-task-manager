import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { SessionRepository } from "../repositories/session.repository";

@Injectable()
export class SessionCleanupService {
    private readonly logger = new Logger(SessionCleanupService.name);
    private isRunning = false;
    constructor(private readonly sessionRepo: SessionRepository) { }

    @Cron("0 */10 * * * *")
    async handleCleanup() {
        if (this.isRunning) {
            this.logger.warn("Cleanup job skipped (already running)");
            return;
        }

        this.isRunning = true;

        try {
            const start = Date.now();

            const result = await this.sessionRepo.cleanupExpiredAndRevokedSessions();

            const duration = Date.now() - start;

            this.logger.log(
                `Cleanup success: deleted ${result.count} sessions in ${duration}ms`
            );
        } catch (error) {
            this.logger.error("Cleanup failed", error.stack);
        } finally {
            this.isRunning = false;
        }
    }
}