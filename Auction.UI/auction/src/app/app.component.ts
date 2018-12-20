import { Component } from '@angular/core';
import { User } from './models/User';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentDate = Date.now();
  user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.userAuthChanged.subscribe(event => this.Refresh());
    this.Refresh();
  }

  Refresh() {
    this.user = this.userService.GetFromStorage();
  }

  GetCurrentUserFromStorage() {
    var result = this.userService.GetFromStorage();
    this.user = result;
    return result;
  }

  Logout() {
    this.userService.Logout();
    this.Refresh();
    this.userService.Guard();
  }
}
