package com.ssafy.db.repository;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;

import com.ssafy.api.request.KakaoUser;
import com.ssafy.api.request.UserFindIdReq;
import com.ssafy.api.request.UserUpdateReq;
import com.ssafy.db.entity.user.User;

import lombok.RequiredArgsConstructor;

/*
 * 유저 모델 관련 디비 쿼리 생성을 위한 구현 정의
 */
@Repository
public class UserRepository2 {
	
	@Autowired
	EntityManager em;
	
	
	
	public void signUp(User user) {
		em.persist(user);
	}
	
	// 카카오로 회원가입
	// User 엔티티말고 기본 유저 req 만들어서 상속받아 사용했으면 한 개만 만들어도 됐을 것 같음
	public void signUpKakao(KakaoUser user) {
//		
//		em.persist(user);
	}
	
	public List<User> findById(String userId){
//		String jpql = "SELECT b FROM Book b ";
//		TypedQuery<Book> query = em.createQuery(jpql, Book.class);
		
		return em.createQuery("select u from User u where u.userId = :userId", User.class).setParameter("userId", userId).getResultList();
	}
	
	public List<User> findByName(String name){
		return em.createQuery("select u from User u where u.userName = :name", User.class).setParameter("name", name).getResultList();
	}
	
	// 아이디 찾기
	public List<User> findId(UserFindIdReq findIdInfo){
		String name = findIdInfo.getName();
		String email = findIdInfo.getEmail();
		
		return em.createQuery("select u from User u where u.userName = :name and u.email = :email", User.class).setParameter("name", name).setParameter("email", email).getResultList();
	}
	
	// 카카오 아이디 찾기
	public List<User> findKakaoId(String userId){
		return em.createQuery("select u from User u where u.social = :userId", User.class).setParameter("userId", userId).getResultList();
	}
	
	public User IdCheck(String userId) {
		return em.find(User.class, userId);
	}
	
	public List<User> phoneCheck(String phoneNumber) {
		return em.createQuery("select u from User u where u.phone = :phoneNumber", User.class).setParameter("phoneNumber", phoneNumber).getResultList();
	}
	
	// 회원 정보 수정
	@Modifying
	public int updateUser(UserUpdateReq userUpdateInfo) {
		
		int resultCount = em.createQuery("UPDATE User u set u.password =:password, u.userName =:userName, u.email =:email, u.birth =:birth, u.phone =:phone where u.userId =:userId ")
		.setParameter("password", userUpdateInfo.getPassword())
		.setParameter("userName", userUpdateInfo.getUserName())
		.setParameter("email", userUpdateInfo.getEmail())
		.setParameter("birth", userUpdateInfo.getBirth())
		.setParameter("phone", userUpdateInfo.getPhone())
		.setParameter("userId", userUpdateInfo.getUserId()).executeUpdate(); 
		
		return resultCount;
	}
	
	// 범수가 씀
	public User findOne(String id) {
		return em.find(User.class, id);
	}
//    
//	public List<User> findAll(){
//		return em.createQuery("select m from Member m", User.class).getResultList();
//	}
}
