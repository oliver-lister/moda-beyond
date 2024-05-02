import { createBrowserRouter } from "react-router-dom";
import AddProduct from "./routes/AddProduct/AddProduct.tsx";
import ViewProducts from "./routes/ViewProducts/ViewProducts.tsx";
import EditProduct from "./routes/EditProduct/EditProduct.tsx";
import Layout from "./routes/Layout.tsx";
import ErrorPage from "./routes/error-page.tsx";
import Dashboard from "./routes/Dashboard/Dashboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        path: "/addproduct",
        element: <AddProduct />,
      },
      {
        path: "/viewproducts",
        element: <ViewProducts />,
      },
      {
        path: "/editproduct",
        element: <EditProduct />,
        children: [
          {
            path: ":productId",
            element: <EditProduct />,
          },
        ],
      },
    ],
  },
]);

export default router;
