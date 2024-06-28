package pl.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.model.Blog;
import pl.model.Rating;
import pl.model.RatingRequest;
import pl.repository.BlogRepository;
import pl.service.RatingService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private BlogRepository blogRepository;

    @PostMapping
    public ResponseEntity<Rating> addOrUpdateRating(@RequestBody RatingRequest ratingRequest, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId"); // Extract userId from the request
            if (userId == null) {
                throw new RuntimeException("User ID is missing");
            }
            Blog blog = blogRepository.findById(ratingRequest.getBlogId())
                    .orElseThrow(() -> new RuntimeException("Blog not found"));
            Rating rating = new Rating(ratingRequest.getRate(), blog, userId);

            Rating savedRating = ratingService.addOrUpdateRating(rating);
            return ResponseEntity.ok(savedRating);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error while adding or updating rating: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Rating> updateRating(@PathVariable Long id, @RequestBody RatingRequest ratingRequest, HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId"); // Extract userId from the request
            if (userId == null) {
                throw new RuntimeException("User ID is missing");
            }
            Rating updatedRating = ratingService.updateRating(id, ratingRequest.getRate());
            updatedRating.setUserId(userId); // Ensure userId is set
            return updatedRating != null ? ResponseEntity.ok(updatedRating) : ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error while updating rating: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id,HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            if (userId == null) {
                throw new RuntimeException("User ID is missing");
            }
            boolean deleted = ratingService.deleteRating(id,userId);
            return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error while deleting rating: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/blog/{blogId}")
    public ResponseEntity<List<Rating>> getRatingsByBlogId(@PathVariable Long blogId) {
        try {
            List<Rating> ratings = ratingService.getRatingsByBlogId(blogId);
            return ResponseEntity.ok(ratings);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error while fetching ratings: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/blog/{blogId}/average")
    public ResponseEntity<Double> getRatingAverage(@PathVariable Long blogId) {
        try {
            double average = ratingService.getRatingAverage(blogId);
            return ResponseEntity.ok(average);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error while fetching average rating: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/blog/{blogId}/count")
    public ResponseEntity<Integer> getNumberOfRatings(@PathVariable Long blogId) {
        try {
            int count = ratingService.getNumberOfRatings(blogId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error while fetching number of ratings: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}