import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { StartSessionDto } from './dto/start-session.dto';
import { EndSessionDto } from './dto/end-session.dto';
import { RentalService } from '../rental/rental.service';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly rentalService: RentalService,
  ) {}

  async startSession(dto: StartSessionDto) {
    this.logger.log(`Démarrage d'une session pour l'utilisateur ${dto.userId}...`);
    const session = await this.prisma.session.create({
      data: {
        userId: dto.userId,
        vehicleId: dto.vehicleId,
        raceId: dto.raceId,
        startedAt: new Date(),
        status: 'active',
      },
    });
    return session;
  }

  async endSession(dto: EndSessionDto) {
    this.logger.log(`Fin de la session ${dto.sessionId}...`);

    const session = await this.prisma.session.findUnique({
      where: { id: dto.sessionId },
      select: {
        userId: true,
        vehicleId: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session ${dto.sessionId} introuvable`);
    }

    // Décrémenter l'utilisation de location si applicable
    try {
      await this.rentalService.consumeRace(session.userId, session.vehicleId);
      this.logger.log(
        `Décrémentation de la location du véhicule ${session.vehicleId} pour l'utilisateur ${session.userId}`,
      );
    } catch (error) {
      this.logger.warn(
        `Aucune location à décrémenter pour ${session.vehicleId} (non bloquant)`,
      );
    }

    return this.prisma.session.update({
      where: { id: dto.sessionId },
      data: {
        endedAt: new Date(),
        duration: dto.duration,
        score: dto.score,
        status: 'ended',
      },
    });
  }

  async getSession(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: true,
        vehicle: true,
        race: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} introuvable`);
    }

    return session;
  }

  async getSessionStatus(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session ${sessionId} introuvable`);
    }

    return {
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      isActive: session.endedAt === null,
      status: session.status,
    };
  }
}
