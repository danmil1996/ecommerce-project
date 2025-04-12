import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  countryUrl: string = 'http://localhost:8080/api/countries';
  stateUrl: string = 'http://localhost:8080/api/states';

  constructor(
    private httpClient: HttpClient
  ) { }

  getCreditCardMonthsArray(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push (month);
    }
    return of (data);
  }

  getCreditCardYearsArray(): Observable<number[]> {
    let data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push (year);
    }
    return of (data);
  }

  getCountries$(): Observable<Country[]> {
    return this.httpClient.get<GetResponseCountries>(this.countryUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates$(countryCode: string): Observable<State[]> {    
    const stateByCountryCodeUrl = `${this.stateUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseStates>(stateByCountryCodeUrl).pipe(
      map(response => response._embedded.states)
    )
  }

  
}


export interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

export interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
