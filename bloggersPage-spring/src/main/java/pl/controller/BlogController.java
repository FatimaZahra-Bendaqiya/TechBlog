package pl.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.model.Blogger;
import pl.model.User;
import pl.repository.BloggerRepository;
import pl.repository.BlogRepository;
import pl.model.Blog;
import pl.repository.UserRepository;

import java.security.Principal;
import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/blog")
public class BlogController {
    private BlogRepository blogRepository;
    private UserRepository userRepository;
    private BloggerRepository bloggerRepository;

    @Autowired
    public BlogController(BlogRepository blogRepository, UserRepository userRepository, BloggerRepository bloggerRepository) {
        this.blogRepository = blogRepository;
        this.bloggerRepository = bloggerRepository;
        this.userRepository = userRepository;
    }

    @GetMapping(value = "/getBloggerBlogs")
    @PreAuthorize("hasRole('BLOGGER')")
    public List<Blog> findBloggerBlogs(HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Blogger blogger = bloggerRepository.findByUser(user);
        return blogger.getBlogs();
    }

    @GetMapping()
    public List<Blog> findAllBlogs() {
        return blogRepository.findAll();
    }

    @GetMapping(value = "/{id}")
    public Blog findBlog(@PathVariable("id") long id) {
        return blogRepository.findById(id);
    }

    @PostMapping("/addBlog")
    @PreAuthorize("hasRole('BLOGGER')")
    public ResponseEntity<Blog> addBlog(@Valid @RequestBody Blog blog, HttpServletRequest request){
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Blogger blogger = bloggerRepository.findByUser(user);

        blog.setBlogger(blogger);

        //bloggerRepository.save(blogger);
        blogRepository.save(blog);
        return new ResponseEntity<Blog>(blog, HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<Blog> deleteAll() {
        blogRepository.deleteAll();
        return new ResponseEntity<Blog>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Blog> deleteBlog(@PathVariable("id") long id) {
        Blog blog = blogRepository.findById(id);
        if (blog == null) {
            System.out.println("Blog not found");
            return new ResponseEntity<Blog>(HttpStatus.NOT_FOUND);
        }
        blogRepository.deleteById(id);
        return new ResponseEntity<Blog>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Blog> updateBlog(@PathVariable("id") long id, @RequestBody Blog blog) {
        blog.setId(id);
        blogRepository.save(blog);
        return new ResponseEntity<Blog>(blog, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Blog> updateAll(@RequestBody List<Blog> blogs) {
        blogRepository.deleteAll();
        blogRepository.saveAll(blogs);
        return new ResponseEntity<Blog>(HttpStatus.OK);
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<Blog> updateBlogPartially(@PathVariable("id") long id, @RequestBody Blog blog) {

        Blog currentBlog = blogRepository.findById(id);
        if (currentBlog == null) {
            System.out.println("Blog not found");
            return new ResponseEntity<Blog>(HttpStatus.NOT_FOUND);
        }
        if (blog.getTitle() != null && !blog.getTitle().isEmpty()) {
            currentBlog.setTitle(blog.getTitle());
        }
        if (blog.getText() != null && !blog.getText().isEmpty()) {
            currentBlog.setText(blog.getText());
        }
        if (blog.getGenre() != null && !blog.getGenre().isEmpty()) {
            currentBlog.setGenre(blog.getGenre());
        }
        if (blog.getRating() != 0) {
            currentBlog.setRating(blog.getRating());
        }
        if (blog.getNumberOfRatings() != 0) {
            currentBlog.setNumberOfRatings(blog.getNumberOfRatings());
        }
        if (blog.isPublic() != currentBlog.isPublic()) {
            currentBlog.setIsPublic(blog.isPublic());
        }
        blogRepository.save(currentBlog);
        return new ResponseEntity<Blog>(currentBlog, HttpStatus.OK);
    }

}
