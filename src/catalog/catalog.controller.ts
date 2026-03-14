import { Controller, Get, Header, Param, Query, Logger } from '@nestjs/common';
import { MOODS_MAP } from '../manifest/manifest.service';
import { MovieService } from '../movie/movie.service';

@Controller('catalog')
export class CatalogController {
  private readonly logger = new Logger(CatalogController.name);

  constructor(private readonly movieService: MovieService) {}

  @Get(':type/:id.json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Content-Type', 'application/json')
  async getCatalog(
    @Param('type') type: string,
    @Param('id') id: string,
    @Query('genre') moodId?: string
  ) {
    try {
      this.logger.log(
        `Incoming request: type=${type}, id=${id}, genre=${moodId}`
      );

      let rawMoodId: string | null = null;
      if (id.startsWith('mood:')) {
        rawMoodId = id.replace(/^mood:/, '');
        this.logger.log(`Detected mood in ID: ${rawMoodId}`);
      }

      if (!moodId && rawMoodId) {
        moodId = rawMoodId;
      }

      if (
        id &&
        MOODS_MAP[id as keyof typeof MOODS_MAP] &&
        !moodId &&
        !rawMoodId
      ) {
        this.logger.log(`Catalog request for mood: ${id}`);
        const result = await this.movieService.getRandomMovies(id);
        this.logger.log(`Movies fetched: ${result.metas.length}`);
        if (result.metas.length > 0) {
          this.logger.log(
            `Returned movie IDs: ${result.metas.map((m) => m.id).join(', ')}`
          );
        }
        return result;
      }

      const finalMoodId = rawMoodId || moodId;
      if (finalMoodId) {
        const extractedMoodId = finalMoodId.replace(/^mood:/, '');
        if (!MOODS_MAP[extractedMoodId as keyof typeof MOODS_MAP]) {
          this.logger.warn(`Mood not found: ${extractedMoodId}`);
          return { metas: [] };
        }

        this.logger.log(`Fetching movies for mood: ${extractedMoodId}`);
        const result = await this.movieService.getRandomMovies(extractedMoodId);
        this.logger.log(`Movies fetched: ${result.metas.length}`);

        if (result.metas.length > 0) {
          this.logger.log(
            `Returned movie IDs: ${result.metas.map((m) => m.id).join(', ')}`
          );
        }

        return result;
      }

      this.logger.warn(
        `Unrecognized request: type=${type}, id=${id}, genre=${moodId}`
      );
      return { metas: [] };
    } catch (error) {
      this.logger.error('Error in getCatalog:', error);
      if (error instanceof Error) {
        this.logger.error('Error stack:', error.stack);
      }
      return { metas: [] };
    }
  }
}
