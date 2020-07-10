import { Component, OnInit, Input } from '@angular/core';
import { MovieApiService } from '../movie-api.service';
import { Movie } from '../movies';
import {MovieDescription} from '../movie';
import {NgControl, FormControl} from '@angular/forms';
import { CartService } from '../cart.service';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Multiple } from '../multiple';
import { IMDB } from '../IMDB';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cart } from '../Cart';
import { CartLogic } from '../cartLogic';
@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {
/*   movie:string;
  movies=[]
  constructor(private _http:MovieApiService) { }

  ngOnInit(): void {
    this._http.SendMovies()
    .then(res=>this.movies=res.Search)
  } */
  /* this */

  @Input() 
  movie : Movie;
  movie2:Movie;
  movies: IMDB[];
  price = 50;
  selectedMovie:MovieDescription ={
    id:1,
    Title:'Test',
    url:'',
    price:0,
    description:''
  };
  
  movies2$:Observable<IMDB[]>;
  filteredMovies$:Observable<IMDB[]>;
  filter: FormControl;
  filter$:Observable<string>;
  errorMessage:string;
  terms:Promise<any>;
  response:string[];
  multiple:Multiple[];
  _flag = false;
  searchBox:string;
  _defaultSearch = 'batman';
  count =0;
  _currentSearch = undefined;
  d = 0;
  id = 0;
  quantity =0;
  cart = [];
  item = [];
  constructor(private movieService:MovieApiService,private cartService:CartService, private route: ActivatedRoute, private http: HttpClient) {} 

      ngAfterContentChecked()
      {
       if(this._flag)
       {
      this.searchMovie(this.searchBox);
      this._flag = false;
      this.multiple!=undefined ? this.count = this.multiple.length:this.count =0;
       }
      this.get();

      }

  ngOnInit(): void {
    this.searchMovie(this._currentSearch);
  }

  get():Boolean
  {
    const title2 = this.route.snapshot.paramMap.get('imdbID');
    this.movieService.getMovieData(title2).subscribe(movieData =>{
      this.movie2 = movieData;
    },
    error => this.errorMessage = <any>error);
    return false;
  }
  searchMovie(value)
  {
    this.searchBox = value;
    this._flag = true;
    this.searchBox==null || this.searchBox == undefined || this.searchBox ==''?
    this.movieSearch(this._defaultSearch):
    this.movieSearch(value);
  }

  private movieSearch(value)
  {
       this.count =0;
       this._currentSearch = value;
       this.movieService.SeachAPIForMovieByTitle(value).pipe(debounceTime(300),distinctUntilChanged()).subscribe((data:any)=>{
            this.multiple = data.Search;
            this.multiple!=undefined ? this.count = this.multiple.length:this.count =0;
       });
  }

  addToCart(movie:any,numberOfTickets:any):void{
    this.cartService.addToCart(movie,Number.parseInt(numberOfTickets),50);
  }

  onSelect(hero: MovieDescription): void { 
    this.selectedMovie = hero;
  }

  isShow = false;
 
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
}
