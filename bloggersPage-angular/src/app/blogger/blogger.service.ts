import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {BloggerModel} from "./blogger.model";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BloggerService {
  private bloggersUrl = 'http://localhost:8080/blogger';
  constructor(private http: HttpClient) { }

  getCurrentBlogger(): Observable<BloggerModel> {
    return this.http.get<BloggerModel>(`${this.bloggersUrl}/currentBlogger`);
  }

  getBloggers(): Observable<BloggerModel[]> {
    return this.http.get<BloggerModel[]>(this.bloggersUrl)
      .pipe(
        tap(bloggers => console.log('fetched bloggers')),
        catchError(this.handleError('getBloggers', []))
      );
  }

  getBlogger(id: number): Observable<BloggerModel> {
    const url = `${this.bloggersUrl}/${id}`;
    return this.http.get<BloggerModel>(url).pipe(
      tap(_ => console.log(`fetched blogger id=${id}`)),
      catchError(this.handleError<BloggerModel>(`getBlogger id=${id}`))
    )
  }

  addBlogger(blogger: BloggerModel): Observable<BloggerModel> {
    return this.http.post<BloggerModel>(this.bloggersUrl, blogger, httpOptions).pipe(
      tap((bloggerAdded: BloggerModel) => console.log(`added blogger id=${bloggerAdded.id}`)),
      catchError(this.handleError<BloggerModel>('addBlogger'))
    );
  }

  deleteBlogger(blogger: BloggerModel | number): Observable<BloggerModel> {
    return this.http.delete<BloggerModel>(this.bloggersUrl, httpOptions).pipe(
      tap(_ => console.log(`deleted blogger id=${blogger}`)),
      catchError(this.handleError<BloggerModel>('deleteBlogger'))
    );
  }

  updateBlogger(blogger: BloggerModel, id:number): Observable<BloggerModel> {
    return this.http.put<BloggerModel>(this.bloggersUrl, blogger, httpOptions).pipe(
      tap((bloggerUpdated: BloggerModel) => console.log(`updated blogger id=${bloggerUpdated.id}`)),
      catchError(this.handleError<BloggerModel>('updateBlogger'))
    );
  }

  updateBloggers(bloggers: BloggerModel[]): Observable<BloggerModel[]> {
    return this.http.put<BloggerModel[]>(this.bloggersUrl, bloggers, httpOptions).pipe(
      tap((bloggersUpdated: BloggerModel[]) => console.log(`updated bloggers`)),
      catchError(this.handleError<BloggerModel[]>('updateBloggers'))
    );
  }


  patchBlogger(blogger: BloggerModel, username:string): Observable<BloggerModel> {
    return this.http.patch<BloggerModel>(`${this.bloggersUrl}/${username}`, blogger, httpOptions).pipe(
      tap((bloggerUpdated: BloggerModel) => console.log(`patched blogger -> ${username}`)),
      catchError(this.handleError<BloggerModel>('patchBlogger'))
    );
  }


  putAllBloggers(bloggers: BloggerModel[]): Observable<BloggerModel[]> {
    return this.http.put<BloggerModel[]>(this.bloggersUrl, bloggers, httpOptions).pipe(
      tap((bloggersUpdated: BloggerModel[]) => console.log(`put all bloggers`)),
      catchError(this.handleError<BloggerModel[]>('putAllBloggers'))
    );
  }

  deleteAllBloggers(): Observable<BloggerModel[]> {
    return this.http.delete<BloggerModel[]>(this.bloggersUrl, httpOptions).pipe(
      tap((bloggersUpdated: BloggerModel[]) => console.log(`deleted all bloggers`)),
      catchError(this.handleError<BloggerModel[]>('deleteAllBloggers'))
    );
  }



  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  private log(message: string) {
    console.log('BloggerService: ' + message);
  }


  public totalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);

}
