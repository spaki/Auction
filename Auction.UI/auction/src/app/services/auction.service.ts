import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs'
import { AuctionProduct } from '../models/AuctionProduct';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BidDto } from '../models/BidDto';
import { UserService } from './user.service';

@Injectable()
export class AuctionService {
  
  private hub: HubConnection;

  constructor(private http: HttpClient, private helper: HelperService, private userService: UserService) { 
    this.hub = new HubConnectionBuilder().withUrl(this.helper.GetBackendConnection() + "NotifyHub").build();
    this.hub.start().catch(error => console.error(error));
  }

  OnServerNotification(methodName: string, newMethod: (...args: any[]) => void)
  {
    this.hub.on(methodName, newMethod);
  }

  Get(): Observable<AuctionProduct[]> {
    let endpoint = this.helper.GetEndpoint('AuctionProduct');
    var result = this.http.get<AuctionProduct[]>(endpoint, { headers: this.helper.GetHeaders() });
    return result;
  }

  Post(entity: AuctionProduct): Observable<any> {
    let endpoint = this.helper.GetEndpoint('AuctionProduct');
    var result = this.http.post(endpoint, entity, { headers: this.helper.GetHeaders() });
    return result;
  }

  PostBid(value: number, auctionProductId: string): Observable<any> {
    let endpoint = this.helper.GetEndpoint('AuctionProduct/' + encodeURIComponent(auctionProductId) + "/Bid");
    var user = this.userService.GetFromStorage();
    var entity = <BidDto> { value: value, userName: user.name };
    var result = this.http.post(endpoint, entity, { headers: this.helper.GetHeaders() });
    return result;
  }
}
