import { Injectable, Logger } from '@nestjs/common';
import { CommandHistoryService } from '../command-history/command-history.service';


@Injectable()
export class ControlService {
  private readonly logger = new Logger(ControlService.name);

  constructor(
    private readonly commandHistoryService: CommandHistoryService,
  ) {}

  private async logCommand(command: string) {
    // Ici on loggue proprement dans la BDD avec des champs corrects
    await this.commandHistoryService.logCommand({
  sessionId: 'test-session-id', // ⚠️ À remplacer plus tard
  userId: 'test-user-id',       // ✅ AJOUT ICI
  command,
  status: 'SENT',
});

  }

  async start() {
    this.logger.log('Start command received');
    await this.logCommand('start');
    return { status: 'Vehicle started' };
  }

  async stop() {
    this.logger.log('Stop command received');
    await this.logCommand('stop');
    return { status: 'Vehicle stopped' };
  }

  async forward() {
    this.logger.log('Forward command received');
    await this.logCommand('forward');
    return { status: 'Moving forward' };
  }

  async backward() {
    this.logger.log('Backward command received');
    await this.logCommand('backward');
    return { status: 'Moving backward' };
  }

  async left() {
    this.logger.log('Left command received');
    await this.logCommand('left');
    return { status: 'Turning left' };
  }

  async right() {
    this.logger.log('Right command received');
    await this.logCommand('right');
    return { status: 'Turning right' };
  }
}

