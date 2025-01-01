import { createBrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Welcome from "@/pages/Welcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/welcome",
    element: <Welcome />,
  },
]);

export default router;