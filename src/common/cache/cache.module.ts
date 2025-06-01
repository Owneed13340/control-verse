import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import type { RedisClientOptions } from 'redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => ({
        isGlobal: true,
        store: redisStore,
        url: 'redis://localhost:6379',
        ttl: 60,
      }),
    }),
  ],
  exports: [CacheModule],
})
export class GlobalCacheModule {}
