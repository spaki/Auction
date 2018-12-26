import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { AuctionProduct } from 'src/app/models/AuctionProduct';
import { AuctionService } from 'src/app/services/auction.service';
import { Bid } from 'src/app/models/Bid';
import { Auction } from 'src/app/models/Auction';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: Auction[] = [];

  message: string = null;
  messageCssClass: string = null;

  constructor(
    private userService: UserService,
    private auctionService: AuctionService,
    private helper: HelperService
  ) {
    this.userService.Guard();
  }

  ngOnInit() {
    this.auctionService.OnConnected(() => {
      this.SetupNotifications();
      this.GetAuctions();
    });
  }

  SetupNotifications() {
    this.auctionService.OnServerNotification("Auction_OnAvailable", (auctionJson) => this.Auction_OnAvailable(auctionJson))
    this.auctionService.OnServerNotification("Auction_OnStart", (auctionJson) => this.Auction_OnStart(auctionJson))
    this.auctionService.OnServerNotification("Auction_OnEnd", (auctionJson) => this.Auction_OnEnd(auctionJson))

    this.auctionService.OnServerNotification("AuctionProduct_OnStart", (auctionProductJson) => this.AuctionProduct_OnStart(auctionProductJson))
    this.auctionService.OnServerNotification("AuctionProduct_OnBidOffered", (bidJson) => this.AuctionProduct_OnBidOffered(bidJson))
    this.auctionService.OnServerNotification("AuctionProduct_OnTick", (auctionProductJson) => this.AuctionProduct_OnTick(auctionProductJson))
    this.auctionService.OnServerNotification("AuctionProduct_OnEnd", (auctionProductJson) => this.AuctionProduct_OnEnd(auctionProductJson))
  }

  GetAuctions() {
    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "searching for auctions...";

    //this.auctionService.Get().subscribe(
    this.auctionService.GetAvalaibles().subscribe(
      result => {
        this.items = result;
        this.UpdateConnections();

        if(this.helper.IsNullOrWhiteSpaceOrEmpty(this.items)) {
          this.messageCssClass = "form-text text-muted alert alert-warning";
          this.message = "nothing to say.";
        }
        else {
          this.message = null;
        }
      },
      ex => {
        this.messageCssClass = "form-text text-muted alert alert-danger";
        this.message = this.helper.GetErrorMessage(ex);
        console.log(ex);
      }
    );
  }

  UpdateConnections() {
    if(this.helper.IsNullOrWhiteSpaceOrEmpty(this.items))
      return;

    this.items.forEach(autction => {
      autction.auctionProducts.forEach(auctionProduct => {
        this.auctionService.Join(auctionProduct.id);
      });
    });
  }

  Auction_OnAvailable(auctionJson) {
    this.message = null;

    var auction= <Auction> JSON.parse(auctionJson);
    var currentItem = this.items.find(e => e.id == auction.id);

    if(this.helper.IsNullOrWhiteSpaceOrEmpty(currentItem)) {
      this.items.push(auction);

      auction.auctionProducts.forEach(auctionProduct => {
        this.auctionService.Join(auctionProduct.id);
      });
    }
  }

  Auction_OnStart(auctionJson) {
    var auction= <Auction> JSON.parse(auctionJson);
    var index = this.items.findIndex(e => e.id == auction.id);
    this.items[index].status = auction.status;
    this.items[index].ended = auction.ended;
  }

  Auction_OnEnd(auctionJson) {
    var auction= <Auction> JSON.parse(auctionJson);
    var index = this.items.findIndex(e => e.id == auction.id);
    this.items[index].status = auction.status;
    this.items[index].ended = auction.ended;
  }

  AuctionProduct_OnStart(auctionProductJson) {
    var auctionProduct = <AuctionProduct> JSON.parse(auctionProductJson);
    var auctionIndex = this.items.findIndex(e => e.id == auctionProduct.auction.id);
    var auctionProductIndex = this.items[auctionIndex].auctionProducts.findIndex(e => e.id == auctionProduct.id);
    this.items[auctionIndex].auctionProducts[auctionProductIndex].started = auctionProduct.started;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].status = auctionProduct.status;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].leftTimeInMilliseconds = auctionProduct.leftTimeInMilliseconds;
  }

  AuctionProduct_OnBidOffered(bidJson) {
    var bid = <Bid> JSON.parse(bidJson);
    var auctionIndex = this.items.findIndex(e => e.id == bid.auctionProduct.auction.id);
    var auctionProductIndex = this.items[auctionIndex].auctionProducts.findIndex(e => e.id == bid.auctionProduct.id);
    this.items[auctionIndex].auctionProducts[auctionProductIndex].lastValidBid = bid;
  }

  AuctionProduct_OnTick(auctionProductJson) {
    var auctionProduct = <AuctionProduct> JSON.parse(auctionProductJson);
    var auctionIndex = this.items.findIndex(e => e.id == auctionProduct.auction.id);
    var auctionProductIndex = this.items[auctionIndex].auctionProducts.findIndex(e => e.id == auctionProduct.id);
    this.items[auctionIndex].auctionProducts[auctionProductIndex].started = auctionProduct.started;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].status = auctionProduct.status;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].leftTimeInMilliseconds = auctionProduct.leftTimeInMilliseconds;
  }

  AuctionProduct_OnEnd(auctionProductJson) {
    var auctionProduct = <AuctionProduct> JSON.parse(auctionProductJson);
    var auctionIndex = this.items.findIndex(e => e.id == auctionProduct.auction.id);
    var auctionProductIndex = this.items[auctionIndex].auctionProducts.findIndex(e => e.id == auctionProduct.id);
    this.items[auctionIndex].auctionProducts[auctionProductIndex].ended = auctionProduct.ended;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].status = auctionProduct.status;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].leftTimeInMilliseconds = auctionProduct.leftTimeInMilliseconds;
    this.items[auctionIndex].auctionProducts[auctionProductIndex].lastValidBid = auctionProduct.lastValidBid;
  }
}