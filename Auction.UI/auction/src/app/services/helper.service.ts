import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable()
export class HelperService {

  constructor(private router: Router) { }

  GetUserStorageKey(): string {
    return "user-info"
  }

  GetBackendConnection(): string {
    if(!window.location.hostname.includes('localhost'))
        return window.location.hostname;
    
    return 'http://localhost:1929/';
  }

  GetEndpoint(endpoint): string {
    return this.GetBackendConnection() + "api/" + endpoint;
  }

  GetQueryString(data:object): string {
    if(this.IsNullOrWhiteSpaceOrEmpty(data))
      return "";

    var result = "?";

    for(var name in data) {
      var value = data[name];

      if(this.IsNullOrWhiteSpaceOrEmpty(value))
        continue;

      result += name + "=" + encodeURIComponent(value.toString()) + "&";
    }

    result = result.substr(0, result.length - 1);

    return result;
  }

  GetHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type','application/json');

    var userStored = localStorage.getItem(this.GetUserStorageKey());

    if(!this.IsNullOrWhiteSpaceOrEmpty(userStored))
    {
      var user: User = JSON.parse(userStored);
      headers = headers.set('User-Id','Bearer ' + user.id);
    }

    return headers;
  }

  IsNullOrWhiteSpaceOrEmpty(value: any): boolean {
    return typeof value === "undefined" || value == null || value == "" || (typeof value === "string" && value.trim() == "") || (Array.isArray(value) && value.length < 1);;
  }
}
