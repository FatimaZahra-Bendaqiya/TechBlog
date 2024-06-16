import {Component, Input, OnInit} from '@angular/core';
import {BlogModel} from "../blog/blog.model";
import {TokenStorageService} from "../auth/token-storage.service";
import {VisitorModel} from "../visitor/visitor.model";
import {VisitorService} from "../visitor/visitor.service";

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.css']
})
export class BlogPostComponent implements OnInit{
  @Input() blog?: BlogModel;
  @Input() likedBlogs: BlogModel[] = [];
  authority?: string;
  private roles?: string[];

  constructor(private tokenStorage: TokenStorageService, private visitorService: VisitorService) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      console.log(this.tokenStorage.getToken());
      this.roles = this.tokenStorage.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        if(role === 'ROLE_BLOGGER'){
          this.authority = 'blogger';
          return false;
        }
        if(role === 'ROLE_VISITOR'){
          this.authority = 'visitor';
          return false;
        }
        return true;
      });
      this.getLikedBlogs();
    }
  }

  likeBlog(id: number | undefined): void {
    if (id != null) {
      this.visitorService.likeBlog(id).subscribe(
        response => {
          console.log('Blog liked successfully.');

          window.location.reload()
        },
        error => {
          console.error('Failed to like the blog.');
        }
      );
    }
  }

  getLikedBlogs(): void {
    this.visitorService.getLikedBlogs().subscribe(
      response => {
        this.likedBlogs = response;
      },
      error => {
        console.log('Failed to get liked blogs.');
      }
    );
  }

  isBlogLiked(id: number | undefined): boolean {
    if (id != null) {
      return this.likedBlogs?.some(blog => blog.id === id) ?? false;
    }
    return false;
  }
}
