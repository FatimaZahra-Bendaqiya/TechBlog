import { BloggerModel } from "../blogger/blogger.model";
import { VisitorModel } from "../visitor/visitor.model";

export class BlogModel {
  id?: number;
  title: string;
  text: string;
  genre: string;
  creationDate: Date;
  rating: number;
  numberOfRatings: number;
  blogger: BloggerModel;
  bloggerName?: string;
  bloggerSecondName?: string;
  visitors: VisitorModel[];
  isPublic: boolean;
  visitorRating?: number; // Add this line

  constructor(
    title: string,
    text: string,
    genre: string,
    creationDate: Date,
    rating: number,
    numberOfRatings: number,
    blogger: BloggerModel,
    visitors: VisitorModel[],
    bloggerName?: string,
    bloggerSecondName?: string,
    isPublic: boolean = false, // Ensure isPublic is a boolean
    visitorRating?: number // Add this parameter
  ) {
    this.title = title;
    this.text = text;
    this.genre = genre;
    this.creationDate = creationDate;
    this.rating = rating;
    this.numberOfRatings = numberOfRatings;
    this.blogger = blogger;
    this.bloggerName = bloggerName;
    this.bloggerSecondName = bloggerSecondName;
    this.visitors = visitors;
    this.isPublic = isPublic; // Ensure isPublic is a boolean
    this.visitorRating = visitorRating; // Add this line
  }
}
