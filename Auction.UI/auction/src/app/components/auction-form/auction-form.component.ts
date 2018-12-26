import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { AuctionService } from 'src/app/services/auction.service';
import { AuctionProduct } from 'src/app/models/AuctionProduct';
import { Auction } from 'src/app/models/Auction';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.css']
})
export class AuctionFormComponent implements OnInit {
  entity: Auction = <Auction> {};
  message: string = null;
  messageCssClass: string = null;

  constructor(
    private userService: UserService,
    private auctionService: AuctionService,
    private helper: HelperService,
    private router: Router
  ) {
    this.userService.Guard();
  }

  ngOnInit() {
    
  }

  Save() { 
    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "enviando...";

    this.auctionService.Post(this.entity).subscribe(
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