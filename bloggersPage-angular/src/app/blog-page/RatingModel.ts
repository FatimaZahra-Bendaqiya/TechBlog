export class RatingModel {
  id?: number;
  rate: number;
  blogId: number;
  userId: number;

  constructor(rate: number, blogId: number, userId: number, id?: number) {
    this.rate = rate;
    this.blogId = blogId;
    this.userId = userId;
    if (id) this.id = id;
  }
}
