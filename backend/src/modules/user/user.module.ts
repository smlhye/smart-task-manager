import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { GroupRepository } from "../group/repositories/group.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { UserController } from "./user.controller";

@Module({
    imports: [PrismaModule],
    providers: [UserRepository, UserService, GroupRepository, PrismaService, ],
    exports: [UserService],
    controllers: [UserController],
}) 
export class UserModule {}