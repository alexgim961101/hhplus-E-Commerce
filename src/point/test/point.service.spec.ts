import { Test, TestingModule } from "@nestjs/testing";
import { POINT_HISTORY_REPOSITORY, PointHistoryRepositoryInterface } from "@/point/domain/repository/point-history.repository";
import { PointService } from "@/point/domain/service/point.service";
import { PointModel, TransactionType } from "@/point/domain/model/point";
import { LoggerMock } from "@/common/mock/logger.mock";

describe('PointService', () => {
    let pointService: PointService;
    let pointHistoryRepository: PointHistoryRepositoryInterface;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PointService,
                {
                    provide: POINT_HISTORY_REPOSITORY,
                    useValue: {
                        create: jest.fn()
                    }
                },
                LoggerMock
            ]
        }).compile();

        pointService = module.get<PointService>(PointService);
        pointHistoryRepository = module.get<PointHistoryRepositoryInterface>(POINT_HISTORY_REPOSITORY);
    })

    describe('savePointHistory (포인트 내역 저장)', () => {
        it('포인트 충전 내역이 정상적으로 저장되어야 한다', async () => {
            // Given
            const userId = 1;
            const points = 10000;
            const type = 'charge';
            
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

            jest.spyOn(pointHistoryRepository, 'create').mockResolvedValue(mockPointHistory);

            // When
            const result = await pointService.savePointHistory(userId, points, type);

            // Then
            expect(pointHistoryRepository.create).toHaveBeenCalledWith({
                userId,
                points,
                transactionType: TransactionType.CHARGE
            }, undefined);
            expect(result).toEqual(mockPointHistory);
        });

        it('charge 타입으로 저장시 TransactionType.CHARGE로 저장되어야 한다', async () => {
            // Given
            const userId = 1;
            const points = 10000;
            const type = 'charge';
            
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

            jest.spyOn(pointHistoryRepository, 'create').mockResolvedValue(mockPointHistory);

            // When
            await pointService.savePointHistory(userId, points, type);

            // Then
            expect(pointHistoryRepository.create).toHaveBeenCalledWith({
                userId,
                points,
                transactionType: TransactionType.CHARGE
            }, undefined);
        });

        it('use 타입으로 저장시 TransactionType.USE로 저장되어야 한다', async () => {
            // Given
            const userId = 1;
            const points = 10000;
            const type = TransactionType.USE;
            const createdAt = new Date();
            const updatedAt = new Date();

            const usePointHistory: PointModel = {
                id: 1,
                userId: userId,
                points: points,
                transactionType: type,
                createdAt: createdAt,
                updatedAt: updatedAt,
                savePoint: jest.fn(),
                usePoint: jest.fn()
            };
            
            jest.spyOn(pointHistoryRepository, 'create').mockResolvedValue(usePointHistory);

            // When
            await pointService.savePointHistory(userId, points, 'use');

            // Then
            expect(pointHistoryRepository.create).toHaveBeenCalledWith(new PointModel({
                userId,
                points: points,
                transactionType: TransactionType.USE
            }), undefined);
        });

        it('트랜잭션 객체가 전달되면 해당 트랜잭션 내에서 실행되어야 한다', async () => {
            // Given
            const userId = 1;
            const points = 10000;
            const type = 'charge';
            const mockTx = { /* mock transaction object */ };
            
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

            jest.spyOn(pointHistoryRepository, 'create').mockResolvedValue(mockPointHistory);

            // When
            await pointService.savePointHistory(userId, points, type, mockTx);

            // Then
            expect(pointHistoryRepository.create).toHaveBeenCalledWith({
                userId,
                points,
                transactionType: TransactionType.CHARGE
            }, mockTx);
        });
    })
})