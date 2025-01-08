import { TRANSACTION_MANAGER, TransactionManager } from "../../common/transaction/domain/transaction.interface";
import { UserService } from "../../user/domain/user.service";
import { PointService } from "../domain/point.service";
import { PointFacade } from "./point.facade";
import { PrismaService } from "../../prisma/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { TransactionType, User } from "@prisma/client";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('PointFacade', () => {
    let pointFacade: PointFacade;
    let pointService: PointService;
    let userService: UserService;
    let transactionManager: TransactionManager;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
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
                        chargePoint: jest.fn()
                    }
                },
                {
                    provide: PrismaService,
                    useValue: {}
                },
                {
                    provide: TRANSACTION_MANAGER,
                    useValue: {
                        runInTransaction: jest.fn((callback) => callback('tx'))
                    }
                }
            ]
        }).compile();

        pointFacade = module.get<PointFacade>(PointFacade);
        pointService = module.get<PointService>(PointService);
        userService = module.get<UserService>(UserService);
        transactionManager = module.get(TRANSACTION_MANAGER);
    });

    describe('chargePoint', () => {
        it('정상적인 포인트 충전 요청이 처리되어야 한다', async () => {
            // Given
            const mockUser: User = {
                id: 1,
                points: 5000,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        
            const mockPointHistory = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const chargePointDto = {
                userId: 1,
                points: 10000
            };
            
            jest.spyOn(userService, 'getUserWithLock').mockResolvedValue(mockUser);
            jest.spyOn(userService, 'chargePoint').mockResolvedValue({...mockUser, points: 15000});
            jest.spyOn(pointService, 'savePointHistory').mockResolvedValue(mockPointHistory);

            // When
            const result = await pointFacade.chargePoint(chargePointDto);

            // Then
            expect(userService.getUserWithLock).toHaveBeenCalledWith(chargePointDto.userId, 'tx');
            expect(userService.chargePoint).toHaveBeenCalledWith(mockUser, chargePointDto.points, 'tx');
            expect(pointService.savePointHistory).toHaveBeenCalledWith(
                chargePointDto.userId,
                chargePointDto.points,
                'charge',
                'tx'
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
            const mockUser: User = {
                id: 1,
                points: 5000,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const chargePointDto = {
                userId: 1,
                points: 1000000000
            };
            
            jest.spyOn(userService, 'getUserWithLock').mockResolvedValue({
                ...mockUser,
                points: 1000005000
            });

            // When & Then
            await expect(pointFacade.chargePoint(chargePointDto))
                .rejects
                .toThrow(new BadRequestException('Maximum point limit exceeded'));
        });
    })
})