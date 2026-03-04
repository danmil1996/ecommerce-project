import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {

  isAuthenticated: boolean = false;
  userEmail: string | undefined;
  storage: Storage = sessionStorage;

  constructor(private auth: AuthService, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    // Track login status
    this.auth.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
    });

    // Track user profile
    this.auth.user$.subscribe(user => {
      this.userEmail = user?.email;
      if (this.userEmail) {
        this.storage.setItem('userEmail', JSON.stringify(this.userEmail));
      }
    });
  }

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ returnTo: this.doc.location.origin });
  }

}