import { UserService } from "@/user/domain/service/user.service";
import { PointService } from "@/point/domain/service/point.service";
import { PointFacade } from "@/point/application/facade/point.facade";
import { PrismaService } from "@/prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { UserModel } from "@/user/domain/model/user.model";
import { PointModel, TransactionType } from "../domain/model/point";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { LoggerMock } from "@/common/mock/logger.mock";

describe('PointFacade', () => {
    let pointFacade: PointFacade;
    let pointService: PointService;
    let userService: UserService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PrismaModule],
            providers: [
                PointFacade,
                {
                    provide: PointService,
                    useValue: {
                        savePointHistory: jest.fn()
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        getUserWithLock: jest.fn(),
                        chargePoint: jest.fn(),
                        getUser: jest.fn()
                    }
                },
                {
                    provide: PrismaService,
                    useValue: {
                        runInTransaction: jest.fn((callback) => callback())
                    }
                },
                LoggerMock
            ]
        }).compile();

        pointFacade = module.get<PointFacade>(PointFacade);
        pointService = module.get<PointService>(PointService);
        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('chargePoint', () => {
        it('정상적인 포인트 충전 요청이 처리되어야 한다', async () => {
            // Given
            const mockUser: UserModel = {
                id: 1,
                points: 5000,
                createdAt: new Date(),
                updatedAt: new Date(),
                usePoint: jest.fn(),
                chargePoint: jest.fn()
            };
        
            const mockPointHistory: PointModel = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date(),
                savePoint: jest.fn(),
                usePoint: jest.fn()
            };

            const chargePointDto = {
                userId: 1,
                points: 10000
            };
            
            jest.spyOn(userService, 'getUserWithLock').mockResolvedValue(mockUser);
            jest.spyOn(userService, 'chargePoint').mockResolvedValue(mockUser);
            jest.spyOn(pointService, 'savePointHistory').mockResolvedValue(mockPointHistory);

            // When
            const result = await pointFacade.chargePoint(chargePointDto);

            // Then
            expect(userService.getUserWithLock).toHaveBeenCalledWith(chargePointDto.userId, undefined);
            expect(userService.chargePoint).toHaveBeenCalledWith(mockUser, chargePointDto.points, undefined);
            expect(pointService.savePointHistory).toHaveBeenCalledWith(
                chargePointDto.userId,
                chargePointDto.points,
                'charge',
                undefined
            );
            expect(result).toEqual(mockPointHistory);
        });

        it('존재하지 않는 사용자의 경우 NotFoundException이 발생해야 한다', async () => {
            // Given
            const chargePointDto = {
                userId: 999,
                points: 10000
            };
            
            jest.spyOn(userService, 'getUserWithLock').mockResolvedValue(null);

            // When & Then
            await expect(pointFacade.chargePoint(chargePointDto))
                .rejects
                .toThrow(new NotFoundException('User not found'));
        });

        it('최대 보유 한도(10억)를 초과하는 경우 BadRequestException이 발생해야 한다', async () => {
            // Given
            const mockUser: UserModel = {
                id: 1,
                points: 5000,
                createdAt: new Date(),
                updatedAt: new Date(),
                usePoint: jest.fn(),
                chargePoint: jest.fn()
            };

            const chargePointDto = {
                userId: 1,
                points: 1000000000
            };
            
            jest.spyOn(userService, 'getUserWithLock').mockResolvedValue(mockUser);

            // When & Then
            await expect(pointFacade.chargePoint(chargePointDto))
                .rejects
                .toThrow(new BadRequestException('Maximum point limit exceeded'));
        });
    })

    describe('getPoint', () => {
        it('사용자의 잔액이 정상적으로 조회되어야 한다', async () => {
            // Given
            const userId = 1;
            const mockUser: UserModel = {
                id: userId,
                points: 50000,
                createdAt: new Date(),
                updatedAt: new Date(),
                usePoint: jest.fn(),
                chargePoint: jest.fn()
            };
            
            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
    
            // When
            const result = await pointFacade.getPoint(userId);
    
            // Then
            expect(userService.getUser).toHaveBeenCalledWith(userId);
            expect(result).toBe(50000);
        });
    });
})