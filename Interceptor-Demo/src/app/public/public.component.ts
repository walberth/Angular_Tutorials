import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent implements OnInit {
  private router$: Router;
  private fb$: FormBuilder;
  private auth$: AuthService;
  form: FormGroup;

  constructor(protected router: Router,
              protected fb: FormBuilder,
              protected auth: AuthService) {
    this.router$ = router;
    this.fb$ = fb;
    this.auth$ = auth;
  }

  get formLogin() { return this.form.controls; }

  ngOnInit() {
    this.initialForm();
  }

  initialForm() {
    this.form = this.fb$.group({
      username: ['', Validators.required],
      password: [ '', Validators.required]
    });
  }

  onSubmit(values) {
    debugger;

    if (this.formLogin.username.status === 'INVALID' ||
        this.formLogin.password.status === 'INVALID') {
      return;
    }

    console.log(values);

    this.auth$.login(values.username, values.password)
              .pipe(first())
              .subscribe(response => {
                debugger;
                console.log(response);

                if (response) {
                  localStorage.setItem('token', response);

                  this.router$.navigate(['/protected']);
                }
              });
  }
}
