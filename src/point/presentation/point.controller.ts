import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PointService } from "../domain/point.service";
import { ChargePointReqDto } from "./dto/charge-point.req.dto";
import { PointFacade } from "../application/point.facade";

@Controller("point")
export class PointController {
  constructor(
    private readonly pointFacade: PointFacade,
    private readonly pointService: PointService
  ) {}

  @Patch("charge")
  async chargePoint(@Body() body: ChargePointReqDto) {
    return await this.pointFacade.chargePoint(body);
  }

  @Get(":userId")
  async getPoint(@Param("userId") userId: string) {
    return await this.pointFacade.getPoint(+userId);
  }
}
