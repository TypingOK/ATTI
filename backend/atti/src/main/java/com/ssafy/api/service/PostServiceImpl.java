package com.ssafy.api.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import com.ssafy.api.request.PostWriteReq;
import com.ssafy.api.response.PostViewAllRes;
import com.ssafy.api.response.PostViewOneRes;
import com.ssafy.db.entity.depart.Category;
import com.ssafy.db.entity.depart.Depart;
import com.ssafy.db.entity.depart.Post;
import com.ssafy.db.entity.depart.UserPostLike;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.CategoryRepository;
import com.ssafy.db.repository.CategoryRepository2;
import com.ssafy.db.repository.CommentRepository;
import com.ssafy.db.repository.DepartRepository;
import com.ssafy.db.repository.DepartRepository2;
import com.ssafy.db.repository.PostRepository;
import com.ssafy.db.repository.PostRepository2;
import com.ssafy.db.repository.UserPostLikeRepository;
import com.ssafy.db.repository.UserRepository;

@Service
@Transactional(readOnly = true) // readOnly true를 사용하면 읽기 최적화
public class PostServiceImpl implements PostService {
	
	@Autowired
	private DepartRepository departRepository;
	
	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private CategoryRepository categoryRepository;
	
	@Autowired
	private UserRepository userRepository;
	
	// 좋아요 추가 - 주희
	@Autowired
	private UserPostLikeRepository userPostLikeRepository;
	
	// 댓글 갯수 추가 - 주희
	@Autowired
	private CommentRepository commentRepository;

	@Override // 글쓰기
	@Transactional // 쓰기가 필요할땐 그냥 Transactional
	public void createWriting(PostWriteReq postWriteReq) {
//		Post post = Post.builder()
//				.postTitle(postWriteReq.getPostTitle())
//				.postContent(postWriteReq.getPostContent())
//				.postRegDate(postWriteReq.getPostRegDate())
//				.user(userRepository.getOne(postWriteReq.getUserId()))
//				.category(categoryRepository.getById(postWriteReq.getCategoryId()))
//				.depart(departRepository.findById(id)(postWriteReq.getDepartId()))
//				.build();
		postWriteReq.setPostRegDate(LocalDateTime.now());
		
		Depart depart = departRepository.getById(postWriteReq.getDepartId());
		Category category = categoryRepository.getById(postWriteReq.getCategoryId());
		User user = userRepository.getById(postWriteReq.getUserId());
		Post post = Post.builder()
				.postTitle(postWriteReq.getPostTitle())
				.postContent(postWriteReq.getPostContent())
				.postAnoInfo(postWriteReq.isPostAnoInfo())
				.postComBanInfo(postWriteReq.isPostComBanInfo())
				.postRegDate(LocalDateTime.now())
				.depart(depart)
				.category(category)
				.user(user)
				.build();
		
		postRepository.save(post);
		
//		post.setUser(user); 무덤
	}

	@Override // 게시글 전체 조회
	public List<PostViewAllRes> viewAllPosts(Long departId, Long categoryId, String userId) {

//		System.out.println("=======================" + departId + "=======================");
//		System.out.println("=======================" + categoryId + "=======================");
//		List<Post> entityList = postRepository.findAllPosts(departRepository.findById(departId), categoryRepository.findById(categoryId));
//		List<Post> entityList = postRepository.findAllById(departRepository.findById(departId), categoryRepository.findById(categoryId));
//		List<PostViewAllRes> list = new ArrayList<>();
//		for (Post post : entityList) {
//			list.add(new PostViewAllRes(post));
//		}
		Depart depart = departRepository.findById(departId).orElse(null);
		Category category = categoryRepository.findById(categoryId).orElse(null);
		List<Post> postList = postRepository.findByDepartAndCategoryOrderByPostIdDesc(depart, category);
		
		List<PostViewAllRes> postViewAllResList;
		if(postList.isEmpty()) return null;
		else postViewAllResList = new ArrayList<PostViewAllRes>(); 
		
		User user = userRepository.findById(userId).orElse(null);
		
		for(Post p : postList) {
			// 내가 이 게시글에 좋아요를 눌렀는지 체크
			UserPostLike userPostLike = userPostLikeRepository.findByPostAndUser(p, user).orElse(null);
			boolean myLike = false;
			if(userPostLike != null)
				myLike = true;
			
			Long likeCount = userPostLikeRepository.countByPost(p);
			Long commentCount = commentRepository.countByPost(p);
			
			postViewAllResList.add(PostViewAllRes.builder()
					.postTitle(p.getPostTitle())
					.postContent(p.getPostContent())
					.postRegDate(p.getPostRegDate())
					.userId(p.getUser().getUserId())
					.likeCount(likeCount)
					.commentCount(commentCount)
					.myLike(myLike).build());
		}
		
		return postViewAllResList;
	}

	@Override // 게시글 상세 조회
	public PostViewOneRes viewFindOne(Long postId) {
		Post post = postRepository.findById(postId).orElse(null);
		
		return new PostViewOneRes(post);
	}

	@Override // 이름으로 게시글 검색
	public List<Post> viewByName(String name) {
//		return postRepository.findByName(name);
		return null;
	}

	@Override // 단일 게시글 삭제
	@Transactional
	public void deleteFindOne(Long postId) {
		postRepository.deleteById(postId);
	}

	@Override // 단일 게시글 수정
	@Transactional
	public void editPost(Post editPost) {
		editPost.setPostUpdDate(LocalDateTime.now());
//		postRepository.updateOne(editPost);
	}
	
	// 좋아요 기능 - 주희 추가
	// 좋아요 버튼 누름
	@Override
	@Transactional
	public long postLike(Long postId, String userId) {
		Post post = postRepository.findById(postId).orElse(null);
		User user = userRepository.findById(userId).orElse(null);
		
		// UserPostLike 에서 Post 에 해당하는 user 가 있는지 찾기
		UserPostLike userPostLike = userPostLikeRepository.findByPostAndUser(post, user).orElse(null);
		
		// 없다면, 추가
		if(userPostLike == null)
			userPostLikeRepository.save(new UserPostLike().builder().post(post).user(user).build());
		// 있다면, 삭제
		userPostLikeRepository.deleteById(userPostLike.getUserPostLikeId());
		
		// 변화된 갯수 리턴
		long count = userPostLikeRepository.countByPost(post);
		return count;
	}
}
