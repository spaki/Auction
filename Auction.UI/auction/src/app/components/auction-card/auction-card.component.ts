import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { AuctionService } from 'src/app/services/auction.service';
import { AuctionProduct } from 'src/app/models/AuctionProduct';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.component.html',
  styleUrls: ['./auction-card.component.css']
})
export class AuctionCardComponent implements OnInit {
  
  @Input() 
  auctionProduct: AuctionProduct;
  
  message: string = null;
  messageCssClass: string = null;
  value: number;

  constructor(
    private auctionService: AuctionService,
    private router: Router
  ) {
  }

  ngOnInit() {
    
  }

  ngDoCheck() {
    if(this.auctionProduct.lastValidBid) {
      this.value = this.auctionProduct.lastValidBid.value + 1;
      return;
    }

    this.value = this.auctionProduct.startValue;
  }

  AddBid() { 
    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "enviando...";

    this.auctionService.PostBid(this.value, this.auctionProduct.id).subscribe(
      result => {
        this.message = "salvo com sucesso!";
        this.router.navigate(['']);
      },
      ex => {
        this.messageCssClass = "form-text text-muted alert alert-danger";
        this.message = ex.error.Error.Message + " | " + ex.message;
      }
    );
  }
}