import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import { ApiService } from '../../api.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { Iuser } from '../../Interface/user.interface';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatCardModule,MatSnackBarModule,MatProgressSpinnerModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  isLoggingin: boolean = false;
  isRecoveringPassword: boolean = false;
  IsLogin : boolean = true;
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private api: ApiService, private snackbar : MatSnackBar, private route : Router) {}

  submit() {
    this.isLoggingin = true;
    if (this.form.valid) {
      

      const fetchedUser: any = localStorage.getItem('user');
      if(fetchedUser) {
        const usersArray = JSON.parse(fetchedUser);
           // Find the user by email
        const user = usersArray.find((user: any) => user.userEmailId === this.form.value.username);
      if(user && user.password === this.form.value.password) {
        this.isLoggingin = false;
        localStorage.setItem('loggedinuser', JSON.stringify(user));
        this.route.navigateByUrl('/dashboard');
        console.log(JSON.parse(fetchedUser))
        this.snackbar.open('Welcome Back', 'ok', {
          duration: 5000,
        });
      
      } else {
        this.isLoggingin = false;
        this.snackbar.open('Invalid credentials', 'ok', {
          duration: 5000,
        });
      }
      }
      // this.api.signin({
      //   email: this.form.value.username,
      //   password:  this.form.value.password,
      // }).subscribe(()=> {
      //   this.isLoggingin = false;
      //   this.route.navigateByUrl('/dashboard');
      // }, (err:any)=> {
      //   console.log(err.message);
      //   this.isLoggingin = false;
      //   this.snackbar.open(err.message, 'ok', {
      //     duration: 5000,
      //   });
      // })
    }
  }


  register() {
    this.isLoggingin = true;
    console.log(this.form.value)
    if(this.form.valid) {
      let user:any[] = []
      user = JSON.parse(localStorage.getItem('user') as any) || []
      console.log('valid', this.form.value)

      const data = {
        "userName": this.form.value.name,
        "userEmailId": this.form.value.username,
        "groupsInvolved": [],
        "password": this.form.value.password
      }

      
      user.push(data)
      this.isLoggingin = false;
      this.changeForm(true)

      localStorage.setItem('user', JSON.stringify(user))
      this.form.reset()
    }

  }

  changeForm(val:boolean) {
    this.IsLogin = val;
    if(val) {
      this.form.removeControl('name');
      console.log('login', this.form.value)
    } else {
      
      this.form.addControl('name', new FormControl('', Validators.required))
      
      
      console.log('register', this.form.value)
    }
   
  }



  // recoverPassword() {
  //   this.isRecoveringPassword = true;
  //   console.log(this.form.value.username)
  //   this.api.recoverPassword(this.form.value.username).subscribe(()=> {
  //     this.isRecoveringPassword = false;
  //     this.snackbar.open('You can recover your password in your email account.', 'ok', {
  //       duration: 5000,
  //     });
  //   }, (err:any)=> {
  //     this.isRecoveringPassword = false;
  //     console.log(err);
  //     this.snackbar.open(err.message, 'ok', {
  //       duration: 5000,
  //     });
  //   })

  // }


 
}
