import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HelperService } from './helper.service';
import { Observable } from 'rxjs'
import { User } from '../models/User';
import { Router } from '@angular/router';

@Injectable()
export class UserService {
  
  @Output('userAuthChanged') userAuthChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private http: HttpClient, private helper: HelperService, private router: Router) { }

  Login(user: User): Observable<User> {
    let endpoint = this.helper.GetEndpoint('User');
    var result = this.http.post<User>(endpoint, user);
    return result;
  }

  SaveUserInStorage(user: User) {
    localStorage.setItem(this.helper.GetUserStorageKey(), JSON.stringify(user));
    this.Refresh();
  }

  Logout() {
    localStorage.clear();
    this.Refresh();
  }

  GetFromStorage(): User {
    var json = localStorage.getItem(this.helper.GetUserStorageKey());

    if(this.helper.IsNullOrWhiteSpaceOrEmpty(json))
      return null;

    var result: User = JSON.parse(json);
    return result;
  }

  Refresh() {
    this.userAuthChanged.emit(true);
  }

  Guard() {
    if(this.helper.IsNullOrWhiteSpaceOrEmpty(this.GetFromStorage()))
      this.router.navigate(['/login']);
  }
}
