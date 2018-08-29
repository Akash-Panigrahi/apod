import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/* Environment */
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(
    private _http: HttpClient
  ) { }

  oneDayApod$(today: string) {
    return this._http
      .get(`https://api.nasa.gov/planetary/apod?api_key=${environment.NASA_API_KEY}&date=${today}`);
  }

  fourDaysApods$(today: string, threeDaysBefore: string) {
    return this._http
      .get(`https://api.nasa.gov/planetary/apod?api_key=${environment.NASA_API_KEY}&start_date=${threeDaysBefore}&end_date=${today}`);
  }
}
