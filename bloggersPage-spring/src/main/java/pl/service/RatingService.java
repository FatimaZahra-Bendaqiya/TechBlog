
package pl.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.model.Blog;
import pl.model.Rating;
import pl.repository.BlogRepository;
import pl.repository.RatingRepository;

import java.util.List;
import java.util.Optional;

@Service
public class RatingService {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private BlogRepository blogRepository;

    public Rating addOrUpdateRating(Rating rating) {
        Optional<Blog> blogOptional = Optional.ofNullable(blogRepository.findById(rating.getBlog().getId()));
        if (blogOptional.isPresent()) {
            rating.setBlog(blogOptional.get());

            Optional<Rating> existingRating = ratingRepository.findByBlogIdAndUserId(rating.getBlog().getId(), rating.getUserId());
            if (existingRating.isPresent()) {
                Rating updatedRating = existingRating.get();
                updatedRating.setRate(rating.getRate());
                ratingRepository.save(updatedRating);
                updateBlogAverageRating(rating.getBlog().getId());
                return updatedRating;
            } else {
                Rating newRating = ratingRepository.save(rating);
                updateBlogAverageRating(rating.getBlog().getId());
                return newRating;
            }
        } else {
            throw new RuntimeException("Blog not found");
        }
    }

    public Rating updateRating(Long id, int newRate) {
        Optional<Rating> ratingOptional = ratingRepository.findById(id);
        if (ratingOptional.isPresent()) {
            Rating rating = ratingOptional.get();
            rating.setRate(newRate);
            ratingRepository.save(rating);
            updateBlogAverageRating(rating.getBlog().getId());
            return rating;
        } else {
            return null;
        }
    }

    public boolean deleteRating(Long id, Long userId) {
        Optional<Rating> ratingOptional = ratingRepository.findById(id);
        if (ratingOptional.isPresent()) {
            Rating rating = ratingOptional.get();
            if (rating.getUserId().equals(userId)) {
                ratingRepository.deleteById(id);
                updateBlogAverageRating(rating.getBlog().getId());
                return true;
            }
        }
        return false;
    }

    public List<Rating> getRatingsByBlogId(Long blogId) {
        return ratingRepository.findByBlogId(blogId);
    }

    public double getRatingAverage(Long blogId) {
        List<Rating> ratings = getRatingsByBlogId(blogId);
        return ratings.isEmpty() ? 0.0 : ratings.stream().mapToInt(Rating::getRate).average().orElse(0.0);
    }

    public int getNumberOfRatings(Long blogId) {
        return getRatingsByBlogId(blogId).size();
    }

    private void updateBlogAverageRating(Long blogId) {
        List<Rating> ratings = getRatingsByBlogId(blogId);
        double averageRating = ratings.stream().mapToInt(Rating::getRate).average().orElse(0.0);
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setRating(averageRating);
        blog.setNumberOfRatings(ratings.size());
        blogRepository.save(blog);
    }
}
