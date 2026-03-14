import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ManifestModule } from './manifest/manifest.module';
import { CatalogModule } from './catalog/catalog.module';
import { MovieModule } from './movie/movie.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ManifestModule,
    CatalogModule,
    MovieModule
  ],
  controllers: [AppController]
})
export class AppModule {}
