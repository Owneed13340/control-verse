import { Module, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScheduleModule } from '@nestjs/schedule';

// 🔁 Cache Redis
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';

// 🧬 Prisma ORM
import { PrismaModule, loggingMiddleware } from 'nestjs-prisma';

// ⚙️ Configuration app
import config from './common/configs/config';
import { GqlConfigService } from './gql-config.service';

// 🎯 Core
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';

// 🔐 Auth / Users / Profiles
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';

// 🚗 Véhicules / Courses
import { VehiclesModule } from './vehicles/vehicles.module';
import { VehicleModelsModule } from './vehicle-models/vehicle-models.module';
import { RacesModule } from './races/races.module';
import { ArchivedRacesModule } from './archived-races/archived-races.module';

// 🎮 Jeu & Contrôle en temps réel
import { GameModule } from './game/game.module';
import { GameGateway } from './game/game.gateway';
import { GatewayModule } from './gateway/gateway.module';
import { SessionModule } from './session/session.module';
import { ControlModule } from './control/control.module';
import { TelemetryModule } from './telemetry/telemetry.module';

// 🛒 Boutique / Portefeuille / Location
import { StoreModule } from './store/store.module';
import { WalletModule } from './wallet/wallet.module';
import { RentalModule } from './rental/rental.module';
import { ArchivedRentalModule } from './archived-rental/archived-rental.module';

// 📡 Divers
import { StatusModule } from './status/status.module';
import { PostsModule } from './posts/posts.module';
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [
    // 📦 Chargement de la config globale
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    // 🚀 Cache Redis (fixé et compatible)
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      url: 'redis://localhost:6379',
      ttl: 60,
    }),

    // 🔌 ORM Prisma avec middleware
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [
          loggingMiddleware({
            logger: new Logger('PrismaMiddleware'),
            logLevel: 'log',
          }),
        ],
      },
    }),

    // 📡 GraphQL Apollo
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useClass: GqlConfigService,
    }),

    // ⏰ Planification
    ScheduleModule.forRoot(),

    // 🧩 Modules métiers
    AuthModule,
    UsersModule,
    ProfileModule,
    PostsModule,
    VehiclesModule,
    VehicleModelsModule,
    RacesModule,
    ArchivedRacesModule,
    TelemetryModule,
    SessionModule,
    ControlModule,
    GatewayModule,
    GameModule,
    StoreModule,
    WalletModule,
    RentalModule,
    ArchivedRentalModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, GameGateway, SchedulerService],
})
export class AppModule {}
