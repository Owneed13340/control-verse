import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTelemetryDto } from './dto/create-telemetry.dto';
import { TelemetryResponseDto } from './dto/telemetry-response.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TelemetryService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  /**
   * Vérifie si le véhicule appartient à l'utilisateur
   */
  async checkOwnership(vehicleId: string, userId: string): Promise<boolean> {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      select: { userId: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Véhicule introuvable');
    }

    return vehicle.userId === userId;
  }

  /**
   * Enregistre une donnée de télémétrie et invalide le cache
   */
  async pushTelemetry(
    vehicleId: string,
    data: CreateTelemetryDto,
  ): Promise<TelemetryResponseDto> {
    const telemetry = await this.prisma.telemetry.create({
      data: {
        vehicleId,
        batteryLevel: data.batteryLevel,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp
          ? new Date(data.timestamp).toISOString()
          : new Date().toISOString(),
      },
    });

    await this.cacheManager.del(`telemetry:${vehicleId}`);

    return {
      ...telemetry,
      timestamp: telemetry.timestamp.toISOString(),
    };
  }

  /**
   * Récupère la dernière donnée de télémétrie avec cache
   */
  async getLatestTelemetry(vehicleId: string): Promise<TelemetryResponseDto> {
    const cacheKey = `telemetry:${vehicleId}`;
    const cached = await this.cacheManager.get<TelemetryResponseDto>(cacheKey);

    if (cached) return cached;

    const telemetry = await this.prisma.telemetry.findFirst({
      where: { vehicleId },
      orderBy: { timestamp: 'desc' },
    });

    if (!telemetry) {
      throw new NotFoundException(
        `Aucune donnée de télémétrie trouvée pour le véhicule ${vehicleId}`,
      );
    }

    const result: TelemetryResponseDto = {
      ...telemetry,
      timestamp: telemetry.timestamp.toISOString(),
    };

    await this.cacheManager.set(cacheKey, result, 10); // TTL = 10s

    return result;
  }
}
