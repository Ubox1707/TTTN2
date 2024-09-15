import { useEffect, useRef, useState } from "react"
import './userProfile.css'
import { useParams } from "react-router-dom"
import DefaultAvt from '../../img/defaultavt.jpg'
import DefaultBg from '../../img/defaultbg.jpg'
import SetIcon from '../../img/set-icon.png'


import useFollow from "../../hooks/useFollow"
import PostSide from "../../components/PostSide/PostSide.jsx"
import ProfileModal from "../../components/ProfileModal/ProfileModal.jsx"
import { useQuery } from "@tanstack/react-query"
import useUpdateUser from "../../hooks/useUpdateUser.jsx"



const UserProfile = () => {
	const [coverImg, setCoverImg] = useState(null)
	const [profileImg, setProfileImg] = useState(null)
	const [feedType, setFeedType] = useState("posts")

	const coverImgRef = useRef(null)
	const profileImgRef = useRef(null)

	

	const { username } = useParams()

	const { follow, isPending } = useFollow();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] })

	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`/users/profile/${username}`)
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	})

	const { isUpdatingProfile, updateProfile } = useUpdateUser()

	const isMyProfile = authUser._id === user?._id
	const amIFollowing = authUser?.following.includes(user?._id)

	const handleImgChange = (e, state) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader()
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result)
				state === "profileImg" && setProfileImg(reader.result)
			};
			reader.readAsDataURL(file)
		}
	};

	useEffect(() => {
		refetch()
	}, [username, refetch])


	return (
		<>
			<div className='user-profie'>
				{!isLoading && !isRefetching && !user && <p className='user-none'>Không tìm thấy User</p>}
				<div className='profile-container'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='user-image'>
								<img
									src={coverImg || user?.coverImg || DefaultBg}
									className='user-coverImg'
									alt='CoverImg'
								/>
								{isMyProfile && (
									<div
										className='set-cover'
										onClick={() => coverImgRef.current.click()}
									>
										<img src={SetIcon} className='set-cover-icon' alt="Set icon" />
									</div>
								)}

								<input
									type='file'
									hidden
									accept='image/*'
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									accept='image/*'
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								
								<div className='user-avatar'>
									<div className='avatar-contain'>
										<img 
											src={profileImg || user?.profileImg || DefaultAvt} 
											alt="Avatar"
											className="avatarImg" 
										/>
										{isMyProfile && (
											<div className='set-avatar'>
												<img src={SetIcon}
													className='set-avatar-icon'
													onClick={() => profileImgRef.current.click()}
													alt="Set icon"
												/>
											</div>
										)}
											
											
									</div>
								</div>
							</div>
							<div className='profile-btn'>
								{isMyProfile && <ProfileModal authUser={authUser}/>}
								{!isMyProfile && (
									<button
										className='button profile-follow-btn'
										onClick={() => follow(user?._id)}
									>
										{isPending && amIFollowing && "Loading..."}
										{isPending && !amIFollowing && "Loading..."}
										{!isPending && amIFollowing && "Unfollow"}
										{!isPending && !amIFollowing && "Follow"}

									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='button profile-update-btn'
										onClick={async () => {
											await updateProfile({coverImg, profileImg})
											setCoverImg(null)
											setProfileImg(null)
										}}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='profile-info'>
								<div className='user-info'>
									<span className='own-nickName'>{user?.nickName}</span>
									<span className='own-username'>@{user?.username}</span>
									<span className='own-work'><b>Làm việc tại:  </b>{user?.workAt}</span>
									<span className='own-live'><b>Sống tại:  </b>{user?.liveIn}</span>

								</div>
								<div className='user-follow'>
									<div className='following'>
										<span className='following-count'>{user?.following.length}</span>
										<span className='follow-text'>Following</span>
									</div>
									<div className='follower'>
										<span className='follower-count'>{user?.followers.length}</span>
										<span className='follow-text'>Followers</span>
									</div>
								
								</div>
							</div>
							<div className='profile-post'>
								<div
									className='own-posts'
									onClick={() => setFeedType("posts")}
								>
									Post của bạn
									{feedType === "posts" && (
										<div className='post-border' />
									)}
								</div>
								<div
									className='own-liked'
									onClick={() => setFeedType("likes")}
								>
									Post đã Like
									{feedType === "likes" && (
										<div className='post-border' />
									)}
								</div>
							</div>
						</>
					)}

					
				</div>
				<PostSide feedType={feedType} username={username} userId={user?._id}/>
			</div>
		</>
	);
};
export default UserProfile;