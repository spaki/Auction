import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs'
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@aspnet/signalr';
import { UserService } from './user.service';
import { Auction } from '../models/Auction';

@Injectable()
export class AuctionService {
  
  private reconnectionInterval: number = 10000;
  private hub: HubConnection;
  private connectedCallback: any;

  constructor(private http: HttpClient, private helper: HelperService, private userService: UserService) { 
    this.hub = new HubConnectionBuilder().withUrl(this.helper.GetBackendConnection() + "NotifyHub").build();
    this.hub.onclose(() => { this.Reconnect(); }); 
    
    this.hub.start().then(() => {
      if(this.hub.state == HubConnectionState.Connected)
        this.connectedCallback();
    }).catch(error => {
      console.error(error);
    });
  }

  OnServerNotification(methodName: string, newMethod: (...args: any[]) => void)
  {
    this.hub.on(methodName, newMethod);
  }

  OnConnected(callback: any)
  {
    this.connectedCallback = callback;
    
    if(this.hub.state == HubConnectionState.Connected)
      this.connectedCallback();
  }

  Get(): Observable<Auction[]> {
    let endpoint = this.helper.GetEndpoint('Auction');
    var result = this.http.get<Auction[]>(endpoint, { headers: this.helper.GetHeaders() });
    return result;
  }

  GetAvalaibles(): Observable<Auction[]> {
    let endpoint = this.helper.GetEndpoint('Auction/availables');
    var result = this.http.get<Auction[]>(endpoint, { headers: this.helper.GetHeaders() });
    return result;
  }

  Post(entity: Auction): Observable<any> {
    let endpoint = this.helper.GetEndpoint('Auction');
    var result = this.http.post(endpoint, entity, { headers: this.helper.GetHeaders() });
    return result;
  }

  Join(auctionProductId: string) {
    this.hub.invoke("JoinGroup", auctionProductId)
  }

  private Reconnect(){
    setTimeout(function(){
      this.hub.start().done(() => {
      })
      .fail((error: any) => {
          this.Reconnect();
      });
    }, this.reconnectionInterval);
  }
}
