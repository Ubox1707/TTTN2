import { useEffect, useState } from "react";
import './profileModal.css'
import useUpdateUser from "../../hooks/useUpdateUser";

const ProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		nickName: "",
		username: "",
		email: "",
		workAt: "",
		liveIn: "",
		newPassword: "",
		currentPassword: "",
	})

	const { updateProfile, isUpdatingProfile } = useUpdateUser()

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value })
	}

	useEffect(() => {
		if (authUser) {
			setFormData({
				nickName: authUser.nickName,
				username: authUser.username,
				email: authUser.email,
				workAt: authUser.workAt,
				liveIn: authUser.liveIn,
				newPassword: "",
				currentPassword: "",
			})
		}
	}, [authUser])


	return (
		<>
			<button
				className='button modal-open'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='update'>
					<h3 className='update-text'>Update Profile</h3>
					<form
						className='modal-form'
						onSubmit={(e) => {
							e.preventDefault()
							updateProfile(formData)
						}}
					>
						<div className='modal-input'>
							<input
								type='text'
								placeholder='Nick Name'
								className='info-input'
								value={formData.nickName}
								name='nickName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='info-input'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='modal-input'>
							<input
								type='email'
								placeholder='Email'
								className='info-input'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
						</div>
						<div className='modal-input'>
							<input
								type='text'
								placeholder='Sống tại'
								className='info-input'
								value={formData.liveIn}
								name='liveIn'
								onChange={handleInputChange}
							/>
							<input
								placeholder='Làm việc tại'
								className='info-input'
								value={formData.workAt}
								name='workAt'
								onChange={handleInputChange}
							/>
						</div>
						<div className='modal-input'>
							<input
								type='password'
								placeholder='Mật khẩu cũ'
								className='info-input'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Mật khẩu mới'
								className='info-input'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>	
						<button className='profile-modal-update'>{isUpdatingProfile ? "Updating..." : "Update"}</button>
						<button className="profile-modal-close" onClick={() => document.getElementById("edit_profile_modal").close()} >Close</button>
					</form>
				</div>
				
			</dialog>
		</>
	);
};
export default ProfileModal;