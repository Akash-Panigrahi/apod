export interface Apod {
  copyright?: string;
  date?: string;
  explanation?: string;
  hdurl?: string;
  media_type?: string;
  sevice_version?: string;
  title?: string;
  url?: string;
}

export interface AstronomyPictureOf {
  threeDaysBefore: Apod;
  twoDaysBefore: Apod;
  yesterday: Apod;
  today: Apod;
}

export interface SessionStorageItem {
  key: string;
  value: AstronomyPictureOf;
}
