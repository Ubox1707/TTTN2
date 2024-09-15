import { Link } from "react-router-dom"
import './notification.css'
import { io } from 'socket.io-client'

import SettingIcon from "../../img/set-icon.png"
import User from "../../img/avt-icon.png"
import Like from "../../img/like.png"
import DefaultAvt from "../../img/defaultavt.jpg"
import Comment from "../../img/comment-icon.png"
import toast from "react-hot-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useRef } from "react"


const Notification = () => {

	
	const queryClient = useQueryClient();
	
	
	const { data: notifications } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		
	})

	let socket = useRef()

	useEffect(() => {
        socket.current = io("http://localhost:5000");
        socket.current.on("get-notification", (notificationData) => { 
            queryClient.setQueryData(["notifications"], (oldData) => {
                return [notificationData, ...oldData ]; 
            });
        });

        return () => {
            socket.current.disconnect();
        };
    }, [queryClient]);
	
	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Đã xóa tất cả thông báo");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='notification'>
				<div className='notification-container'>
					<p className='notification-title'>Thông báo</p>
					<div className='dropdown'>
						<div tabIndex={0} role='button' className='m-1'>
							<img src={SettingIcon} className='setting-icon' alt="Setting icon" />
						</div>
						<ul
							tabIndex={0}
							className='setting-content'
						>
							<li>
								<a onClick={deleteNotifications}>Xóa tất cả thông báo</a>
							</li>
						</ul>
					</div>
				</div>
				
				{notifications?.length === 0 && <div className='notification-none'>Không có thông báo 😑</div>}
				{notifications?.map((notification) => (
					<div className='notification-list' key={notification._id}>
						<div className='notification-content'>
							{notification.type === "follow" && <img src={User} className='notification-follow' alt="Avatar mặc định"/>}
							{notification.type === "like" && <img src={Like} className='notification-like' alt="Like icon"/>}
							{notification.type === "comment" && <img src={Comment} className='notification-comment' alt="Comment icon"/>}

							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='notification-avt'>
										<img src={notification.from.profileImg || DefaultAvt} alt="User avatar" />
									</div>
								</div>
								<div className='avatar'>
									<span className='notification-username'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" 
									? "đã follow bạn" 
									: notification.type === "like" 
									? "đã thích bài viết của bạn" 
        							: notification.type === "comment" 
        							? "đã bình luận bài viết của bạn" 
									: ""
									}
								</div>
								
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default Notification;