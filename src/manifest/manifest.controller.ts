import { Controller, Get, Header } from '@nestjs/common';
import { MOODS_MAP } from './manifest.service';

@Controller()
export class ManifestController {
  constructor() {}

  @Get('manifest.json')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Content-Type', 'application/json')
  getManifest() {
    const catalogs = Object.entries(MOODS_MAP).map(([key, value]) => ({
      id: key,
      type: 'movie',
      name: value.name
    }));

    return {
      id: 'com.lisalorita.moodie.addon',
      version: '1.0.0',
      name: '🎬 Mood Selector',
      description:
        'Randomly selects movies based on your current mood.',
      resources: ['catalog'],
      types: ['movie'],
      catalogs: catalogs,
      idPrefixes: [],
      background: 'https://via.placeholder.com/1920x1080.png',
      logo: 'https://via.placeholder.com/512x512.png',
      contactEmail: '',
      behaviorHints: {
        adult: false,
        p2p: false,
        bingeable: true
      }
    };
  }
}
