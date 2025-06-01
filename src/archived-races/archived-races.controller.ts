import { Controller, Get } from '@nestjs/common';
import { ArchivedRacesService } from './archived-races.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('archived-races')
@Controller('archived-races')
export class ArchivedRacesController {
  constructor(private readonly archivedRacesService: ArchivedRacesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des courses archivées' })
  findAll() {
    return this.archivedRacesService.findAll();
  }
}
