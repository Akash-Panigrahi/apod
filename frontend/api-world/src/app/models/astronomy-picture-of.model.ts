import { Apod } from './apod.model';

export class AstronomyPictureOf {
  constructor(
    public threeDaysBefore?: Apod,
    public twoDaysBefore?: Apod,
    public yesterday?: Apod,
    public today?: Apod,
  ) { }
}
