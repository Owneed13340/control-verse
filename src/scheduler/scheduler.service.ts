import * as crypto from 'crypto';

import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * ⏱ Vérifie chaque minute les courses prévues dans la minute suivante (T-1min)
   * Prépare les sessions et change le statut en "starting"
   */
  @Cron('* * * * *')
  async checkUpcomingRaces() {
    const now = new Date();
    const oneMinuteFromNow = new Date(now.getTime() + 60_000);

    const races = await this.prisma.race.findMany({
      where: {
        startTime: { gte: now, lte: oneMinuteFromNow },
        status: 'scheduled',
      },
    });

    for (const race of races) {
      this.logger.log(`⏳ Préparation de la course ${race.id} (T-1min)...`);

      const participants = await this.prisma.participant.findMany({
        where: { raceId: race.id },
      });

      for (const p of participants) {
        const existing = await this.prisma.session.findFirst({
          where: {
            userId: p.userId,
            raceId: race.id,
          },
        });

        if (!existing) {
          await this.prisma.session.create({
            data: {
              userId: p.userId,
              vehicleId: p.vehicleId,
              raceId: race.id,
              status: 'ready',
            },
          });
          this.logger.log(`🛠 Session créée pour user=${p.userId}, véhicule=${p.vehicleId}`);
        } else {
          this.logger.warn(`⚠️ Session déjà existante pour user=${p.userId}, course=${race.id}`);
        }
      }

      await this.prisma.race.update({
        where: { id: race.id },
        data: { status: 'starting' },
      });

      this.logger.log(`🔄 Statut de la course ${race.id} mis à 'starting'`);
    }
  }

  /**
   * 🚦 Exécuté toutes les 10 secondes pour lancer les courses à l'heure (T = startTime)
   * Débloque les commandes et passe en "in_progress"
   */
  @Cron('*/10 * * * * *')
  async launchScheduledRaces() {
    const now = new Date();

    const races = await this.prisma.race.findMany({
      where: {
        startTime: { lte: now },
        status: 'starting',
      },
    });

    for (const race of races) {
      this.logger.log(`🚀 Lancement de la course ${race.id} (T=0)`);

      const result = await this.prisma.session.updateMany({
        where: { raceId: race.id },
        data: { status: 'active' },
      });

      this.logger.log(`✅ ${result.count} sessions activées pour la course ${race.id}`);

      await this.prisma.race.update({
        where: { id: race.id },
        data: { status: 'in_progress' },
      });

      this.logger.log(`🟢 Course ${race.id} en cours (in_progress)`);
    }
  }

  /**
   * 🏁 Vérifie toutes les 10s si des courses doivent se terminer (T + 5 min)
   * Termine les sessions, archive les données et passe la course en "finished"
   */
  @Cron('*/10 * * * * *')
  async finishEndedRaces() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60_000);

    const races = await this.prisma.race.findMany({
      where: {
        startTime: { lte: fiveMinutesAgo },
        status: 'in_progress',
      },
    });

    for (const race of races) {
      this.logger.log(`🏁 Fin de la course ${race.id} (T+5min)`);

      const result = await this.prisma.session.updateMany({
        where: { raceId: race.id },
        data: {
          status: 'finished',
          endedAt: now,
        },
      });

      this.logger.log(`🛑 ${result.count} sessions terminées pour la course ${race.id}`);

      const sessions = await this.prisma.session.findMany({
        where: { raceId: race.id },
        include: { user: true, vehicle: true },
      });

      const summary = sessions.map((s) => ({
        userId: s.userId,
        vehicleId: s.vehicleId,
        score: s.score,
        duration: s.duration,
        endedAt: s.endedAt,
        user: {
          email: s.user.email,
          firstname: s.user.firstname,
          lastname: s.user.lastname,
        },
        vehicle: {
          name: s.vehicle?.name,
          type: s.vehicle?.type,
        },
      }));

      await this.prisma.archivedRace.create({
        data: {
          raceId: race.id,
          name: race.name,
          description: race.description ?? '',
          startTime: race.startTime,
          endTime: now,
          participants: summary as any,
        },
      });

      await this.prisma.race.update({
        where: { id: race.id },
        data: { status: 'finished' },
      });

      this.logger.log(`📦 Course ${race.id} archivée et terminée (finished)`);
    }
  }
}
