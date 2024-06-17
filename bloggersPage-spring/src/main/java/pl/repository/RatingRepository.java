package pl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.model.Rating;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByBlogIdAndUserId(Long blogId, Long userId);
    List<Rating> findByBlogId(Long blogId);
}
