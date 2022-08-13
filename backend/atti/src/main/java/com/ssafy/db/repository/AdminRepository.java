package com.ssafy.db.repository;

import java.util.List;
=======
package com.ssafy.db.repository;

import java.util.List;
import java.util.Optional;
>>>>>>> c23ccc711daea50ce75c5c4818f22ca34f1c859b

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.stereotype.Repository;

import com.ssafy.db.entity.depart.Category;
import com.ssafy.db.entity.depart.Post;
import com.ssafy.db.entity.depart.UserDepart;
import com.ssafy.db.entity.user.User;
//import com.ssafy.db.entity.webclass.Attendance;

import javax.persistence.PersistenceContext;


// 사용 엔티티명, 해당 클래스의 pk 타입

@Repository
@Transactional
public class AdminRepository {

	@Autowired
	EntityManager em;
	
	// 채널 회원 목록 조회
	public List<UserDepart> findAll(Long departId) {
		List<UserDepart> result = em.createQuery("select ud from UserDepart as ud where ud.depart=:departId", UserDepart.class)
				.setParameter("departId", departId)
				.getResultList();
		return result;
	}

	public void deleteCategory(Long categoryId) {
		Category result = em.createQuery("select c from Category as c where c.categoryId = :categoryId", Category.class)
				.setParameter("categoryId", categoryId)
				.getSingleResult();
		em.remove(result);
	}

	/*
	 * public void editAttend(Attendance editAttend) { Attendance originAttend = em.
	 * createQuery("select a from attendance as a where a.attendanceId = :attendanceId"
	 * , Attendance.class) .setParameter("attendanceId",
	 * editAttend.getAttendanceId()) .getSingleResult();
	 * 
	 * originAttend.setAttendancdContent(editAttend.getAttendancdContent());
	 * 
	 * 
	 * }
	 */
	// 게시글 전체 조회
	public List<Post> findAll() {
		List<Post> result = em.createQuery("select p from Post as p", Post.class).getResultList();
		return result;
	}
	
	/*
	 * @PersistenceContext private EntityManager em;
	 */
	


}

=======
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.db.entity.depart.Category;
import com.ssafy.db.entity.depart.Depart;
import com.ssafy.db.entity.depart.Post;
import com.ssafy.db.entity.depart.UserDepart;


//사용 엔티티명, 해당 클래스의 pk 타입

@Repository
@Transactional
public interface AdminRepository extends JpaRepository<Depart, Long>{
	
	// 채널 id를 받을 껍데기 생성
	
	// 채널 회원 목록 조회
	// 내가 찾아올 컬럼 (앞글자는 대문자) : findById는 pk로 찾는 것 채널 id를 받는 껍데기
	// Optional<Depart> findById(Long departId);

//	public void deleteCategory(Long categoryId) {
//		Category result = em.createQuery("select c from Category as c where c.categoryId = :categoryId", Category.class)
//				.setParameter("categoryId", categoryId)
//				.getSingleResult();
//		em.remove(result);
//	}

//	public void editAttend(Attendance editAttend) {
//		Attendance originAttend = em.createQuery("select a from attendance as a where a.attendanceId = :attendanceId",
//				Attendance.class)
//				.setParameter("attendanceId", editAttend.getAttendanceId())
//				.getSingleResult();
//		
//		originAttend.setAttendancdContent(editAttend.getAttendancdContent());
//
//		
//	}

	// 게시글 전체 조회
//	public List<Post> findAll() {
//		List<Post> result = em.createQuery("select p from Post as p", Post.class).getResultList();
//		return result;
//	}
}

