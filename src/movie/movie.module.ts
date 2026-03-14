import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5
    }),
    ConfigModule
  ],
  providers: [MovieService],
  exports: [MovieService]
})
export class MovieModule {}
