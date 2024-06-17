package pl.model;

import jakarta.persistence.*;

@Entity
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rate;

    @ManyToOne
    @JoinColumn(name = "blog_id", nullable = false)
    private Blog blog;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    public Rating() {}

    public Rating(int rate, Blog blog, Long userId) {
        this.rate = rate;
        this.blog = blog;
        this.userId = userId;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getRate() {
        return rate;
    }

    public void setRate(int rate) {
        this.rate = rate;
    }

    public Blog getBlog() {
        return blog;
    }

    public void setBlog(Blog blog) {
        this.blog = blog;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
