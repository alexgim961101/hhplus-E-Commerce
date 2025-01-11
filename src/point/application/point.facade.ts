import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PointService } from "@/point/domain/point.service";
import { UserService } from "@/user/domain/user.service";
import { ChargePointReqDto } from "@/point/presentation/dto/charge-point.req.dto";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class PointFacade {
    constructor(
        private readonly pointService: PointService, 
        private readonly userService: UserService,
        private readonly prisma: PrismaService
    ){}

    async chargePoint(body: ChargePointReqDto) {
        return await this.prisma.runInTransaction(async (tx) => {
            // 1. 유저 조회
            const user = await this.userService.getUserWithLock(body.userId, tx);
            if(!user) throw new NotFoundException('User not found');

            // 2. 소유할 수 있는 최대 Point 검증
            if (user.points + body.points > 1000000000) {
                throw new BadRequestException('Maximum point limit exceeded');
            }
            
            // 3. 포인트 충전
            await this.userService.chargePoint(user, body.points, tx);

            // 4. 포인트 충전 내역 저장
            const pointHistory = await this.pointService.savePointHistory(
                user.id, 
                body.points, 
                'charge',
                tx
            );
            
            // 5. return
            return pointHistory;
        });
    }

    async getPoint(userId: number) {
        const user = await this.userService.getUser(userId);
        return user.points;
    }
}