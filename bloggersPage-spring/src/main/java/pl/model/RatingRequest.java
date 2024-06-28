package pl.model;

public class RatingRequest {
    private int rate;
    private Long blogId;
    private Long userId;

    public RatingRequest() {}

    public RatingRequest(int rate, Long blogId, Long userId) {
        this.rate = rate;
        this.blogId = blogId;
        this.userId = userId;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public Long getBlogId() {
        return blogId;
    }

    public void setBlogId(Long blogId) {
        this.blogId = blogId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}