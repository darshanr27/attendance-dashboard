import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Spinner from "./Spinner";

function ProtectedRoute({children, role}) { 
    const [status, setStatus] = useState("loading");
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        axiosInstance.get('/auth/me')
        .then(res=> {
            setUserRole(res.data.role);
            setStatus('done');
        })
        .catch(() => setStatus('Unauthorized'));
    }, []);

    if (status === 'loading') return <Spinner />
    if (status === 'unauthorized') return <Navigate to="/login" />;
    if (role && userRole !== role) return <Navigate to="/login" />;

    return children;
}

export default ProtectedRoute;