import { ILanguage } from './models/language.model';

export const APP_LANGUAGES: ILanguage[] = [
  {
    icon: 'england',
    code: 'en',
    name: 'English',
  },
  {
    icon: 'norway',
    code: 'no',
    name: 'Norwegian',
  },
];

export const MAP_LAYERS = [
  {
    name: 'Open Street',
    value: 'osm',
  },
  {
    name: 'Transport',
    value: 'transport',
  },
  {
    name: 'Bing Road',
    value: 'road',
  },
  {
    name: 'Bing Aerial with Labels',
    value: 'aerialwithlabels',
  },
  {
    name: 'Bing Dark',
    value: 'darkview',
  },
  {
    name: 'Bing Light',
    value: 'lightview',
  },
];
