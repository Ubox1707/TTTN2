import React, {useRef} from 'react'
import Logo from '../../img/logo.png'
import SearchIcon from "../../img/search-icon.png"
import './search.css'

const Search = () => {
  const inputRef = useRef(null);
  const handleInput = () =>{
    inputRef.current.focus();
  }
  return (
    <div className='search-bar'>
      <div className="top-bar">
        <img className='logo' src={Logo} alt="Một con mèo pixel" />
        <h3 className='text-logo' style={{ fontFamily: 'Tittle, sans-serif' }}>Konism</h3>
      </div>
      <div className="search">
        <img src={SearchIcon} alt="Kính lúp" className="search-icon" onClick={handleInput} />
        <input className='search-input' type="text" placeholder='Tìm kiếm...' ref={inputRef} />
      </div>
    </div>
  )
}

export default Search
