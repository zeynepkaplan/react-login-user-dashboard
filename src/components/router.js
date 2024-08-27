import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./login";
import UserPage from "./user";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace={true} />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/user",
        element: <UserPage />,
    },
]);


