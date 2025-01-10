import { Test, TestingModule } from "@nestjs/testing";
import { POINT_HISTORY_REPOSITORY, PointHistoryRepositoryInterface } from "../domain/point-history.repository";
import { PointService } from "../domain/point.service";
import { TransactionType } from "@prisma/client";

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
                }
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
            
            const mockPointHistory = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date()
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
            
            const mockPointHistory = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date()
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
            const type = 'use';
            
            const mockPointHistory = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const usePointHistory = {
                ...mockPointHistory,
                transactionType: TransactionType.USE
            };
            
            jest.spyOn(pointHistoryRepository, 'create').mockResolvedValue(usePointHistory);

            // When
            await pointService.savePointHistory(userId, points, type);

            // Then
            expect(pointHistoryRepository.create).toHaveBeenCalledWith({
                userId,
                points,
                transactionType: TransactionType.USE
            }, undefined);
        });

        it('트랜잭션 객체가 전달되면 해당 트랜잭션 내에서 실행되어야 한다', async () => {
            // Given
            const userId = 1;
            const points = 10000;
            const type = 'charge';
            const mockTx = { /* mock transaction object */ };
            
            const mockPointHistory = {
                id: 1,
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE,
                createdAt: new Date(),
                updatedAt: new Date()
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