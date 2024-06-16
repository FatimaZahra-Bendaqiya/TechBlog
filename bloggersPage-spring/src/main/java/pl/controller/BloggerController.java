package pl.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.model.Blog;
import pl.model.User;
import pl.repository.BloggerRepository;
import pl.model.Blogger;
import pl.repository.BlogRepository;
import pl.repository.UserRepository;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/blogger")
public class BloggerController {
    private BloggerRepository bloggerRepository;
    private BlogRepository blogRepository;
    private UserRepository userRepository;

    @Autowired
    public BloggerController(BloggerRepository bloggerRepository, BlogRepository blogRepository, UserRepository userRepository){
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
        this.bloggerRepository = bloggerRepository;
    }

    @GetMapping
    public List<Blogger> findAllBloggers() {
        return bloggerRepository.findAll();
    }

    @GetMapping("/currentBlogger")
    @PreAuthorize("hasRole('BLOGGER')")
    public Blogger findBlogger(HttpServletRequest request){
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        return bloggerRepository.findByUser(user);
    }

    @GetMapping(value = "/{id}/blogs")
    public List<Blog> findBlogs(@PathVariable("id") long id) {
        return bloggerRepository.findById(id).getBlogs();
    }



    @GetMapping(value = "/{id}/blogs/{blogId}")
    public Blog findBlog(@PathVariable("id") long id, @PathVariable("blogId") long blogId) {
        return blogRepository.findById(blogId);
    }

    @PostMapping
    public Blogger addBlogger(@RequestBody Blogger blogger) {
        bloggerRepository.save(blogger);
        return blogger;
    }

    @PostMapping(value = "/{id}/blogs")
    public ResponseEntity<Blog> addBlog(@PathVariable("id") long id, @RequestBody Blog blog) {
        Blogger blogger = bloggerRepository.findById(id);

        if (blogger == null) {
            System.out.println("Blogger not found");
            return new ResponseEntity<Blog>(HttpStatus.NOT_FOUND);
        }
        blogRepository.save(blog);
        blogger.addBlog(blog);
        bloggerRepository.save(blogger);
        return new ResponseEntity<Blog>(blog, HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity deleteAll() {
        bloggerRepository.deleteAll();
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity deleteBlogger(@PathVariable("id") long id) {
        Blogger blogger = bloggerRepository.findById(id);
        if (blogger == null) {
            System.out.println("Blogger not found");
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
        bloggerRepository.deleteById(id);
        return new ResponseEntity(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping(value = "/{id}/blogs/{blogId}")
    public ResponseEntity<Void> deleteBlog(@PathVariable("id") long id, @PathVariable("blogId") long blogId) {
        Blogger blogger = bloggerRepository.findById(id);
        Blog blog = blogRepository.findById(blogId);
        if (blogger == null) {
            System.out.println("Blogger not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        if (blog == null) {
            System.out.println("Blog not found");
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        blogger.removeBlog(blog);
        blogRepository.delete(blog);
        bloggerRepository.save(blogger);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Blogger> updateBlogger(@PathVariable("id") long id, @RequestBody Blogger blogger) {
        blogger.setId(id);
        bloggerRepository.save(blogger);
        return new ResponseEntity<Blogger>(blogger, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Blogger> updateAll(@RequestBody List<Blogger> bloggers) {
        bloggerRepository.deleteAll();
        bloggerRepository.saveAll(bloggers);
        return new ResponseEntity<Blogger>(HttpStatus.OK);
    }

    @PatchMapping(value = "/{username}")
    @PreAuthorize("hasRole('BLOGGER')")
    public ResponseEntity<Blogger> updateLoggedBlogger(@RequestBody Blogger updatedBlogger, @PathVariable("username") String username) {
        User currentuser = userRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("Error: User not found.")
        );
        Blogger currentblogger = currentuser.getBlogger();

        if (currentblogger == null) {
            System.out.println("Blogger not found");
            return ResponseEntity.notFound().build();
        }

        if (updatedBlogger.getAge() != 0) {
            currentblogger.setAge(updatedBlogger.getAge());
        }
        if (updatedBlogger.getName() != null) {
            currentblogger.setName(updatedBlogger.getName());
        }
        if (updatedBlogger.getSecondName() != null) {
            currentblogger.setSecondName(updatedBlogger.getSecondName());
        }
        if (updatedBlogger.getBio() != null) {
            currentblogger.setBio(updatedBlogger.getBio());
        }
        if (updatedBlogger.getMediaLinks() != null) {
            currentblogger.setMediaLinks(updatedBlogger.getMediaLinks());
        }
        if (updatedBlogger.getLocation() != null) {
            currentblogger.setLocation(updatedBlogger.getLocation());
        }
        if (updatedBlogger.getType() != null) {
            currentblogger.setType(updatedBlogger.getType());
        }
        bloggerRepository.save(currentblogger);
        return ResponseEntity.ok(currentblogger);
    }
/*
    @PatchMapping( "/{id}")
    public ResponseEntity<Blogger> updateBloggerPartially(@PathVariable("id") long id, @RequestBody Blogger updatedBlogger) {
        Blogger currentblogger= bloggerRepository.findById(id);
        if (currentblogger == null) {
            System.out.println("Blogger not found");
            return ResponseEntity.notFound().build();
        }
        if (updatedBlogger.getAge() != 0) {
            currentblogger.setAge(updatedBlogger.getAge());
        }
        if (updatedBlogger.getName() != null) {
            currentblogger.setName(updatedBlogger.getName());
        }
        if (updatedBlogger.getSecondName() != null) {
            currentblogger.setSecondName(updatedBlogger.getSecondName());
        }
        if (updatedBlogger.getBio() != null) {
            currentblogger.setBio(updatedBlogger.getBio());
        }
        if (updatedBlogger.getMediaLinks() != null) {
            currentblogger.setMediaLinks(updatedBlogger.getMediaLinks());
        }
        if (updatedBlogger.getLocation() != null) {
            currentblogger.setLocation(updatedBlogger.getLocation());
        }
        if (updatedBlogger.getType() != null) {
            currentblogger.setType(updatedBlogger.getType());
        }
        bloggerRepository.save(currentblogger);
        return ResponseEntity.ok(currentblogger);
    }
*/
    @PatchMapping(value = "/{id}/blogs/{blogId}")
    public ResponseEntity<Blog> updateBlogPartially(@PathVariable("id") long id, @PathVariable("blogId") long blogId, @RequestBody Blog updatedBlog) {
        Blogger blogger = bloggerRepository.findById(id);
        Blog blog = blogRepository.findById(blogId);
        if (blogger == null) {
            System.out.println("Blogger not found");
            return ResponseEntity.notFound().build();
        }
        if (updatedBlog.getTitle() != null) {
            blog.setTitle(updatedBlog.getTitle());
        }
        if (updatedBlog.getGenre() != null) {
            blog.setGenre(updatedBlog.getGenre());
        }
        if (updatedBlog.getText() != null) {
            blog.setText(updatedBlog.getText());
        }
        if (updatedBlog.getCreationDate() != null) {
            blog.setCreationDate(updatedBlog.getCreationDate());
        }
        blogRepository.save(blog);
        bloggerRepository.save(blogger);
        return ResponseEntity.ok(blog);
    }

}
