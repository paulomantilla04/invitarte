import { createBrowserRouter } from "react-router";
import App from "./App";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import InvitationTest from "./pages/InvitationTest";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/login", element: <Login /> },
            { 
                path: "/dashboard",
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                )
            },
            {
                path: "/invite", element: <InvitationTest />
            }

        ]
    }
])