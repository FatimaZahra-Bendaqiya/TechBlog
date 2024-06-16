package pl.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.List;

@Entity
    public class Blogger {

        @Id
        @GeneratedValue
        private Long id;

        private String name, secondName, bio, mediaLinks, location, type;
        private int age;
        @OneToMany(mappedBy = "blogger", cascade = CascadeType.ALL)
        @JsonManagedReference
        private List<Blog> blogs;

        @OneToOne
        @JoinColumn(name = "user_id", referencedColumnName = "id")
        @JsonIgnoreProperties("blogger")
        private User user;

    private String username;

    public Blogger() {
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age=age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name=name;
    }

    public String getSecondName() {
        return secondName;
    }

    public void setSecondName(String secondName) {
        this.secondName=secondName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

     public String getMediaLinks() {
        return mediaLinks;
    }

    public void setMediaLinks(String mediaLinks) {
        this.mediaLinks = mediaLinks;
    }

     public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

     public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Blog> getBlogs() {
        return blogs;
    }

    public void setBlogs(List<Blog> blogs) {
        this.blogs = blogs;
    }


    public void addBlog(Blog blog) {
        blogs.add(blog);
        blog.setBlogger(this);
    }

    public void removeBlog(Blog blog) {
        blogs.remove(blog);
        blog.setBlogger(null);
    }
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


}
