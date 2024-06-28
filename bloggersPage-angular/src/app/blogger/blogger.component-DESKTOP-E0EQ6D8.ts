import {Component, OnInit} from '@angular/core';
import {BloggerService} from "./blogger.service";
import {BloggerModel} from "./blogger.model";
import {BlogModel} from "../blog/blog.model";
import {UserService} from "../servicesSecurity/user.service";
import {Observable} from "rxjs";
import {TokenStorageService} from "../auth/token-storage.service";

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit{
  blogger?: BloggerModel;
  bloggerList?: BloggerModel[];

  blogList?: BlogModel[];
  info: any;

  ngOnInit(): void {
    this.getBloggers();
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
  }

  constructor(
    private BloggerService: BloggerService,
    private userService: UserService,
    private token: TokenStorageService
) { }

  getBloggers(): void {
    this.BloggerService.getBloggers()
      .subscribe(bloggerList => this.bloggerList = bloggerList);
  }

  add(name: string, secondName: string, bio: string, mediaLinks: string, location: string, type: string, age: number ): void {
    name = name.trim();
    secondName = secondName.trim();
    bio = bio.trim();
    mediaLinks = mediaLinks.trim();
    location = location.trim();
    type = type.trim();
    this.BloggerService.addBlogger({name, secondName, bio, mediaLinks, location, type, age} as BloggerModel)
      .subscribe(blogger => {
        this.bloggerList?.push(blogger);
        // for automatic update of number of students in parent component
        if (this.bloggerList != undefined) {
          this.BloggerService.totalItems.next(this.bloggerList.length);
          console.log(this.bloggerList.length);
        }
      });
  }

  delete(blogger: BloggerModel): void {
    this.bloggerList = this.bloggerList?.filter(c => c !== blogger);
    this.BloggerService.deleteBlogger(blogger).subscribe(() => {
        // for automatic update of number of students in parent component
        if (this.bloggerList != undefined) {
          this.BloggerService.totalItems.next(this.bloggerList.length);
          console.log(this.bloggerList.length);
        }
      }
    );
  }

  deleteAll(): void {
    this.BloggerService.deleteAllBloggers().subscribe(() => {
        // for automatic update of number of students in parent component
        if (this.bloggerList != undefined) {
          this.BloggerService.totalItems.next(this.bloggerList.length);
          console.log(this.bloggerList.length);
        }
      }
    );
  }

  update(name: string, secondName: string, bio: string, mediaLinks: string, location: string, type: string, age: number, chosenToUpdateBlogger: BloggerModel): void {
    let id = chosenToUpdateBlogger.id;
    name = name.trim();
    secondName = secondName.trim();
    bio = bio.trim();
    mediaLinks = mediaLinks.trim();
    location = location.trim();

    console.log(id);
    if (id != undefined) {
      this.BloggerService.updateBlogger({
        name,
        secondName,
        bio,
        mediaLinks,
        location,
        type,
        age,
      } as BloggerModel, id)
        .subscribe({
          next: (blogger: BloggerModel) => {
            if (this.bloggerList != undefined) {
              let index = this.bloggerList?.indexOf(chosenToUpdateBlogger);
              this.bloggerList[index] = blogger;
            }
          },
          error: () => {
          },
          complete: () => {
            if (this.bloggerList != undefined) {
              this.BloggerService.totalItems.next(this.bloggerList.length);
              console.log(this.bloggerList.length);
            }
          }
        });
    }
  }

  patch(
    name: string,
    secondName: string,
    bio: string,
    mediaLinks: string,
    location: string,
    type: string,
    age: number,
    username: string
  ): void {
    name = name.trim();
    secondName = secondName.trim();
    bio = bio.trim();
    mediaLinks = mediaLinks.trim();
    location = location.trim();
    console.log(username);
    if (username != undefined) {
      this.BloggerService.patchBlogger({
        name,
        secondName,
        bio,
        mediaLinks,
        location,
        type,
        age,
      } as BloggerModel, username).subscribe({
        next: (blogger: BloggerModel) => {
          if (this.bloggerList !== undefined) {
            const index = this.bloggerList.findIndex(a => a.id === blogger.id);
            if (index !== -1) {
              this.bloggerList[index] = blogger;
            }
          }
        },
        error: () => {},
        complete: () => {
          if (this.bloggerList !== undefined) {
            this.BloggerService.totalItems.next(this.bloggerList.length);
            console.log(this.bloggerList.length);
          }
        },
      });
    }
  }


}
