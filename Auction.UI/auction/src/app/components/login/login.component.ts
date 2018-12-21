import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = <User> {};
  message: string = null;
  messageCssClass: string = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    
  }

  Save() {
    this.messageCssClass = "form-text text-muted alert alert-success";
    this.message = "enviando...";
    this.userService.Login(this.user).subscribe(
      result => {
        this.message = "só mais um pouquinho...";
        this.userService.SaveUserInStorage(result);
        this.router.navigate(['']);
      },
      ex => {
        this.messageCssClass = "form-text text-muted alert alert-danger";
        this.message = ex.error.Error.Message + " | " + ex.message;
        console.log(ex);
      }
    );;
  }
}