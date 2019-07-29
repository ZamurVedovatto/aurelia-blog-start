import { inject } from 'aurelia-framework';
import { AuthService } from '../common/services/auth-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(EventAggregator, AuthService, Router)
export class Signup {
  constructor(EventAggregator, AuthService, Router) {
    this.authService = AuthService;
    this.router = Router;
    this.ea = EventAggregator;
    this.error = '';
  }

  signup() {
    this.error = '';
    this.authService.signup(this.name)
      .then(data => {
        this.ea.publish('user', data.name);
        this.router.navigateToRoute('home');
      })
      .catch(error => {
        console.log(error);
        this.error = error;
      })
  }
}
