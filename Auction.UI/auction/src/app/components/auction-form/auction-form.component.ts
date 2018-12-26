import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { AuctionService } from 'src/app/services/auction.service';
import { AuctionProduct } from 'src/app/models/AuctionProduct';
import { Auction } from 'src/app/models/Auction';
import { ServerInfo } from 'src/app/models/ServerInfo';
import { HomeService } from 'src/app/services/home.service';
import { Product } from 'src/app/models/Product';
import { Picture } from 'src/app/models/Picture';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.css']
})
export class AuctionFormComponent implements OnInit {
  auction: Auction = <Auction> { };
  serverInfo: ServerInfo;

  message: string = null;
  messageCssClass: string = null;

  constructor(
    private userService: UserService,
    private auctionService: AuctionService,
    private helper: HelperService,
    private homeService: HomeService,
    private router: Router
  ) {
    this.userService.Guard();
  }

  ngOnInit() {
    this.GetServerInfo();
  }

  GetServerInfo() {
    this.homeService.GetServerInfo().subscribe(result => {
      this.serverInfo = result;
      this.auction.available = this.helper.AddMinutes(this.serverInfo.currentUTCDateTime, 3);
      this.auction.start = this.helper.AddMinutes(this.serverInfo.currentUTCDateTime, 4);
      this.AddProduct();
    }, 
    ex => {
      console.error(ex);
    });
  }

  Save() { 
    var i = 0;
    this.auction.auctionProducts.forEach(e => e.sequence = i++);

    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "enviando...";

    this.auctionService.Post(this.auction).subscribe(
      result => {
        this.message = "salvo com sucesso!";
        this.router.navigate(['']);
      },
      ex => {
        this.messageCssClass = "form-text text-muted alert alert-danger";
        this.message = this.helper.GetErrorMessage(ex);
      }
    );
  }

  AddProduct() {

    if(this.helper.IsNullOrWhiteSpaceOrEmpty(this.auction.auctionProducts))
      this.auction.auctionProducts = [];

    var auctionProduct = <AuctionProduct> { product: <Product> { pictures: [] } };
    auctionProduct.product.pictures.push(<Picture>{});

    this.auction.auctionProducts.push(auctionProduct);
  }

  RemoveProduct(auctionProduct: AuctionProduct) {
    var index = this.auction.auctionProducts.indexOf(auctionProduct);
    this.auction.auctionProducts.splice(index, 1);
  }
}