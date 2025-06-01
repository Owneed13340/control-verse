import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateRaceDto } from './dto/create-race.dto';

@Injectable()
export class RacesService {
  constructor(private readonly prisma: PrismaService) {}

  // Création d'une course
  async createRace(userId: string, dto: CreateRaceDto) {
    if (!dto.startTime || isNaN(Date.parse(dto.startTime))) {
      throw new BadRequestException('❌ Date de départ invalide');
    }

    const race = await this.prisma.race.create({
      data: {
        name: dto.name,
        description: dto.description,
        startTime: new Date(dto.startTime),
        status: 'scheduled',
        creatorId: userId, // Association avec l'utilisateur qui crée la course
      },
    });

    return race;
  }

  // Récupérer les courses disponibles
  async getAvailableRaces() {
    const now = new Date();
    const races = await this.prisma.race.findMany({
      where: {
        status: 'scheduled',
        startTime: {
          gte: now,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return races;
  }

  // Rejoindre une course
  async joinRace(raceId: string, userId: string) {
    const race = await this.prisma.race.findUnique({
      where: { id: raceId },
    });

    if (!race) {
      throw new NotFoundException(`❌ Course ${raceId} introuvable`);
    }

    if (['active', 'finished'].includes(race.status)) {
      throw new ConflictException(`❌ Impossible de rejoindre une course déjà en cours ou terminée`);
    }

    const existing = await this.prisma.participant.findFirst({
      where: { raceId, userId },
    });

    if (existing) {
      throw new ConflictException(`⚠️ Vous avez déjà rejoint cette course`);
    }

    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        userId,
        status: 'available',
      },
    });

    if (!vehicle) {
      throw new NotFoundException(`❌ Aucun véhicule disponible pour cet utilisateur`);
    }

    const participant = await this.prisma.participant.create({
      data: {
        userId,
        raceId,
        vehicleId: vehicle.id,
      },
    });

    return participant;
  }

  // Récupérer les détails d'une course
  async getRaceById(id: string) {
    const race = await this.prisma.race.findUnique({
      where: { id },
      include: {
        sessions: true,
      },
    });

    if (!race) {
      throw new NotFoundException('❌ Course introuvable');
    }

    return race;
  }

  // Obtenir l'URL du flux vidéo pour la course
  getStreamUrl(raceId: string) {
    return {
      streamUrl: `https://stream.controlverse.space/${raceId}`,
    };
  }
}
