import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrimaModule } from './prima/prima.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [PrimaModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
