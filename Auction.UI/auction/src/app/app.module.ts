import { routes } from './app.routes';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AuctionFormComponent } from './components/auction-form/auction-form.component';
import { AuctionCardComponent } from './components/auction-card/auction-card.component';
import { AuctionProductCardComponent } from './components/auction-product-card/auction-product-card.component';

import { HelperService } from './services/helper.service';
import { AuctionService } from './services/auction.service';
import { AuctionProductService } from './services/auction-product.service';
import { UserService } from './services/user.service';
import { HomeService } from './services/home.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AuctionFormComponent,
    AuctionCardComponent,
    AuctionProductCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    HelperService,
    AuctionService,
    AuctionProductService,
    UserService,
    HomeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
