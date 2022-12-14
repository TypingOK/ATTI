package com.ssafy.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.db.entity.depart.File;

@Repository
public interface FileRepository extends JpaRepository<File, Long>{

}
