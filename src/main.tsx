import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";

// Main App component
const App = () => {
  return <RouterProvider router={router} />;
};

const router = createBrowserRouter([
  // Route for all pages that SHOULD have a Navbar and Footer
  {
    path: "/",
    children: [
      {
        index: true, // Default route for "/"
        element: <ComingSoon />,
      },

      {
        path: "production/full-website",
        element: <Home />,
      },
    ],
  },
  // Separate, top-level route for the Admin page WITHOUT the Layout
  // {
  //   path: "infinite",
  //   element: <InfiniteGrid />,
  // },
]);

createRoot(document.getElementById("root")!).render(<App />);
