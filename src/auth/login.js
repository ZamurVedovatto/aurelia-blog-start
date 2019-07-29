import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from '../common/services/auth-service';
import { Router } from 'aurelia-router';

@inject (EventAggregator, AuthService, Router)
export class Login {
  constructor(EventAggregator,AuthService, Router) {
    this.ea = EventAggregator;
    this.authService = AuthService;
    this.router = Router;
  }

  activate() {
    this.error = null;
  }

  login() {
    this.error = null;
    this.authService.login(this.name)
      .then(data => {
        this.ea.publish('user', data.name);
        this.name = data.user;
        this.router.navigateToRoute('home');
      })
      .catch(error => {
        this.error = error.message;
      })
  }

}
