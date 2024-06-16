package pl.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.model.User;
import pl.model.Visitor;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long>{
    Visitor findById(long id);
    Visitor findByUser(User user);
}
