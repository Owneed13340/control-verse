import { Test, TestingModule } from '@nestjs/testing';
import { ArchivedRacesService } from './archived-races.service';

describe('ArchivedRacesService', () => {
  let service: ArchivedRacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArchivedRacesService],
    }).compile();

    service = module.get<ArchivedRacesService>(ArchivedRacesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
