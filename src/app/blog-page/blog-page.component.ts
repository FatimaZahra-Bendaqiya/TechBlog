import {Component, OnInit} from '@angular/core';
import {BlogModel} from "../blog/blog.model";
import {ActivatedRoute} from "@angular/router";
import {BlogService} from "../blog/blog.service";

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent implements OnInit{
  blog: BlogModel | undefined;

  constructor(private route: ActivatedRoute, private blogService: BlogService) { }

  ngOnInit(): void {
    this.getBlog();
  }

  getBlog(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.get(Number(id)).subscribe(
        blog => {
          this.blog = blog;
        },
        error => {
          console.log('Failed to get blog.', error);
        }
      );
    }
  }
  rateBlog(star: number): void {
    if(this.blog == null) return;
    if (this.blog.visitorRating !== undefined) {
      // Visitor has already rated, update the rating instead of adding a new one
      this.updateBlogRating(star);
    } else {
      // Visitor is rating for the first time, add a new rating
      this.addBlogRating(star);
    }
  }


  private addBlogRating(star: number): void {
    // Update the blog's rating and number of ratings
    if(this.blog == null) return;
    this.blog.rating = ((this.blog.rating * this.blog.numberOfRatings) + star) / (this.blog.numberOfRatings + 1);
    this.blog.numberOfRatings++;

    // Set the visitor's rating for the blog
    this.blog.visitorRating = star;

    this.blogService.patchBlog(this.blog, this.blog.id).subscribe(
      response => {
        console.log('Blog rated successfully.');
        window.location.reload();
      },
      error => {
        console.error('Failed to rate the blog.');
      }
    );
  }

  private updateBlogRating(star: number): void {
    if(this.blog == null) return;
    if(this.blog.visitorRating === undefined) return;
    this.blog.rating = ((this.blog.rating * this.blog.numberOfRatings) - this.blog.visitorRating + star) / this.blog.numberOfRatings;

    // Set the visitor's updated rating for the blog
    this.blog.visitorRating = star;
    this.blogService.patchBlog(this.blog, this.blog.id).subscribe(
      response => {
        console.log('Blog rated successfully.');
        window.location.reload();
      },
      error => {
        console.error('Failed to rate the blog.');
      }
    );
  }

  isRatingDisabled(): boolean {
    if(this.blog == null) return true;
    return this.blog?.visitorRating !== undefined;
  }
}
