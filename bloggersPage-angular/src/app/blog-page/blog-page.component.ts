import { Component, OnInit } from '@angular/core';
import { BlogModel } from '../blog/blog.model';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../blog/blog.service';
import { RatingModel } from './RatingModel';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent implements OnInit {
  blog: BlogModel | undefined;
  averageRating: number = 0;
  numberOfRatings: number = 0;
  visitorRating: RatingModel | undefined;
  userId: number = 1;
  constructor(private route: ActivatedRoute, private blogService: BlogService) {}

  ngOnInit(): void {
    this.getBlog();
  }

  getBlog(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.blogService.get(Number(id)).subscribe(
        blog => {
          this.blog = blog;
          if (this.blog.id !== undefined) {
            this.getRatingStats(this.blog.id);
            this.getVisitorRating(this.blog.id);
          }
        },
        error => {
          console.log('Failed to get blog.', error);
        }
      );
    }
  }

  getRatingStats(blogId: number): void {
    this.blogService.getRatingAverage(blogId).subscribe(
      average => this.averageRating = average,
      error => console.log('Failed to get average rating.', error)
    );
    this.blogService.getNumberOfRatings(blogId).subscribe(
      count => this.numberOfRatings = count,
      error => console.log('Failed to get number of ratings.', error)
    );
  }

  getVisitorRating(blogId: number): void {
    // Implement a method to fetch the visitor's rating for the blog, if it exists.
    // This could be based on a visitor ID or session information.
  }

  rateBlog(star: number): void {
    if (this.blog == null) return;
    const starNumber = Number(star);
    if (this.visitorRating !== undefined) {
      this.updateBlogRating(starNumber);
    } else {
      this.addBlogRating(starNumber);
    }
  }

  private addBlogRating(star: number): void {

    if(star>5 || star<1){
      alert("Rate max value 5")
      return;
    }
    if (this.blog == null || this.blog.id === undefined) return;
    console.log("Rating ..." + this.blog.id)
    const rating = new RatingModel(star, this.blog.id,this.userId);
    this.blogService.addRating(rating).subscribe(
      response => {
        console.log('Blog rated successfully.');
        window.location.reload();
      },
      error => {
        console.error('Failed to rate the blog.');
      }
    );
  }

  updateBlogRating(star: number): void {
    if ( this.blog === undefined ||this.blog.id === undefined) return;
    const starNumber = Number(star);
    const updatedRating = new RatingModel(starNumber, this.blog.id,this.userId);
    this.blogService.updateRating(updatedRating).subscribe(
      response => {
        console.log('Blog rating updated successfully.');
        window.location.reload();
      },
      error => {
        console.error('Failed to update the blog rating.');
      }
    );
  }

  deleteBlogRating(): void {
    if (this.visitorRating == null) return;
    this.blogService.deleteRating(this.visitorRating.id!).subscribe(
      response => {
        console.log('Blog rating deleted successfully.');
        window.location.reload();
      },
      error => {
        console.error('Failed to delete the blog rating.');
      }
    );
  }

  isRatingDisabled(): boolean {
    return this.blog?.visitorRating !== undefined;
  }
}
