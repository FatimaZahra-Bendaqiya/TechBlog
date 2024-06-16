package pl.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.model.Blogger;
import pl.model.User;

@Repository
public interface BloggerRepository extends JpaRepository<Blogger, Long>{
    Blogger findById(long id);
    Blogger findByUser(User user);
}
