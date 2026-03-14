import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [MovieModule],
  controllers: [CatalogController]
})
export class CatalogModule {}
