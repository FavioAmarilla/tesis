import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

  public user: User
  public errors = [];

  constructor(
    private userService: UserService,
    private router: Router
  ) {
    this.user = new User(null, null, null, null, null);
  }

  ngOnInit() {
  }

  async login() {
    this.errors = [];
    const response: any = await this.userService.login(this.user);
    if (response.success) {
      this.router.navigate(['/dashboard']);
    } else {
      this.errors.push('Credenciales no validas');
    };
  }

}
