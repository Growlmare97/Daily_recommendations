import { Destination } from '../types';
import { cities } from './cities';

const highlightAttractions: Record<string, Record<string, string[]>> = {
  Paris: { culture: ['Louvre', 'Musée d\'Orsay', 'Notre-Dame'], nature: ['Luxembourg Gardens'], food: ['Le Marais bistros'], nightlife: ['Canal Saint-Martin bars'] },
  Rome: { culture: ['Colosseum', 'Roman Forum', 'Vatican Museums'], nature: ['Villa Borghese'], food: ['Trastevere trattorias'], nightlife: ['Monti wine bars'] },
  Barcelona: { culture: ['Sagrada Família', 'Gothic Quarter'], nature: ['Park Güell', 'Barceloneta Beach'], food: ['La Boqueria'], nightlife: ['El Born clubs'] },
  Berlin: { culture: ['Museum Island', 'Berlin Wall Memorial'], nature: ['Tiergarten'], food: ['Markthalle Neun'], nightlife: ['Kreuzberg clubs'] },
  Amsterdam: { culture: ['Rijksmuseum', 'Anne Frank House'], nature: ['Vondelpark'], food: ['Jordaan cafés'], nightlife: ['Leidseplein'] }
};

const genericAttractions = (city: string) => ({
  culture: [`${city} Old Town`, `${city} Main Museum`],
  nature: [`${city} City Park`],
  food: [`${city} Central Market`, `${city} Local food street`],
  nightlife: [`${city} Riverside bars`]
});

export const destinations: Destination[] = cities.map((city) => ({
  city: city.city,
  country: city.country,
  description: city.vibe,
  attractions: highlightAttractions[city.city] ?? genericAttractions(city.city)
}));
