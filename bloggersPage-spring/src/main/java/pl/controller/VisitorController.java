package pl.controller;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.model.Blog;
import pl.model.User;
import pl.model.Visitor;
import pl.repository.BlogRepository;
import pl.repository.UserRepository;
import pl.repository.VisitorRepository;

import java.security.Principal;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/visitor")
public class VisitorController {
    private VisitorRepository visitorRepository;
    private BlogRepository blogRepository;
    private UserRepository userRepository;

    @Autowired
    public VisitorController(VisitorRepository visitorRepository, BlogRepository blogRepository, UserRepository userRepository) {
        this.visitorRepository = visitorRepository;
        this.blogRepository = blogRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Visitor> findAllVisitors() {
        return visitorRepository.findAll();
    }

    @GetMapping(value = "/{id}")
    public Visitor findVisitor(@PathVariable("id") long id) {
        return visitorRepository.findById(id);
    }

    @GetMapping(value = "/currentVisitor")
    @PreAuthorize("hasRole('VISITOR')")
    public ResponseEntity<Visitor> findCurrentVisitor(HttpServletRequest request){
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Visitor visitor = visitorRepository.findByUser(user);
        return ResponseEntity.status(HttpStatus.OK).body(visitor);
    }

    @GetMapping(value = "/{id}/blogs/{blogId}")
    public Blog findVisitorBlog(@PathVariable("id") long id, @PathVariable("blogId") long blogId) {
        Visitor visitor = visitorRepository.findById(id);
        if (visitor == null) {
            System.out.println("Visitor not found");
            return null;
        }
        Blog blog = blogRepository.findById(blogId);
        if (blog == null) {
            System.out.println("Blog not found");
            return null;
        }
        return blog;
    }


    @PostMapping
    public ResponseEntity<Visitor> addVisitor(@RequestBody Visitor visitor) {
        visitorRepository.save(visitor);
        return ResponseEntity.status(HttpStatus.CREATED).body(visitor);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Visitor> deleteVisitor(@PathVariable("id") long id) {
        Visitor visitor = visitorRepository.findById(id);
        if (visitor == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<Visitor>(HttpStatus.NOT_FOUND);
        }
        visitorRepository.delete(visitor);
        return new ResponseEntity<Visitor>(HttpStatus.NO_CONTENT);
    }


    @PutMapping(value = "/{id}")
    public ResponseEntity<Visitor> updateVisitor(@PathVariable("id") long id, @RequestBody Visitor visitor) {
        Visitor visitor1 = visitorRepository.findById(id);
        if (visitor1 == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<Visitor>(HttpStatus.NOT_FOUND);
        }
        visitor1.setName(visitor.getName());
        visitor1.setSurname(visitor.getSurname());
        visitorRepository.save(visitor1);
        return new ResponseEntity<Visitor>(HttpStatus.NO_CONTENT);
    }



    @PatchMapping(value = "/{id}")
    public ResponseEntity<Visitor> patchVisitor(@PathVariable("id") long id, @RequestBody Visitor visitor) {
        Visitor visitor1 = visitorRepository.findById(id);
        if (visitor1 == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<Visitor>(HttpStatus.NOT_FOUND);
        }
        if (visitor.getName() != null) {
            visitor1.setName(visitor.getName());
        }
        if (visitor.getSurname() != null) {
            visitor1.setSurname(visitor.getSurname());
        }
        visitorRepository.save(visitor1);
        return new ResponseEntity<Visitor>(visitor1, HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/currentVisitor")
    @PreAuthorize("hasRole('VISITOR')")
    public ResponseEntity<Visitor> patchCurrentVisitor(@Valid @RequestBody Visitor visitor, HttpServletRequest request){
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Visitor visitor1 = visitorRepository.findByUser(user);
        if (visitor1 == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<Visitor>(HttpStatus.NOT_FOUND);
        }
        if (visitor.getName() != null) {
            visitor1.setName(visitor.getName());
        }
        if (visitor.getSurname() != null) {
            visitor1.setSurname(visitor.getSurname());
        }
        visitorRepository.save(visitor1);
        return new ResponseEntity<Visitor>(visitor1, HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/likeBlog/{blogId}")
    @PreAuthorize("hasRole('VISITOR')")
    public ResponseEntity<Visitor> likeBlog(@PathVariable("blogId") long blogId, HttpServletRequest request){
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Visitor visitor = visitorRepository.findByUser(user);
        if (visitor == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<Visitor>(HttpStatus.NOT_FOUND);
        }
        Blog blog = blogRepository.findById(blogId);
        if (blog == null) {
            System.out.println("Blog not found");
            return new ResponseEntity<Visitor>(HttpStatus.NOT_FOUND);
        }
        visitor.addLikedBlog(blog);
        visitorRepository.save(visitor);
        return new ResponseEntity<Visitor>(visitor, HttpStatus.NO_CONTENT);
    }

    @GetMapping("/likedBlogs")
    @PreAuthorize("hasRole('VISITOR')")
    public ResponseEntity<List<Blog>> getLikedBlogs(HttpServletRequest request){
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Visitor visitor = visitorRepository.findByUser(user);
        if (visitor == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<List<Blog>>(HttpStatus.NOT_FOUND);
        }
        List<Blog> blogs = visitor.getLikedBlogs();
        return new ResponseEntity<List<Blog>>(blogs, HttpStatus.OK);
    }

    @PatchMapping(value = "/unlikeBlog/{id}")
    @PreAuthorize("hasRole('VISITOR')")
    public ResponseEntity<Blog> unlikeBlog(@PathVariable("id") long id, HttpServletRequest request) {
        Principal principal = request.getUserPrincipal();
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(()-> new RuntimeException("Error: User not found"));
        Visitor visitor = visitorRepository.findByUser(user);
        if (visitor == null) {
            System.out.println("Visitor not found");
            return new ResponseEntity<Blog>(HttpStatus.NOT_FOUND);
        }
        Blog blog = blogRepository.findById(id);
        if (blog == null) {
            System.out.println("Blog not found");
            return new ResponseEntity<Blog>(HttpStatus.NOT_FOUND);
        }
        visitor.removeLikedBlog(blog);
        visitorRepository.save(visitor);
        return new ResponseEntity<Blog>(HttpStatus.NO_CONTENT);
    }
}
