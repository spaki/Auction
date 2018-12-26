import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class HelperService {

  constructor() { }

  GetUserStorageKey(): string {
    return "user-info"
  }

  GetBackendConnection(): string {
    if(!window.location.hostname.includes('localhost'))
        return "https://spakiauction.azurewebsites.net/";
    
    return 'https://localhost:44347/';
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

  GetErrorMessage(ex) {
    if(this.IsNullOrWhiteSpaceOrEmpty(ex))
      return "";
    
    var result = "";

    if(ex.error && ex.error.error && ex.error.error.message && !this.IsNullOrWhiteSpaceOrEmpty(ex.error.error.message))
      result += ex.error.error.message.toString();

    if(!this.IsNullOrWhiteSpaceOrEmpty(result))
      result += " | ";

    if(ex.message && !this.IsNullOrWhiteSpaceOrEmpty(ex.message))
      result += ex.message;

    if(!this.IsNullOrWhiteSpaceOrEmpty(result))
      result += " | ";

    if(ex.statusText && !this.IsNullOrWhiteSpaceOrEmpty(ex.statusText))
      result += ex.statusText.toString();

    return result;
  }

  AddMinutes(date: Date , minutes: number): any {
    var result = new Date(new Date(date).getTime() + minutes*60000).toJSON();
    return result;
  }
}
