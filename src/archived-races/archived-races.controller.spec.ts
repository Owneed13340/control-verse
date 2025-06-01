import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedRacesController } from './archived-races.controller';

describe('ArchivedRacesController', () => {
  let controller: ArchivedRacesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchivedRacesController],
    }).compile();

    controller = module.get<ArchivedRacesController>(ArchivedRacesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
