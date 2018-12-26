import { Component, OnInit, Input } from '@angular/core';
import { AuctionProduct } from 'src/app/models/AuctionProduct';
import { Router } from '@angular/router';
import { AuctionProductService } from 'src/app/services/auction-product.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'auction-product-card',
  templateUrl: './auction-product-card.component.html',
  styleUrls: ['./auction-product-card.component.css']
})
export class AuctionProductCardComponent implements OnInit {
  
  @Input() 
  auctionProduct: AuctionProduct;
  value: number;
  
  message: string = null;
  messageCssClass: string = null;
  lockBid = false;

  constructor(
    private auctionProductService: AuctionProductService,
    private helper: HelperService
  ) {
  }

  ngOnInit() {
    
  }

  ngDoCheck() {
    if(this.auctionProduct.lastValidBid) {
      if(this.value > this.auctionProduct.lastValidBid.value)
        return; 
        
      this.value = Number((this.auctionProduct.lastValidBid.value + this.auctionProduct.incrementValue ).toFixed(2));
      return;
    }

    this.value = this.auctionProduct.initialValue;
  }

  AddBid() { 
    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "enviando...";

    this.auctionProductService.PostBid(this.value, this.auctionProduct.id).subscribe(
      result => {
        this.message = null;
        this.lockBid = false;
      },
      ex => {
        this.messageCssClass = "form-text text-muted alert alert-danger";
        this.message = this.helper.GetErrorMessage(ex);
        this.lockBid = false;
      }
    );
  }
}