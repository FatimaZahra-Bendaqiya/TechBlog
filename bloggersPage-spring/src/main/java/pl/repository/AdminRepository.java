package pl.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.model.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
      Admin findById(long id);
}
