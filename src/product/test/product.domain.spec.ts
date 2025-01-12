import { ProductModel } from "../domain/model/product";

describe('ProductDomain', () => {
    let product: ProductModel;

    beforeEach(() => {
        product = new ProductModel({
            id: 1,
            name: 'Product 1',
            price: 10000,
            stock: 10,
            description: 'Product 1 description',
        });
    });


    describe('상품 생성 테스트', () => {
        it('상품 생성 테스트', () => {
            expect(product).toBeDefined();
        });
    });

    describe('상품 재고 감소 테스트', () => {
        it('상품 재고 감소 테스트', () => {
            product.decreaseStock(5);
            expect(product.stock).toBe(5);
        });
    });

    describe('상품 재고 확인 테스트', () => {
        it('상품 재고 부족 예외 테스트', () => {
            expect(() => product.checkStock(11)).toThrow(Error);
        });
    });

    describe('상품 주문 수량 확인 테스트', () => {
        it('상품 주문 수량 예외 테스트', () => {
            expect(() => product.checkAmount(0)).toThrow(Error);
        });
    });
});