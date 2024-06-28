import {Component, OnInit} from '@angular/core';
import {BlogModel} from "./blog.model";
import {BlogService} from "./blog.service";
import {Genre} from "./genre";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit{
  blog?: BlogModel;
  blogsList?: BlogModel[];
  filteredBlogsList?: BlogModel[];

  genres: Genre[] = Object.values(Genre);
  selectedSortOption?: string;
  selectedGenreFilter?: string;
  selectedBlog: BlogModel | undefined = undefined;
  isPublicValue: boolean = false;

  ngOnInit(): void {
    this.getBloggerBlogs(); // Fetch blogs first
    this.selectedSortOption = 'creationDate';
    this.selectedGenreFilter = '';
  }
  constructor(private BlogService: BlogService) { }

  getBlogs(): void {
    this.BlogService.getBlogs()
      .subscribe(blogs => this.blogsList = blogs);
  }

  getBloggerBlogs(): void {
    this.BlogService.getBloggerBlogs().subscribe(blogs => {
      this.blogsList = blogs; // Set blogsList with fetched data
      this.sortBlogs(); // Sort the blogs
      this.filterBlogs(); // Apply initial filter
    });
  }

  add(title: string, text: string, genre: string): void {
    let creationDate = new Date();
    this.BlogService.addBlog({ title, text, genre, creationDate } as BlogModel).subscribe(
      blog => {
        this.blogsList?.push(blog);
        if (this.blogsList != undefined) {
          this.BlogService.totalItems.next(this.blogsList.length);
          console.log(this.blogsList?.length);
        }
        window.location.reload();
        },
      error => {
        console.error('Error adding blog:', error);
      }
    );
  }

  sortBlogs(): void {
    this.blogsList?.sort((a: BlogModel, b: BlogModel):any => {
      if (this.selectedSortOption === 'creationDate') {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
      } else if (this.selectedSortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if(this.selectedSortOption === 'genre') {
        return a.genre.localeCompare(b.genre);
      }

    });
  }

  filterBlogs(): void {
    if (this.selectedGenreFilter) {
      this.filteredBlogsList = this.blogsList?.filter(blog =>
        blog?.genre?.toLowerCase() === this.selectedGenreFilter?.toLowerCase()
      );
    } else {
      this.filteredBlogsList = this.blogsList; // Reset filter if no genre selected
    }
  }

  selectBlogForUpdate(blog: BlogModel) {
    this.selectedBlog = blog;
  }

  updateBlogPublic(title: string, text: string, genre: string, isPublic: boolean, updatedBlog: BlogModel): void {
    if (updatedBlog) {
      let id: number | undefined = updatedBlog.id;
      title = title.trim();
      text = text.trim();
      genre = genre.trim();
      isPublic = isPublic;
      this.BlogService.patchBlog({ title, text, genre, isPublic } as BlogModel, id).subscribe({
        next: (blog: BlogModel) => {
          const index = this.blogsList?.findIndex((p) => p.id === blog.id);
          if (index !== undefined && index !== -1) {
            this.blogsList?.splice(index, 1, blog);
          }
          this.selectedBlog = undefined;
        },
        error: (error) => {
          console.error('Error updating blog:', error);
        },
      });
    }
  }

  updateBlog(title: string, text: string, genre: string, updatedBlog: BlogModel): void {
    if (updatedBlog) {
      let id: number | undefined = updatedBlog.id;
      title = title.trim();
      text = text.trim();
      genre = genre.trim();
      this.BlogService.patchBlog({ title, text, genre} as BlogModel, id).subscribe({
        next: (blog: BlogModel) => {
          const index = this.blogsList?.findIndex((p) => p.id === blog.id);
          if (index !== undefined && index !== -1) {
            this.blogsList?.splice(index, 1, blog);
          }
          this.selectedBlog = undefined;
        },
        error: (error) => {
          console.error('Error updating blog:', error);
        },
      });
    }
  }

  togglePublicStatus(blog: BlogModel) {
    const updatedIsPublic = !blog.isPublic;
    this.updateBlogPublic(blog.title, blog.text, blog.genre, updatedIsPublic, blog);
  }
}
