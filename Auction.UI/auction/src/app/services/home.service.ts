import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs'
import { ServerInfo } from '../models/ServerInfo';

@Injectable()
export class HomeService {
  constructor(private http: HttpClient, private helper: HelperService) { 
  }

  GetServerInfo(): Observable<ServerInfo> {
    let endpoint = this.helper.GetEndpoint('Home');
    var result = this.http.get<ServerInfo>(endpoint, { headers: this.helper.GetHeaders() });
    return result;
  }
}
