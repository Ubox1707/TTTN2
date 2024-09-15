import './App.css';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import Home from './pages/Home/Home.jsx'
import UserProfile from './pages/UserProfile/UserProfile.jsx'
import Register from './pages/Auth/Register/Register.jsx'
import Login from './pages/Auth/Login/Login.jsx'
import Notification from './pages/Notification/Notification.jsx';

import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import Menu from './components/Menu/Menu.jsx';
import RightSide from './components/RightSide/RightSide.jsx'




function App() {
  const { data: authUser, isLoading } = useQuery({
		
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/auth/me")
				const data = await res.json()
				if (data.error) return null
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong")
				}
			
				return data;
			} catch (error) {
				throw new Error(error)
			}
		},
		retry: false,
	})

  return (
    <div className="App">
      {authUser && <Menu/>}
      <Routes>
        <Route 
        path="/" 
        element={authUser ? <Home/> : <Navigate to="/login"/>} 
        />
        <Route 
        path="/signup" 
        element={!authUser ? <Register/> : <Navigate to="/"/>} 
        /> 
        <Route 
        path="/login" 
        element={!authUser ? <Login/> : <Navigate to="/"/>} 
        />
        <Route 
        path='/notifications' 
        element={authUser ? <Notification/> : <Navigate to="/login"/>} />
        <Route 
        path='/profile/:username' 
        element={authUser ? <UserProfile/> : <Navigate to="/login"/>} />
       
      </Routes>
      {authUser && <RightSide/>}
      <Toaster/>
      
    </div>
  );
}

export default App;
