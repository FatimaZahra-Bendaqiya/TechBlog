import { Injectable } from '@angular/core';
import {BlogModel} from "./blog.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap} from "rxjs";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})

export class BlogService {
  private blogUrl = 'http://localhost:8080/blog';
  constructor(private http: HttpClient) { }

  getBlogs(): Observable<BlogModel[]> {
    return this.http.get<BlogModel[]>(this.blogUrl);
  }

  get(id: number): Observable<BlogModel> {
        return this.http.get<BlogModel>(`${this.blogUrl}/${id}`);
  }

  getBloggerBlogs(): Observable<BlogModel[]> {
    return this.http.get<BlogModel[]>(`${this.blogUrl}/getBloggerBlogs`).pipe(
      catchError((error) => {
        console.error('Error getting blogger blogs:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }

  addBlog(blog: BlogModel): Observable<BlogModel> {
    return this.http.post<BlogModel>(`${this.blogUrl}/addBlog`, blog, httpOptions).pipe(
      catchError((error) => {
        console.error('Error adding blog:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }

  patchBlog(blog: BlogModel, id: number | undefined): Observable<BlogModel> {
    console.log(blog);
    return this.http.patch<BlogModel>(`${this.blogUrl}/${id}`, blog, httpOptions).pipe(
      tap((blogPatched: BlogModel) => console.log(`patched blog id=${blogPatched.id}`)),
      catchError((error) => {
        console.error('Error patching blog:', error);
        throw error; // Rethrow the error to propagate it to the caller
      })
    );
  }

  totalItems = new BehaviorSubject<number>(0);
}
