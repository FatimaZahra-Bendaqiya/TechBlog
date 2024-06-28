import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../auth/token-storage.service";
import {BlogService} from "../blog/blog.service";
import {BlogModel} from "../blog/blog.model";
import {BlogComponent} from "../blog/blog.component";
import {Genre} from "../blog/genre";
import {BloggerModel} from "../blogger/blogger.model";
import {BloggerService} from "../blogger/blogger.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  blogList?: BlogModel[];
  filteredBlogsList?: BlogModel[];
  searchText: string = '';
  selectedGenre: string = '';
  genres: Genre[] = Object.values(Genre);
  selectedBlogger: string = '';
  bloggerSearchText: string = '';
  bloggerList?: BloggerModel[];

  info: any;

  constructor(private token: TokenStorageService, private blogService: BlogService, private bloggerService: BloggerService, private router: Router) { }

  ngOnInit() {
    this.getBlogList();
    this.loadBloggerList();
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
    this.filterBlogs();
  }

  goToBlogPage(blog: BlogModel): void {
    this.router.navigate(['/blog-page', blog.id]);
  }

  getBlogList() {
    this.blogService.getBlogs().subscribe(data => {
      this.blogList = data;
      this.filterBlogs();
    });
  }

  loadBloggerList() {
    this.bloggerService.getBloggers().subscribe(data => {
      this.bloggerList = data;
    });
  }

  searchBlogs() {
    if (this.blogList) {
      // Sort blogs by creation date in descending order
      this.blogList.sort((a, b) => {
        const dateA = new Date(a.creationDate).getTime();
        const dateB = new Date(b.creationDate).getTime();
        return dateB - dateA;
      });

      if (this.searchText.trim() === '') {
        // If the search text is empty, display the 10 newest blogs
        this.filteredBlogsList = this.blogList.slice(0, 10);
      } else {
        // Filter blogs based on similarity to the search text
        this.filteredBlogsList = this.blogList.filter(blog => {
          const searchTerm = this.searchText.toLowerCase();
          const blogTitle = blog.title.toLowerCase();
          // Check if the blog title contains the search term
          return blogTitle.includes(searchTerm) || blogTitle.startsWith(searchTerm);
        });
      }
    }
  }

  filterBlogs() {
    this.filteredBlogsList = this.blogList?.filter(blog => {
      const titleMatches = blog.title.toLowerCase().includes(this.searchText.toLowerCase());
      const genreMatches = this.selectedGenre === '' || blog.genre === this.selectedGenre;
      const bloggerMatches = this.selectedBlogger === '' || blog.blogger === this.selectedBlogger;
      return titleMatches && genreMatches && bloggerMatches;
    });
  }

  searchBloggers() {
    if (this.bloggerList) {
      this.bloggerList = this.bloggerList.filter(blogger => {
        const searchTerm = this.bloggerSearchText.toLowerCase();
        const bloggerName = (blogger.name || '').toLowerCase();
        return bloggerName.includes(searchTerm) || bloggerName.startsWith(searchTerm);
      });
    }
  }
}

