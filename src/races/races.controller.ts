import { Controller, Get, Post, Param, Body, UseGuards, Req, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRaceDto } from './dto/create-race.dto';
import { RacesService } from './races.service';

@ApiTags('races')
@UseGuards(JwtAuthGuard)
@Controller('races')
export class RacesController {
  constructor(private readonly racesService: RacesService) {}

  // Créer une course
  @Post()
  @ApiOperation({ summary: 'Créer une course' })
  async create(@Req() req, @Body() dto: CreateRaceDto) {
    if (!dto.startTime || isNaN(Date.parse(dto.startTime))) {
      throw new BadRequestException('❌ Date de départ invalide');
    }

    const userId = req.user.id;
    const race = await this.racesService.createRace(userId, dto);
    return {
      message: '✅ Course créée',
      data: race,
    };
  }

  // Obtenir les courses disponibles
  @Get('available')
  @ApiOperation({ summary: 'Liste des courses programmées à venir' })
  async getAvailable() {
    const races = await this.racesService.getAvailableRaces();
    return {
      message: '✅ Courses disponibles récupérées avec succès',
      data: races,
    };
  }

  // Rejoindre une course
  @Post(':id/join')
  @ApiOperation({ summary: 'Rejoindre une course' })
  async join(@Req() req, @Param('id') raceId: string) {
    const userId = req.user.id;
    const participant = await this.racesService.joinRace(raceId, userId);

    return {
      message: '✅ Course rejointe avec succès',
      data: participant,
    };
  }

  // Détails d'une course
  @Get(':id')
  @ApiOperation({ summary: 'Détails d’une course' })
  async getOne(@Param('id') id: string) {
    const race = await this.racesService.getRaceById(id);
    return {
      message: '✅ Détails de la course récupérés avec succès',
      data: race,
    };
  }

  // Obtenir l'URL du flux vidéo FPV
  @Get(':id/stream-url')
  @ApiOperation({ summary: 'URL du flux vidéo FPV (param: id course)' })
  async getStreamUrl(@Param('id') id: string, @Req() req) {
    const streamUrl = await this.racesService.getStreamUrl(id);
    return {
      message: '✅ Flux vidéo récupéré avec succès',
      data: streamUrl,
    };
  }
}
