package pl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.model.Tech;

public interface TechRepository extends JpaRepository<Tech, Long>{
    Tech findById(long id);
}
