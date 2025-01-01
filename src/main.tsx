import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);