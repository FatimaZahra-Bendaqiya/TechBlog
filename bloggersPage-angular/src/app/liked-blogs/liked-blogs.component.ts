import {Component, OnInit} from '@angular/core';
import {BlogModel} from "../blog/blog.model";
import {VisitorService} from "../visitor/visitor.service";

@Component({
  selector: 'app-liked-blogs',
  templateUrl: './liked-blogs.component.html',
  styleUrls: ['./liked-blogs.component.css']
})
export class LikedBlogsComponent implements OnInit{
  likedBlogs: BlogModel[] = [];

  constructor(private visitorService: VisitorService) {}

  ngOnInit(): void {
    this.getLikedBlogs();
  }

  getLikedBlogs(): void {
    this.visitorService.getLikedBlogs().subscribe(
      response => {
        this.likedBlogs = response;
      } ,
        error => { console.log('Failed to get liked blogs.');
      }
    );
  }

  unlikeBlog(blogId: number | undefined): void {
    if(blogId == null) return;
    this.visitorService.unlikeBlog(blogId).subscribe(
      response => {
        console.log('Blog unliked successfully.');
        // Remove the blog from the likedBlogs array
        this.likedBlogs = this.likedBlogs.filter(blog => blog.id !== blogId);
        window.location.reload();
      },
      error => {
        console.error('Failed to unlike the blog.');
      }
    );
  }
}
