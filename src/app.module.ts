import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MangaController } from './manga/manga.controller';

@Module({
  imports: [],
  controllers: [AppController, MangaController],
  providers: [AppService],
})
export class AppModule {}
