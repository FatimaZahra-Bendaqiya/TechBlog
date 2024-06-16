import { BlogModel } from "../blog/blog.model";

export class BloggerModel {
  id?: number;
  name?: string;
  secondName?: string;
  bio?: string;
  mediaLinks?: string;
  location?: string;
  type?: string;
  age?: number;
  blogs?: BlogModel[];

  constructor(name: string, secondName: string, bio: string, mediaLinks: string, location: string, type: string, age: number, blogs: BlogModel[]) {
    this.name = name;
    this.secondName = secondName;
    this.bio = bio;
    this.mediaLinks = mediaLinks;
    this.location = location;
    this.type = type;
    this.age = age;
    this.blogs = blogs;
  }
}
