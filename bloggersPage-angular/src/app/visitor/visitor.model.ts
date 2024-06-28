import {BlogModel} from "../blog/blog.model";

export class VisitorModel {
  id?: number;
  name?: string;
  surname?: string;
  likedBlogs?: BlogModel[];


  constructor(name: string, surname: string, likedBlogs: BlogModel[]) {
    this.name = name;
    this.surname = surname;
    this.likedBlogs = likedBlogs;
  }
}
