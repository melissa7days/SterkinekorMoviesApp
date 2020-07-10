import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { CartComponent } from '../app/cart/cart.component';
import {MovieDetailsComponent} from '../app/movie-details/movie-details.component';
import {MainComponent} from '../app/main/main.component';
import { MovieComponent } from './movie/movie.component';

const routes:Routes =[
  {path:'cart',component:CartComponent},
  {path:'movie/:imdbID',component:MainComponent},
  {path: 'dashboard', component:MainComponent},
  {path:'', redirectTo: '/dashboard', pathMatch: 'full'}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports:[
    RouterModule
  ]
})
export class AppRoutingModule { }
