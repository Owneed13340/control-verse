import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma.service'; // ✅ Injection directe
import { RentalModule } from '../rental/rental.module'; // ✅ Nécessaire pour RentalService

@Module({
  imports: [RentalModule],
  controllers: [SessionController],
  providers: [SessionService, PrismaService],
})
export class SessionModule {}
