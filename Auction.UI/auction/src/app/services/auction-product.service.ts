import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs'
import { BidDto } from '../models/BidDto';
import { UserService } from './user.service';

@Injectable()
export class AuctionProductService {
  constructor(private http: HttpClient, private helper: HelperService, private userService: UserService) { 
  }

  PostBid(value: number, auctionProductId: string): Observable<any> {
    let endpoint = this.helper.GetEndpoint('AuctionProduct/' + encodeURIComponent(auctionProductId) + "/Bid");
    var user = this.userService.GetFromStorage();
    var entity = <BidDto> { value: value, userName: user.name };
    var result = this.http.post(endpoint, entity, { headers: this.helper.GetHeaders() });
    return result;
  }
}
