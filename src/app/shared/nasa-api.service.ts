import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* Environments */
import { environment } from '../../environments/environment';

/* Models */
import { Apod } from '../models/apod.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NasaApiService {
  private baseUrl = `https://api.nasa.gov/planetary/apod?api_key=${environment.NASA_API_KEY}`;

  constructor(
    private _http: HttpClient
  ) { }

  oneDayApod$(today: string): Observable<Apod> {
    return this._http.
      get(`${this.baseUrl}&date=${today}`);
  }

  fourDaysApods$(today: string, threeDaysBefore: string): Observable<Object> {
    return this._http.
      get(`${this.baseUrl}&start_date=${threeDaysBefore}&end_date=${today}`);
  }
}
