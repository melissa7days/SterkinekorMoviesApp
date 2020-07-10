import { Injectable } from '@angular/core';
import { Observable,of} from "rxjs";
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {Movie} from './movies';
import { map, filter, switchMap } from 'rxjs/operators'
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { IMDB } from './IMDB';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieApiService {

  movie:IMDB[];
  result :any =[]
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),

  };

  private _siteURL = 'https://www.omdbapi.com/?t=';
  private _param = '&apikey=';
  private _key = '9ad5a19c';

  constructor(
    private http: HttpClient) { }


 getMovieData(id): Observable<Movie> {

      return this.http.get<Movie>('https://www.omdbapi.com/?i=' + id 
        + this._param + this._key);
    }
    
SeachAPIForMovieByTitle(value){
  return this.http.get(`https://www.omdbapi.com/?s=${value}${this._param}${this._key}`);
}

}

