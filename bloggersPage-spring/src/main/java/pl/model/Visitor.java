package pl.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;
import java.util.Map;

@Entity
public class Visitor{
    @Id
    @GeneratedValue
    private long id;

    private String name, surname;

    @ManyToMany
    @JoinTable(
        name = "visitor_liked_blog",
        joinColumns = @JoinColumn(name = "visitor_id"),
        inverseJoinColumns = @JoinColumn(name = "blog_id"))
    @JsonIgnoreProperties("likedVisitors")
    private List<Blog> likedBlogs;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties("visitor")
    private User user;


    public Visitor() {
    }


    public void setId(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }

     public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user=user;
    }

    public List<Blog> getLikedBlogs() {
        return likedBlogs;
    }

    public void setLikedBlogs(List<Blog> likedBlogs) {
        this.likedBlogs=likedBlogs;
    }

    public void addLikedBlog(Blog blog) {
        this.likedBlogs.add(blog);
    }

    public void removeLikedBlog(Blog blog) {
        this.likedBlogs.remove(blog);
    }
}
