import { Module } from '@nestjs/common';
import { ControlController } from './control.controller';
import { ControlService } from './control.service';
import { CommandHistoryModule } from '../command-history/command-history.module';

@Module({
  imports: [CommandHistoryModule],
  controllers: [ControlController],
  providers: [ControlService],
})
export class ControlModule {}

