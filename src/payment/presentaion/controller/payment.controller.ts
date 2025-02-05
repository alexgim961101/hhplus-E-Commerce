import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreatePaymentReqDto } from "@/payment/presentaion/dto/request/create-payment.dto";
import { PaymentFacadeService } from "@/payment/application/payment.facade";
import { CreatePaymentResDto } from "@/payment/presentaion/dto/response/create-payment.dto";

@Controller('payment')
export class PaymentController {

    constructor(
        private readonly paymentFacadeService: PaymentFacadeService
    ) {}

    @Get()
    async getPaymentHeathCheck() {
        return 'ok';
    }

    /**
     * 결제 생성
     * 
     * 기능
     * - 결제 수단 (Point, Card), 주문 ID를 받아서 결제 처리
     * - 결제 처리 후 결제 내역 저장 (payment, point_history)
     * - 결제 처리 후 주문 상태 업데이트 (order)
     * - 결제 정보를 다른 곳에서 활용할 수 있으니 예시로 Mock API 호출
     * 
     * 주의 사항
     * - Point 결제 시, 유저의 Point가 부족할 경우 결제 실패 처리
     * - Card 결제 시, 카드 정보 검증 후 결제 처리
     * - 결제 실패 시, 예외 처리 및 예외 메시지 반환
     */
    @Post()
    async postPayment(@Body() createPaymentReqDto: CreatePaymentReqDto) {

        const payment = await this.paymentFacadeService.createPayment(createPaymentReqDto.orderId, createPaymentReqDto.paymentMethod);

        return new CreatePaymentResDto(payment);
    }
}