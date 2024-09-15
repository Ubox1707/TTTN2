import React from 'react'
import ReactDOM from 'react-dom/client'
import './fonts/fonts.css'
import App from './App'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
		},
	},
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path = "*" element = {<App/>} />
      </Routes>
      </QueryClientProvider> 
    </BrowserRouter>
  </React.StrictMode>

    
  
);

