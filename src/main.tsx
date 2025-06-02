import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { Toaster } from 'sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <AuthContextProvider>
        <RouterProvider router={router} />
        <Toaster/>
      </AuthContextProvider>
    </>
  </StrictMode>,
)