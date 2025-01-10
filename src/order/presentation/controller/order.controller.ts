import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrderFacadeService } from "../../application/facade/order.facade.service";
import { OrderProductReqDto } from "../dto/order-product.req.dto";
import { OrderProductRespDto } from "../dto/order-product.resp.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Order')
@Controller('order')
export class OrderController {

  constructor(private readonly orderFacadeService: OrderFacadeService) {}

  /**
   * 주문하기
   * 
   * Input:
   * - products: List<Product> - 상품 정보 확인
   * -- productId: number
   * -- amount: number
   * - userId: number - 유저 정보 확인 및 쿠폰과 연계
   * - couponId: number - 쿠폰 정보 확인
   * Output:
   * - products: List<Product> - 주문 상품 정보
   * -- productId: number
   * -- amount: number
   * - sum: number - 주문 총 금액
   * - discount: number - 할인 금액
   * - total: number - 최종 결제 금액
   * 
   * 로직
   * 1. 상품 정보 확인
   * 2. 상품의 가격 * amount 합산 -> sum 값 계산
   * 3. 쿠폰 정보 확인
   * 4. 쿠폰 할인 금액 계산
   * 5. 최종 결제 금액 계산
   * 6. 주문 생성
   * 
   * 테스트 케이스
   * 1. 상품 수량이 10개 남았는데 동시에 5개씩 3번 요청이 들어오면 요청 하나는 실패해야 한다.
   * 2. 쿠폰이 있는 경우 쿠폰 할인 금액 계산
   */
  @ApiOperation({ 
    summary: '상품 주문',
    description: '사용자 식별자와 상품 목록을 입력받아 주문을 생성합니다. 할인 쿠폰 적용이 가능합니다.'
  })
  @ApiResponse({ 
    status: 201,
    description: '주문 생성 성공',
    type: OrderProductRespDto
  })
  @ApiResponse({ 
    status: 400,
    description: '잘못된 주문 요청입니다.'
  })
  @ApiResponse({ 
    status: 404,
    description: '존재하지 않는 사용자입니다.'
  })
  @Post()
  async orderProduct(@Body() orderProductReqDto: OrderProductReqDto): Promise<OrderProductRespDto> {
    return await this.orderFacadeService.orderProduct(orderProductReqDto);
  }
}
