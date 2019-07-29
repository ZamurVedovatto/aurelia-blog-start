import { inject } from 'aurelia-framework';
import { PostService } from '../common/services/post-service';
import { Router } from 'aurelia-router';
import { EventAggregator } from 'aurelia-event-aggregator';


@inject(Router, PostService, EventAggregator)
export class Create {
  constructor(Router, PostService, EventAggregator) {
    this.router = Router;
    this.postService = PostService;
    this.ea = EventAggregator;
  }

  attached() {
    this.post = {
      title: '',
      body: '',
      tags: []
    }
    this.postService.allTags()
      .then(data => {
        this.allTags = data.tags;
      })
      .catch(error => {
        this.error = error.message;
      })
  }

  addTag() {
    if (this.newTag !== "") {
      this.allTags.push(this.newTag);
      this.post.tags.push(this.newTag);
      this.newTag = "";
    }
  }

  createPost() {
    this.postService.create(this.post)
      .then(data => {
        this.ea.publish('post-updated', Date());
        this.router.navigateToRoute('post-view', { slug: data.slug })
      })
      .catch(error => {
        console.log(error);
      })
  }
}
