import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private router: Router) { }

  /**
   * Grant the user access if logged in else redirect to login
   */
  canActivate(): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }

  isLoggedIn() {
    if (localStorage.getItem('toekn') != null) {
      return true;
    } else {
      return false;
    }
  }
}
