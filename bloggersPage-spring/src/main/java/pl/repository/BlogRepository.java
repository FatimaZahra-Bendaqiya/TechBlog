package pl.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.model.Blogger;
import pl.model.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long>{
    Blog findById(long id);

    Blog findByBlogger(Blogger blogger);
}
