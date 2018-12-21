import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { AuctionProduct } from 'src/app/models/AuctionProduct';
import { AuctionService } from 'src/app/services/auction.service';
import { Bid } from 'src/app/models/Bid';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  items: AuctionProduct[] = [];
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
    this.SetupNotifications();
    this.GetAuctions();
  }

  SetupNotifications() {
    this.auctionService.OnServerNotification("AuctionProduct_OnStart", (auctionProductJson) => this.AuctionProduct_OnStart(auctionProductJson))
    this.auctionService.OnServerNotification("AuctionProduct_OnBidOffered", (bidJson) => this.AuctionProduct_OnBidOffered(bidJson))
    this.auctionService.OnServerNotification("AuctionProduct_OnTick", (auctionProductJson) => this.AuctionProduct_OnTick(auctionProductJson))
    this.auctionService.OnServerNotification("AuctionProduct_OnEnd", (auctionProductJson) => this.AuctionProduct_OnEnd(auctionProductJson))
  }

  GetAuctions() {
    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "searching for auctions...";

    this.auctionService.Get().subscribe(
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
        this.message = ex.error.Error.Message + " | " + ex.message;
        console.log(ex);
      }
    );
  }

  UpdateConnections() {
    if(this.helper.IsNullOrWhiteSpaceOrEmpty(this.items))
      return;

    this.items.forEach(item => {
      this.auctionService.Join(item.id);
    });
  }

  AuctionProduct_OnStart(auctionProductJson) {
    var auctionProduct = <AuctionProduct> JSON.parse(auctionProductJson);
    var currentItem = this.items.find(e => e.id == auctionProduct.id);

    if(this.helper.IsNullOrWhiteSpaceOrEmpty(currentItem)) {
      this.items.push(auctionProduct);
      this.auctionService.Join(auctionProduct.id);
    }
  }

  AuctionProduct_OnBidOffered(bidJson) {
    var bid = <Bid> JSON.parse(bidJson);
    var index = this.items.findIndex(e => e.id == bid.auctionProduct.id);
    this.items[index].lastValidBid = bid;
  }

  AuctionProduct_OnTick(auctionProductJson) {
    var auctionProduct = <AuctionProduct> JSON.parse(auctionProductJson);
    var index = this.items.findIndex(e => e.id == auctionProduct.id);
    this.items[index].started = auctionProduct.started;
    this.items[index].status = auctionProduct.status;
    this.items[index].leftTimeInMilliseconds = auctionProduct.leftTimeInMilliseconds;
  }

  AuctionProduct_OnEnd(auctionProductJson) {
    var auctionProduct = <AuctionProduct> JSON.parse(auctionProductJson);
    var index = this.items.findIndex(e => e.id == auctionProduct.id);
    this.items[index].ended = auctionProduct.ended;
    this.items[index].status = auctionProduct.status;
    this.items[index].leftTimeInMilliseconds = auctionProduct.leftTimeInMilliseconds;
    this.items[index].lastValidBid = auctionProduct.lastValidBid;
  }
}