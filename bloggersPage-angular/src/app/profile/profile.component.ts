import {Component, OnInit} from '@angular/core';
import {BloggerModel} from "../blogger/blogger.model";
import {BlogModel} from "../blog/blog.model";
import {UserService} from "../servicesSecurity/user.service";
import {TokenStorageService} from "../auth/token-storage.service";
import {BloggerService} from "../blogger/blogger.service";
import {VisitorModel} from "../visitor/visitor.model";
import {VisitorService} from "../visitor/visitor.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  blogger?: BloggerModel;
  bloggerList?: BloggerModel[];
  visitor?: VisitorModel;
  visitorList?: VisitorModel[];

  info: any;
  showUpdateForm = false;

  private roles?: string[];
  authority?: string;

  ngOnInit(): void {
    this.findBlogger();
    this.findVisitor();
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
    if (this.token.getToken()) {
      console.log(this.token.getToken());
      this.roles = this.token.getAuthorities();
      this.roles.every(role => {
        if (role === 'ROLE_ADMIN') {
          this.authority = 'admin';
          return false;
        }
        if(role === 'ROLE_BLOGGER'){
          this.authority = 'blogger';
          return false;
        }
        this.authority = 'visitor';
        return true;
      });
    }
  }
  constructor(
    private BloggerService: BloggerService,
    private userService: UserService,
    private token: TokenStorageService,
    private VisitorService: VisitorService
  ) { }

  findBlogger(): void {
    this.BloggerService.getCurrentBlogger().subscribe(
      (result: BloggerModel) => {
        this.blogger = result;
      },
      (error) => {
        console.error('Error retrieving blogger:', error);
      }
    );
  }

  findVisitor(): void {
    this.VisitorService.getCurrentVisitor().subscribe(
      (result: VisitorModel) => {
        this.visitor = result;
      },
      (error) => {
        console.error('Error retrieving visitor:', error);
      }
      );
  }

  updateProfileDetails(): void {
    // Perform any necessary actions before showing the update form

    // Set the flag to true to show the update form
    this.showUpdateForm = true;
  }

  patchBlogger(
    name: string,
    secondName: string,
    bio: string,
    mediaLinks: string,
    location: string,
    type: string,
    age: number,
    username: string
  ): void {
    const updatedBlogger: BloggerModel = {
      name: name.trim() || undefined,
      secondName: secondName.trim() || undefined,
      bio: bio.trim() || undefined,
      mediaLinks: mediaLinks.trim() || undefined,
      location: location.trim() || undefined,
      type: type.trim() || undefined,
      age: age || undefined,
    };

    console.log(username);
    if (username != undefined) {
      this.BloggerService.patchBlogger(updatedBlogger, username).subscribe({
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
          window.location.reload(); // Reload the page
          this.showUpdateForm = false;
        },
      });
    }
  }

  patchVisitor(name: String, surname: String){
    const updatedVisitor: VisitorModel = {
      name: name.trim() || undefined,
      surname: surname.trim() || undefined,
    };

    this.VisitorService.patchVisitor(updatedVisitor).subscribe({
      next: (visitor: VisitorModel) => {
        if (this.visitorList !== undefined) {
          const index = this.visitorList.findIndex(a => a.id === visitor.id);
          if (index !== -1) {
            this.visitorList[index] = visitor;
          }
        }
      },
      error: () => {},
      complete: () => {
        if (this.visitorList !== undefined) {
          this.VisitorService.totalItems.next(this.visitorList.length);
          console.log(this.visitorList.length);
        }
        window.location.reload(); // Reload the page
        this.showUpdateForm = false;
      },
    });
  }


}
