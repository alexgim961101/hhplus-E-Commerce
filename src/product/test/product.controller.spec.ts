import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from "@/product/presentation/controller/product.controller";
import { ProductService } from "@/product/domain/service/product.service";
import { PaginationQueryDto } from "@/common/dto/pagination-query.dto";
import { ProductModel } from '@/product/domain/model/product';

describe('ProductController', () => {
    let controller: ProductController;
    let productService: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        getProducts: jest.fn()
                    }
                }
            ]
        }).compile();

        controller = module.get<ProductController>(ProductController);
        productService = module.get<ProductService>(ProductService);
    });

    describe('getProducts', () => {
        it('상품 목록이 정상적으로 조회되어야 한다', async () => {
            // Given
            const query: PaginationQueryDto = {
                page: 1,
                limit: 10
            };

            const mockResponse = {
                products: [
                    new ProductModel({
                        id: 1,
                        name: 'Product 1',
                        price: 10000,
                        stock: 10,
                        description: 'Product 1 description',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    })
                ],
                totalPages: 1,
                currentPage: 1,
                totalCount: 1
            };

            jest.spyOn(productService, 'getProducts').mockResolvedValue(mockResponse);

            // When
            const result = await controller.getProducts(query);

            // Then
            expect(productService.getProducts).toHaveBeenCalledWith(query.page, query.limit);
            expect(result).toEqual(mockResponse);
            expect(result.products).toHaveLength(1);
            expect(result.totalPages).toBe(1);
            expect(result.currentPage).toBe(1);
            expect(result.totalCount).toBe(1);
        });
    });
});