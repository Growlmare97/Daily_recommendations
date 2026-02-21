import { Destination } from '../types';

export const destinations: Destination[] = [
  { city: 'Paris', country: 'France', description: 'Classic boulevards, museums, and cafe life.', attractions: { culture: ['Louvre', 'Musée d\'Orsay', 'Notre-Dame'], nature: ['Luxembourg Gardens'], food: ['Le Marais bistros', 'Rue Cler'], nightlife: ['Canal Saint-Martin bars'] } },
  { city: 'Rome', country: 'Italy', description: 'Ancient history and vibrant street culture.', attractions: { culture: ['Colosseum', 'Roman Forum', 'Vatican Museums'], nature: ['Villa Borghese'], food: ['Trastevere trattorias', 'Campo de\' Fiori market'], nightlife: ['Monti wine bars'] } },
  { city: 'Barcelona', country: 'Spain', description: 'Gaudí architecture, beaches, and tapas.', attractions: { culture: ['Sagrada Família', 'Gothic Quarter'], nature: ['Park Güell', 'Barceloneta Beach'], food: ['La Boqueria', 'Poble-sec tapas'], nightlife: ['El Born clubs'] } },
  { city: 'Amsterdam', country: 'Netherlands', description: 'Canal city with arts, bikes, and cozy neighborhoods.', attractions: { culture: ['Rijksmuseum', 'Anne Frank House'], nature: ['Vondelpark', 'Canal cruise'], food: ['Jordaan cafés'], nightlife: ['Leidseplein venues'] } },
  { city: 'Prague', country: 'Czechia', description: 'Storybook old town and affordable old-world charm.', attractions: { culture: ['Prague Castle', 'Charles Bridge', 'Old Town Square'], nature: ['Petrin Hill'], food: ['Lokál', 'Café Savoy'], nightlife: ['Žižkov beer bars'] } },
  { city: 'Vienna', country: 'Austria', description: 'Imperial palaces, coffee houses, and classical music.', attractions: { culture: ['Schönbrunn Palace', 'Belvedere Museum'], nature: ['Danube Island'], food: ['Naschmarkt', 'Traditional cafes'], nightlife: ['Gürtel bars'] } },
  { city: 'Berlin', country: 'Germany', description: 'Creative capital with layered history and nightlife.', attractions: { culture: ['Museum Island', 'Berlin Wall Memorial'], nature: ['Tiergarten'], food: ['Markthalle Neun'], nightlife: ['Kreuzberg clubs', 'Berghain area'] } }
];
