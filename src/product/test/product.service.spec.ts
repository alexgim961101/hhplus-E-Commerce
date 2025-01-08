import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../domain/service/product.service';
import { PRODUCT_REPOSITORY, ProductRepository } from '../domain/repopsitory/product.service';
import { Product } from '@prisma/client';

describe('ProductService', () => {
    let service: ProductService;
    let repository: ProductRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: PRODUCT_REPOSITORY,
                    useValue: {
                        findAll: jest.fn(),
                        count: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<ProductService>(ProductService);
        repository = module.get<ProductRepository>(PRODUCT_REPOSITORY);
    });

    describe('getProducts', () => {
        it('페이지네이션된 상품 목록이 정상적으로 조회되어야 한다', async () => {
            // Given
            const page = 1;
            const limit = 10;
            const totalCount = 2;

            const mockProducts: Product[] = [
                {
                    id: 1,
                    name: 'Product 1',
                    price: 10000,
                    stock: 10,
                    description: 'Product 1 description',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    name: 'Product 2',
                    price: 20000,
                    stock: 20,
                    description: 'Product 2 description',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            jest.spyOn(repository, 'findAll').mockResolvedValue(mockProducts);
            jest.spyOn(repository, 'count').mockResolvedValue(totalCount);

            // When
            const result = await service.getProducts(page, limit);

            // Then
            expect(repository.findAll).toHaveBeenCalledWith(page, limit);
            expect(repository.count).toHaveBeenCalled();
            expect(result.products).toEqual(mockProducts);
            expect(result.totalCount).toBe(totalCount);
            expect(result.currentPage).toBe(page);
        });
        
        it('totalPages가 올바르게 계산되어야 한다', async () => {
            // Given
            const page = 1;
            const limit = 10;
            const totalCount = 21; // 총 21개의 상품이 있을 때 3페이지가 나와야 함

            const mockProducts: Product[] = [
                {
                    id: 1,
                    name: 'Product 1',
                    price: 10000,
                    stock: 10,
                    description: 'Product 1 description',
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 2,
                    name: 'Product 2',
                    price: 20000,
                    stock: 20,
                    description: 'Product 2 description',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            jest.spyOn(repository, 'findAll').mockResolvedValue(mockProducts);
            jest.spyOn(repository, 'count').mockResolvedValue(totalCount);

            // When
            const result = await service.getProducts(page, limit);

            // Then
            expect(result.totalPages).toBe(3); // ceil(21/10) = 3
        });
        
        it('마지막 페이지의 상품 목록이 정상적으로 조회되어야 한다', async () => {
            // Given
            const mockProducts: Product[] = [
                {
                    id: 1,
                    name: 'Product 1',
                    price: 10000,
                    stock: 10,
                    description: 'Product 1 description',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ];

            const page = 3;
            const limit = 10;
            const totalCount = 21;
            const lastPageProducts = [mockProducts[0]]; // 마지막 페이지에는 1개의 상품만 있음

            jest.spyOn(repository, 'findAll').mockResolvedValue(lastPageProducts);
            jest.spyOn(repository, 'count').mockResolvedValue(totalCount);

            // When
            const result = await service.getProducts(page, limit);

            // Then
            expect(repository.findAll).toHaveBeenCalledWith(page, limit);
            expect(result.products).toHaveLength(1);
            expect(result.currentPage).toBe(page);
        });
        
        it('상품이 없을 경우 빈 배열을 반환해야 한다', async () => {
            // Given
            const page = 1;
            const limit = 10;
            const totalCount = 0;

            jest.spyOn(repository, 'findAll').mockResolvedValue([]);
            jest.spyOn(repository, 'count').mockResolvedValue(totalCount);

            // When
            const result = await service.getProducts(page, limit);

            // Then
            expect(result.products).toEqual([]);
            expect(result.totalCount).toBe(0);
            expect(result.totalPages).toBe(0);
        });
    });
});