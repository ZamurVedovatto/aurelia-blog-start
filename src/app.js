import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { AuthService } from './common/services/auth-service';
import { PostService } from './common/services/post-service';

@inject(EventAggregator, AuthService, PostService)
export class App {

  constructor(EventAggregator, AuthService, PostService) {
    this.ea = EventAggregator;
    this.authService = AuthService;
    this.postService = PostService;
  }

  attached() {
    this.error = '';
    this.currentUser = this.authService.currentUser;
    this.subscription = this.ea.subscribe('user', user => {
      this.currentUser = this.authService.currentUser;
    })
    this.updateSidear();
    this.postSubscription = this.ea.subscribe('post-updated', updatedAt => {
      this.updateSidear();
    })
  }

  updateSidear() {
    this.postService.allTags()
    .then(data => {
      this.tags = data.tags;
    })
    .catch(error => {
      this.error = error.message;
    })

  this.postService.allArchives()
    .then(data => {
      this.archives = data.archives;
    })
    .catch(error => {
      this.error = error;
    })
  }

  configureRouter(config, router) {
    this.router = router;
    config.title = "Zamur\'s";
    config.map([
      { route: '', name: 'home', moduleId: PLATFORM.moduleName('posts/index'), title: 'All posts' },
      { route: 'post/:slug', name: 'post-view', moduleId: PLATFORM.moduleName('posts/view'), title: 'View Post' },
      { route: 'post/create', name: 'post-create', moduleId: PLATFORM.moduleName('posts/create'), title: 'Create a new Post'},
      { route: 'tag/:tag', name: 'tag-view', moduleId: PLATFORM.moduleName('posts/tag-view'), title: 'View Posts by Tag' },
      { route: 'archive/:archive', name: 'archive-view', moduleId: PLATFORM.moduleName('posts/archive-view'), title: 'View Posts by Archive' },
      { route: 'login', name: 'login', moduleId: PLATFORM.moduleName('auth/login'), title: 'Log in' },
      { route: 'sign-up', name: 'sign-up', moduleId: PLATFORM.moduleName('auth/signup'), title: 'Sign up' }
    ])
  }

  logout() {
    this.authService.logout()
      .then(data => {        
        this.ea.publish('user', null);
      })
      .catch(error => {
        console.log(error.message);
      })
  }

  detached() {
    this.subscription.dispose();
    this.postSubscription.dispose();
  }
  
}
