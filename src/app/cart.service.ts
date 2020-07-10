import { Injectable } from '@angular/core';
import { Movie } from './movies';
import {CartComponent} from '../app/cart/cart.component';
import {Cart} from '../app/Cart';
import { Checkout } from 'src/checkout';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  items=[];
  cartItem: Cart = {id:0,title:"",quantity:0,itemCost:0,totalCost:0}

  total = 0;
  value:Cart;
  checkout:Checkout;
  
  private cartUrl = "http://localhost:56236/api/cart";
  private itemUrl = "http://localhost:56236/api/item";
  constructor(private httpClient: HttpClient) { }

  addToCart(movie:any,quantity:number,price:number){ 

    var _totalCost = price * quantity;
    var _quantity = Number(quantity);
    var _flag =false;
    this.total += price*quantity;

    for (let index = 0; index < this.items.length; index++) {
      if( this.items[index].id == movie.imdbID)
      {
       var _num =Number(this.items[index].quantity); 
       this.items[index].quantity = Number(_quantity+_num);
       this.items[index].totalCost += _totalCost;
       _flag = true;
       break;
      }
    }

  if(!_flag)
  {
    this.setCart(movie,quantity,50,_totalCost);
  }
}
  id = 0;

  setCart(cart:any,quantity:number,price:number,totalCost:number){
    this.value = {
      id:cart.imdbID,
      title:cart.Title,
      quantity:quantity,
      itemCost:price,
      totalCost:totalCost
    }
    this.cartItem.id = this.id;
    this.cartItem.title = cart.Title;
    this.cartItem.quantity = quantity;
    this.cartItem.itemCost = price;
    this.cartItem.totalCost = totalCost;
    this.items.push(this.cartItem);

 
  }

  getItems()
  {
    return this.items;
  }

  clearCart(){
    this.total =0;
    this.items.splice(0,this.items.length);
  }

  removeItem(movie:any){
    this.items.splice(this.items.lastIndexOf(movie),1);
    this.total = this.total - movie.totalCost;
  }
  public getCartRequest(){
    return this.httpClient.get(this.cartUrl);
  }
  public getItemRequest(){
    return this.httpClient.get(this.itemUrl);
  }
}
