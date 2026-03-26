import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { GroupRepository } from "src/modules/group/repositories/group.repository";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepo: UserRepository,
        private readonly groupRepo: GroupRepository,
    ) { }
}