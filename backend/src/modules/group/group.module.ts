import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { GroupRepository } from "./repositories/group.repository";
import { GroupService } from "./services/group.service";
import { GroupController } from "./group.controller";
import { GroupUserRepository } from "./repositories/group-user.repository";

@Module({
    imports: [PrismaModule],
    providers: [GroupRepository, GroupService, GroupRepository, GroupUserRepository],
    controllers: [GroupController],
    exports: [GroupService]
})
export class GroupModule { }