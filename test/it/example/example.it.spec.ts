import { Logger } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaModule } from "@/prisma/prisma.module";

describe("Should return expected result", () => {
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
    }).compile();
    moduleRef.useLogger(new Logger());
  });

  it("Should 1=1", async () => {
    // given

    //when

    //then

    expect(1).toEqual(1);
  });
});
