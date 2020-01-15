import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { environment } from 'environments/environment';

const API = environment.api;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public url: string;
  public form = false;
  public action: string = '';
  public user: User;
  public users: User;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg,.gif",
    maxSize: "50",
    uploadAPI:  {
      url: `${API}/user/upload`
    },
    theme: "attachPin",
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    attachPinText: "Seleccionar imagen"
  };

  constructor(
    private userService: UserService
  ) {
    this.url = environment.api; 
  }

  ngOnInit() {
    this.getUsers();
  }

  viewForm(flag, action) {
    this.form = flag
    this.action = action;

    if (flag && action == 'INS') {
      this.user = new User(0, '', '', '', '');
    }
  }

  getUsers() {
    this.userService.getUsers().subscribe(
      (response: any) => {
        if (response && response.status) {
          this.users = response.data;
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  getUser(id) {
    this.userService.getUsers(id).subscribe(
      (response: any) => {
        if (response && response.status) {
          this.user = response.data;
          this.user.clave_acceso = "";

          this.viewForm(true, 'UPD');
        }
      },
      error => {
        console.log('error: ', error);
      }
    );
  }

  register() {
    this.userService.register(this.user).subscribe(
      (response: any) => {
        console.log('register: ', response);
        if (response && response.status) {
          this.getUsers();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  update() {
    this.userService.update(this.user, this.user.identificador).subscribe(
      (response: any) => {
        console.log('update: ', response);
        if (response && response.status) {
          this.getUsers();
        } else {

        }
      },
      error => {
        console.log('Error: ', error);
      }
    );
  }

  uploadImage(event){
    console.log(event.response);
    let data = JSON.parse(event.response);
    this.user.imagen = data.data;
  }

}
