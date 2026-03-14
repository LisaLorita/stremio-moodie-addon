import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { MoodIdType, MOODS_MAP } from '../manifest/manifest.service';
import { TmdbMovie, TmdbDiscoverResponse } from './interfaces/movie.interface';

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    const baseUrl = this.configService.get<string>('TMDB_API_BASE_URL');
    const apiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!baseUrl || !apiKey) {
      throw new Error(
        'TMDB_API_BASE_URL or TMDB_API_KEY is not defined in the environment variables.'
      );
    }

    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async getRandomMovies(moodId: string) {
    const moodData = MOODS_MAP[moodId as MoodIdType];
    if (!moodData) {
      return { metas: [] };
    }

    const joinChar = moodData.genreLogic === 'OR' ? '|' : ',';
    const genreIds = moodData.genres.join(joinChar);


    const maxPages = moodData.maxYear ? 50 : 10;
    const randomPage = Math.floor(Math.random() * maxPages) + 1;

    const url = `${this.baseUrl}/discover/movie`;
    const params: any = {
      api_key: this.apiKey,
      with_genres: genreIds,
      sort_by: 'popularity.desc',
      language: 'es-ES',
      page: randomPage
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbDiscoverResponse>(url, { params })
      );

      const results: TmdbMovie[] = response.data.results;

      if (!results || results.length === 0) {
        return { metas: [] };
      }

      const moviesWithBasicInfo = results.filter(
        (movie) => movie.poster_path && movie.title && movie.overview
      );

      if (!moviesWithBasicInfo || moviesWithBasicInfo.length === 0) {
        return { metas: [] };
      }

      const shuffled = moviesWithBasicInfo.sort(() => 0.5 - Math.random());
      const selectedMovies = shuffled.slice(0, 10);

      const movieDetails = await Promise.all(
        selectedMovies.map(async (movie) => {
          try {
            const detailsUrl = `${this.baseUrl}/movie/${movie.id}`;
            const detailsResponse = await firstValueFrom(
              this.httpService.get<{ imdb_id?: string | null }>(detailsUrl, {
                params: { api_key: this.apiKey, language: 'es-ES' }
              })
            );
            let imdbId = detailsResponse.data.imdb_id || null;

            if (imdbId && typeof imdbId === 'string') {
              imdbId = imdbId.trim();
              if (imdbId && !imdbId.startsWith('tt')) {
                imdbId = `tt${imdbId}`;
              }
            }

            return {
              movie,
              imdbId: imdbId
            };
          } catch (error) {
            this.logger.warn(
              `Could not fetch details for movie ${movie.id}:`,
              error instanceof Error ? error.message : 'Unknown error'
            );
            return { movie, imdbId: null };
          }
        })
      );

      const moviesWithImdbId = movieDetails.filter(
        (item) => item.imdbId && item.movie.poster_path && item.movie.title
      );

      if (moviesWithImdbId.length === 0) {
        this.logger.warn(
          `No se encontraron películas válidas con imdb_id para el mood ${moodId}`
        );
        return { metas: [] };
      }


      const finalMovies = moviesWithImdbId.slice(0, 3);

      const metas = finalMovies
        .map(({ movie, imdbId }) => {
          try {

            if (!imdbId || typeof imdbId !== 'string' || imdbId.trim() === '') {
              this.logger.warn(`Invalid imdbId for movie ${movie.id}`);
              return null;
            }


            const posterUrl =
              movie.poster_path &&
              movie.poster_path !== 'null' &&
              movie.poster_path !== null
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : undefined;
            const backgroundUrl =
              movie.poster_path &&
              movie.poster_path !== 'null' &&
              movie.poster_path !== null
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : undefined;


            if (!posterUrl) {
              this.logger.warn(`Movie ${movie.id} does not have a valid poster`);
              return null;
            }


            let formattedImdbId = imdbId;
            if (formattedImdbId) {

              formattedImdbId = formattedImdbId.startsWith('tt')
                ? formattedImdbId
                : `tt${formattedImdbId}`;
            } else {
              this.logger.warn(`Empty imdbId for movie ${movie.id}`);
              return null;
            }

            const meta: any = {
              id: formattedImdbId,
              type: 'movie',
              name: movie.title || 'Sin título',
              poster: posterUrl,
              description: movie.overview || ''
            };


            if (backgroundUrl) {
              meta.background = backgroundUrl;
            }

            if (
              movie.genre_ids &&
              Array.isArray(movie.genre_ids) &&
              movie.genre_ids.length > 0
            ) {
              meta.genres = movie.genre_ids.map((id) => this.getGenreName(id));
            }


            this.logger.debug(`Meta created: ${meta.id} - ${meta.name}`);

            return meta;
          } catch (error) {
            this.logger.error(`Error processing movie ${movie.id}:`, error);
            return null;
          }
        })
        .filter((meta) => meta !== null && meta !== undefined);

      this.logger.log(
        `Final metas returned: ${metas.length} for mood ${moodId}`
      );
      return { metas };
    } catch (error) {
      let errorMessage = 'An unknown error occurred.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      this.logger.error('Error getting random movies:', errorMessage);

      return { metas: [] };
    }
  }

  private getGenreName(id: number): string {
    return id.toString();
  }
}
