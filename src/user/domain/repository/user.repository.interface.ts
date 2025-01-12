import { UserModel } from "@/user/domain/model/user.model";

export interface UserRepositoryInterface {
    findById(id: number, tx?: any): Promise<UserModel | null>;
    findByIdWithLock(id: number, tx?: any): Promise<UserModel | null>;
    findAll(): Promise<UserModel[]>;
    create(userModel: UserModel): Promise<UserModel>;
    update(userModel: UserModel, tx?: any): Promise<UserModel>;
    delete(id: number, tx?: any): Promise<UserModel>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');