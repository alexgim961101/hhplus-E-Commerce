import { Test, TestingModule } from "@nestjs/testing";
import { PointFacade } from "@/point/application/facade/point.facade";
import { PointController } from "@/point/presentation/controller/point.controller";
import { PointService } from "@/point/domain/service/point.service";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { ChargePointReqDto } from "../presentation/dto/request/charge-point-req.dto";
import { PointModel, TransactionType } from "../domain/model/point";

describe('PointController', () => {
    let controller: PointController;
    let pointFacade: PointFacade;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PointController],
            providers: [
                {
                    provide: PointFacade,
                    useValue: {
                        chargePoint: jest.fn(),
                        getPoint: jest.fn(),
                    }
                },
                {
                    provide: PointService,
                    useValue: {
                        savePointHistory: jest.fn(),
                    }
                }
            ],
        }).compile();

        controller = module.get<PointController>(PointController);
        pointFacade = module.get<PointFacade>(PointFacade);
    })

    describe('chargePoint (포인트 충전)', () => {
        it('포인트 충전 요청시 정상적으로 처리되어야 한다', async () => {
            // Given
            const chargePointDto: ChargePointReqDto = {
                userId: 1,
                points: 10000
            };

            const chargePoint: PointModel = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date(),
                savePoint: jest.fn(),
                usePoint: jest.fn()
            };
            jest.spyOn(pointFacade, 'chargePoint').mockResolvedValue(chargePoint);

            // When
            const result = await controller.chargePoint(chargePointDto);

            // Then
            expect(pointFacade.chargePoint).toHaveBeenCalledWith(chargePointDto);
            expect(result).toEqual({
                id: 1,
                userId: 1,
                point: 10000,
                transactionType: TransactionType.CHARGE,
            });
        });

        it('요청 데이터가 누락된 경우 400 에러가 발생해야 한다', async () => {
            // Given
            const invalidDto = {
                userId: 1
                // points가 누락됨
            } as ChargePointReqDto;
            jest.spyOn(pointFacade, 'chargePoint').mockRejectedValue(
                new BadRequestException('Invalid request data')
            );

            // When & Then
            await expect(controller.chargePoint(invalidDto)).rejects.toThrow(BadRequestException);
            expect(pointFacade.chargePoint).toHaveBeenCalledWith(invalidDto);
        });

        it('존재하지 않는 사용자의 포인트 충전 요청시 404 에러가 발생해야 한다', async () => {
            // Given
            const nonExistUserDto: ChargePointReqDto = {
                userId: 999,
                points: 10000
            };
            jest.spyOn(pointFacade, 'chargePoint').mockRejectedValue(
                new BadRequestException('User not found')
            );

            // When & Then
            await expect(controller.chargePoint(nonExistUserDto)).rejects.toThrow(BadRequestException);
            expect(pointFacade.chargePoint).toHaveBeenCalledWith(nonExistUserDto);
        });

        it('최대 충전 한도를 초과하는 경우 400 에러가 발생해야 한다', async () => {
            // Given
            const exceedLimitDto: ChargePointReqDto = {
                userId: 1,
                points: 2000000 // 100만원 초과
            };
            jest.spyOn(pointFacade, 'chargePoint').mockRejectedValue(
                new BadRequestException('Maximum point limit exceeded')
            );

            // When & Then
            await expect(controller.chargePoint(exceedLimitDto)).rejects.toThrow(BadRequestException);
            expect(pointFacade.chargePoint).toHaveBeenCalledWith(exceedLimitDto);
        });
    })

    describe('getPoint (잔액 조회)', () => {
        it('사용자의 잔액이 정상적으로 조회되어야 한다', async () => {
            // Given
            const userId = 1;
            const mockPoints = 50000;
            
            jest.spyOn(pointFacade, 'getPoint').mockResolvedValue(mockPoints);
    
            // When
            const result = await controller.getPoint(userId);
            // Then
            expect(pointFacade.getPoint).toHaveBeenCalledWith(1);
            expect(result).toEqual({ userId, point: mockPoints });
        });
    
        it('존재하지 않는 사용자의 잔액 조회시 404 에러가 발생해야 한다', async () => {
            // Given
            const userId = 999;
            jest.spyOn(pointFacade, 'getPoint').mockRejectedValue(
                new NotFoundException('User not found')
            );
    
            // When & Then
            await expect(controller.getPoint(userId))
                .rejects
                .toThrow(NotFoundException);
            expect(pointFacade.getPoint).toHaveBeenCalledWith(999);
        });
    });
})