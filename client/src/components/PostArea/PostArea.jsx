import React, {useState, useRef} from 'react'
import './postArea.css'
import PhotoIcon from '../../img/photo-icon.png'
import CloseIcon from '../../img/close-icon.png'
import DefautlAvt from '../../img/defaultavt.jpg'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'




const PostArea = () => {
  const [img, setImg] = useState(null)
  const [text, setText] = useState("")
  const imageRef = useRef(null)
 
  const { data: authUser } = useQuery({ queryKey: ["authUser"] })
	const queryClient = useQueryClient()

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
				});
				const data = await res.json()
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setText("")
			setImg(null)
			toast.success("Post created successfully")
			queryClient.invalidateQueries({ queryKey: ["posts"] })
		},
	});


  //Post processing
  const handleClick = (e) =>{
    e.preventDefault()
    createPost({ text, img })
  }

   //Update information change
  const handleChange = (event) => {
    const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
  }

  return (
    <div className='post-area'>
      <img 
        src={authUser.profileImg || DefautlAvt}
        alt="Ảnh đại diện" 
      />
      <div className="post-input">
        <input 
          value={text}
          type="text" 
          placeholder='Bạn đang nghĩ gì?'
          required
          onChange={(e) => setText(e.target.value)} 
        />
        <div className="post-option">
          <div 
            className="option"  
            style={{color: "var(--photo)"}}
            onClick={() => imageRef.current.click()}
          >
            <img src={PhotoIcon} alt="Icon ảnh" />
            Ảnh/Video
          </div>
          <button 
            className="button ps-button" 
            onClick={handleClick}
            
          >
           {isPending ? "Đăng..." : "Đăng"} 
          </button>
          <div style={{display: "none"}}>
            <input type="file" ref={imageRef} onChange={handleChange} accept='image/*'/>
          </div>
        </div>
        {img && (
          <div className="preview-image">
            <img 
              src={CloseIcon} 
              alt="Icon X" 
              onClick={() => {
                setImg(null); 
                imageRef.current.value=null;
                }} className='close-icon'
            />
            <img 
              src={img} 
              alt="Ảnh" 
              className='post-image'
            />
          </div>
        )
        }
      </div>
    </div>
  )
}

export default PostArea
