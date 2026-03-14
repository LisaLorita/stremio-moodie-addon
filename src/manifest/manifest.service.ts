export type MoodInfo = {
  name: string;
  genres: number[];
  maxYear?: number;
  genreLogic?: 'AND' | 'OR';
};

export const MOODS_MAP: Record<string, MoodInfo> = {
  tears: {
    name: '😭 Lágrimas Garantizadas',
    genres: [18, 10752],
    maxYear: undefined
  },
  think: { name: '🧠 Para Pensar', genres: [18, 9648, 53], maxYear: undefined },
  fun: {
    name: '🤣 Para pasar un buen rato',
    genres: [35, 10402],
    maxYear: undefined
  },
  scare: { name: '😱 Para no dormir', genres: [27], maxYear: undefined },
  love: { name: '❤️‍🔥 Vivir un Amor Ciego', genres: [10749], maxYear: undefined },
  pulse: { name: '⚡ Subir pulsaciones', genres: [28, 53], maxYear: undefined },
  fantasy: {
    name: '🔮 Mundos Fantásticos',
    genres: [14, 878],
    maxYear: undefined
  },
  crime: {
    name: '🔎 Resolver un Crimen',
    genres: [80, 9648, 53],
    maxYear: undefined
  },
  epic: {
    name: '⚔️ Historias Épicas',
    genres: [36, 18, 10752, 12, 37],
    maxYear: undefined,
    genreLogic: 'OR'
  },
  family: {
    name: '🧒 Para ver en Familia',
    genres: [16, 10751],
    maxYear: undefined
  }
};

export type MoodIdType = keyof typeof MOODS_MAP;

