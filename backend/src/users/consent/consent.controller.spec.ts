import { Test, TestingModule } from '@nestjs/testing';
import { ConsentsController } from './consent.controller';
import { ConsentsService } from './consent.service';

describe('ConsentController', () => {
  let controller: ConsentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsentsController],
      providers: [ConsentsService],
    }).compile();

    controller = module.get<ConsentsController>(ConsentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
