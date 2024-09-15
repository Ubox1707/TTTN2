import React from 'react'
import './rightSide.css'
import User from '../User/User'
import { Link } from 'react-router-dom'
import DefaultAvt from "../../img/defaultavt.jpg"

import useFollow from "../../hooks/useFollow"
import { useQuery } from '@tanstack/react-query'
const RightSide = () => {
	
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/users/suggested");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});

	const { follow } = useFollow();

	if (suggestedUsers?.length === 0) return <div className='none-user'>Bạn đã follow tất cả mọi người 😑</div>;

  return (
    <div className='RightSide'>
        <User/>
        <div className="follower-card">
          <div className='follower-container'>
            <p className='follower-title'>Gợi ý cho bạn</p>
				    <div className='follower-content'>
						{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='follower-profile'
								key={user._id}
							>
							<div className='follower-info'>
								<div className='follower-avatar'>
									<div className='w-8 rounded-full'>
										<img src={user.profileImg || DefaultAvt} alt='User avatar' />
									</div>
								</div>
								<div className='follower-name'>
									<span className='follower-nickName'>{user.nickName}</span>
									<span className='follower-username'>@{user.username}</span>
								</div>
							</div>
							<div>
								<button
									className='button follow-btn'
									onClick={(e) => {
										e.preventDefault()
										follow(user._id)
									}

									}
								>
									Follow
								</button>
							</div>
							</Link>
						))
          				}
          			</div>
          	</div>
        </div>
    </div>
  )
}

export default RightSide
