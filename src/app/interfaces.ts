export interface IApod {
  copyright?: string;
  date?: string;
  explanation?: string;
  hdurl?: string;
  media_type?: string;
  sevice_version?: string;
  title?: string;
  url?: string;
}

export interface IAstronomyPictureOf {
  threeDaysBefore: IApod;
  twoDaysBefore: IApod;
  yesterday: IApod;
  today: IApod;
}

export interface ILocalStorageItem {
  key: string;
  value: IAstronomyPictureOf;
}
