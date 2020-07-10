import { Component, OnInit } from '@angular/core';
import {CartService} from '../cart.service';
import {MovieDescription} from '../movie'
import { MovieApiService } from '../movie-api.service';
import { getInterpolationArgsLength } from '@angular/compiler/src/render3/view/util';
import { HttpClient } from '@angular/common/http';
import { CartLogic } from '../cartLogic';
import { Cart } from '../Cart';
import { title } from 'process';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  item:Cart[] = [];
  cartItem: Cart = {id:0,title:"",quantity:0,itemCost:0,totalCost:0}
  total = 0;
  count=0;
  id=0;
  title;
  quantity;
  itemCost;
  totalCost;
  cartId=0;
  constructor(private cartService:CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.item = this.cartService.getItems();
    this.total = this.cartService.total;
    this.numberOfItems();
  }

  ngAfterContentChecked()
  {
    this.total = this.cartService.total;
    this.numberOfItems();
  }
  addToCart(){
    console.log(this.item);
    var item = this.http.post<Cart[]>('http://localhost:56236/api/item', this.item).subscribe(()=>{}); 
    this.http.post<CartLogic>('http://localhost:56236/api/cart', {finalTotal:this.total}).subscribe(data =>{
      console.log(data);
      this.cartId = data.cartId;
      window.alert("Your tickets have been added, you can now checkout!");

    })
    
  }
  removeItem(item:any) : void {
    this.cartService.removeItem(item);
  }

  clearCart():void{
    this.cartService.clearCart();
  }

  numberOfItems()
  {
     this.count = this.item.length;
  }

  

}
