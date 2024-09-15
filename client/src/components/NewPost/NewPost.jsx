import React, { useEffect, useRef, useState } from 'react'
import './newPost.css'
import { Link } from 'react-router-dom'
import Like from '../../img/like.png'
import Dislike from '../../img/dislike.png'
import Comment from '../../img/comment-icon.png'
import Delete from '../../img/delete-icon.png'
import DefautlAvt from '../../img/defaultavt.jpg'

import { io } from 'socket.io-client'

import { formatPostDate } from "../../utils/date/index.js"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from "react-hot-toast"


const NewPost = ({post}) => {

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    let socket = useRef()
	
	// socket = io("http://localhost:5000")
	useEffect(() => {
        socket.current = io("http://localhost:5000");

        return () => {
            socket.current.disconnect();
        };
    }, []);

	const [comment, setComment] = useState("");
	const queryClient = useQueryClient();
	
	const postOwner = post.user;
	const isLiked = post.likes.includes(authUser._id);
	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);

	
	const { mutate: deletePost } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/posts/${post._id}`, {
					method: "DELETE",
				})
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: () => {
			toast.success("Đã xóa bài viết")
			queryClient.invalidateQueries({ queryKey: ["posts"] })
		},
	})

	const { mutate: likePost } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				// socket.emit("send-notification", postOwner._id)
				// console.log(postOwner._id)
				
				return data
			} catch (error) {
				throw new Error(error)
			}
		},
		onSuccess: (updatedLikes) => {
			socket.current.emit("send-notification", {
				from: authUser,
				type: "like",
				to: post.user._id,
			});
			
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json()

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		
		onSuccess: (newComment) => {
			toast.success("Bình luận thành công");
			setComment("");
			console.log(post.user._id)  
			
			socket.current.emit("send-notification", {
				from: authUser,  
				to: post.user._id,
				type: "comment",
			})
	
			
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, comments: [...p.comments, newComment] };
					}
					return p;
				});
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDelete = () => {
		deletePost()
	}

	const handleComment = (e) => {
		e.preventDefault()
		if(isCommenting || !comment.trim()) return
		commentPost()
	}

	const handleClose = () => {
		const modal = document.getElementById(`comments_modal${post._id}`)
		if (modal) {
			modal.close()
		}
	}
	

	const handleLike = () => {
		// if(isLiking) return
		likePost()
	}
  return (
    <>
	<div className='new-post'>
		<div className='avatar'>
			<Link to={`/profile/${postOwner.username}`} className='post-link'>
				<img src={postOwner.profileImg || DefautlAvt} alt='user-avatar'/>
			</Link>
		</div>
		<div className='post-user'>
			<div className='user-information'>
				<Link to={`/profile/${postOwner.username}`} className='nickName-link'>
				{postOwner.nickName}
				</Link>
				<span className='user-username'>
					<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
					<span>·</span>
					<span>{formattedDate}</span>
				</span>
				{isMyPost && (
					<span className='post-delete'>
						<img src={Delete} className='delete-icon' onClick={handleDelete} alt='delete-icon'/>
						<p className='delete-warn'>Xóa tất cả thông báo</p>
					</span>
					
				)}
			</div>
			<div className='post-container'>
				<span>{post.text}</span>
					{post.img && (
						<img
							src={post.img}
							className='post-img'
							alt=''
						/>
					)}
			</div>
			<div className='post-reaction'>
				<div className='reaction-container'>
					<div
						className='post-comment'
						onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
					>
						<img src={Comment} className='comment-icon' alt='comment-icon'/>
						<span className='comment-count'>
							{post.comments.length}
						</span>
					</div>
					<dialog id={`comments_modal${post._id}`} className='comment-modal'>
						<div className='comment-modal-container'>
							<h3 className='comment-modal-title'>COMMENTS</h3>
							<div className='comment-list'>
								{post.comments.length === 0 && (
									<p className='comment-none'>
									Chưa có bình luận nào😐Hãy là người đầu tiên bình luận😊
									</p>
									)}
									{post.comments.map((comment) => (
										<div key={comment._id} className='comment-user'>
											<div className='avatar'>
												<img
													src={comment.user.profileImg || DefautlAvt}
													alt='user-avatar'
													className='comment-avatar'
												/>
											</div>
											<div className='comment-user-info'>
												<div className='comment-user-name'>
													<span className='comment-user-nickName'>{comment.user.nickName}</span>
													<span className='comment-username'>
														@{comment.user.username}
													</span>
												</div>
												<div className='comments'>{comment.text}</div>
											</div>
										</div>
									))}
							</div>
							<form
								className='comment-form'
								onSubmit={handleComment}
							>
								<textarea
									className='comment-input'
									placeholder='Bình luận gì đó...'
									value={comment}
									onChange={(e) => setComment(e.target.value)}
								/>
								<button className='comment-button'>
									{isCommenting ? (
										"Bình luận..."
									) : (
										"Bình luận"
									)}
								</button>
							<button className='comment-modal-close' onClick={handleClose}>Close</button>

							</form>
						</div>
					</dialog>
							
					<div className='post-like' onClick={handleLike}>
						{!isLiked && (
							<img src={Dislike} className='dislike-icon' alt='dislike-icon' />
						)}
						{isLiked && <img src={Like} className='like-icon' alt='like-icon' />}
						<span
							className={`like-count ${
								isLiked ? "text-pink-500" : ""
							}`}
						>
							{post.likes.length}
						</span>
					</div>
				</div>
						
			</div>
		</div>
	</div>
	</>
  )
}

export default NewPost
