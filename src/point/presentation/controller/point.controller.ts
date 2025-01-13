import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { ChargePointReqDto } from "@/point/presentation/dto/request/charge-point-req.dto";
import { PointFacade } from "@/point/application/facade/point.facade";
import { ChargePointResponseDto } from "@/point/presentation/dto/response/charge-point-resp.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetPointResponseDto } from "@/point/presentation/dto/response/get-point.resp.dto";

@ApiTags('Point')
@Controller("point")
export class PointController {
  constructor(
    private readonly pointFacade: PointFacade
  ) {}

  @ApiOperation({ summary: '포인트 충전', description: '사용자의 포인트를 충전합니다.' })
  @ApiResponse({ 
    status: 200, 
    description: '포인트 충전 성공',
    type: ChargePointResponseDto 
  })
  @Patch("charge")
  async chargePoint(@Body() body: ChargePointReqDto): Promise<ChargePointResponseDto> {
    const pointHistory = await this.pointFacade.chargePoint(body);
    return ChargePointResponseDto.from(pointHistory);
  }

  @ApiOperation({ summary: '포인트 조회', description: '사용자의 포인트 잔액을 조회합니다.' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ 
    status: 200, 
    description: '포인트 조회 성공',
    type: GetPointResponseDto 
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
  @Get(":userId")
  async getPoint(@Param("userId", ParseIntPipe) userId: number): Promise<GetPointResponseDto> {
    const point = await this.pointFacade.getPoint(userId);
    return GetPointResponseDto.from(userId, point);
  }
}
