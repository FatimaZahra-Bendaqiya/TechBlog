package pl.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;


@Entity
public class Blog {
    @Id
    @GeneratedValue
    private long id;
    private String title;
    @Column(columnDefinition = "VARCHAR(10000)")
    private String text;
    private String genre;
    private Date CreationDate;
    @Column(name = "is_public")
    private boolean isPublic;
    private double rating; //rating/numberOfRatings
    private int numberOfRatings;


    @ManyToOne
    @JoinColumn(name = "blogger_id")
    @JsonBackReference
    private Blogger blogger;

    @ManyToMany(mappedBy = "likedBlogs")
    @JsonIgnoreProperties("likedBlogs")
    private List<Visitor> likedVisitors;


    public Blog() {
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text){
        this.text = text;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre){
        this.genre = genre;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating){
        this.rating = rating;
    }

    public int getNumberOfRatings() {
        return numberOfRatings;
    }

    public void setNumberOfRatings(int numberOfRatings){
        this.numberOfRatings = numberOfRatings;
    }

    public Blogger getBlogger() {
        return blogger;
    }

    public void setBlogger(Blogger blogger) {
        this.blogger = blogger;
    }

    public String getBloggerName() {
        return blogger.getName();
    }
    public String getBloggerSecondName() {
        return blogger.getSecondName();
    }

    public Date getCreationDate() {
        return CreationDate;
    }

    public void setCreationDate(Date CreationDate) {
        this.CreationDate = CreationDate;
    }

    public List<Visitor> getLikedVisitors() {
        return likedVisitors;
    }

    public void setLikedVisitors(List<Visitor> likedVisitors) {
        this.likedVisitors = likedVisitors;
    }


    public boolean isPublic() {
        return isPublic;
    }

    public void setIsPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
