import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      console.log(`Using email ${localStorage.getItem('email')}`);
      this.router.navigate(['calculator']);
    }

    this.loginForm = this.fb.group({
      emailCtrl: ['', Validators.email],
    });
  }

  login() {
    localStorage.setItem('email', this.loginForm.get('emailCtrl')!.value);

    this.router.navigate(['calculator']);
  }
}
