package com.ssafy.db.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.db.entity.webclass.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long>{

}