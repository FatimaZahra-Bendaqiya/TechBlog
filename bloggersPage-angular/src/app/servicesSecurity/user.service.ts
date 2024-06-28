import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {BloggerModel} from "../blogger/blogger.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private bloggerUrl = 'http://localhost:8080/blogger';
  private visitorUrl = 'http://localhost:8080/visitor';
  private adminUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) { }

  getBloggerPage(): Observable<any>{
    return this.http.get(this.bloggerUrl, { responseType: 'text' });
  }

  getVisitorPage(): Observable<any>{
    return this.http.get(this.visitorUrl, { responseType: 'text' });
  }

  getAdminPage(): Observable<any>{
    return this.http.get(this.adminUrl, { responseType: 'text' });
  }

  getLoggedInBloggerId(): Observable<number> {
    return this.http.get<any>('http://localhost:8080/blogger/id')
      .pipe(
        map(response => response.id)
      );
  }

  getLoggedInBlogger(): Observable<BloggerModel> {
    return this.http.get<BloggerModel>('http://localhost:8080/blogger');
  }
}
