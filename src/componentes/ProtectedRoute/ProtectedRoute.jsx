import { useContext } from 'react';
import { Navigate } from "react-router-dom";
import { UserContext } from '../UserContext/UserContext';


const ProtectedRoute = ({ mustBeAdministrador, mustBeJugador, children }) => {

    const { isLoggedIn, esAdministrador, esJugador } = useContext(UserContext);

    if (!isLoggedIn() || (mustBeAdministrador && !esAdministrador())) {
        return <Navigate to="/" replace />;
    }
    
    if (!isLoggedIn() || (mustBeJugador && !esJugador())) {
        return <Navigate to="/" replace />;
    }

    return children;
};
export { ProtectedRoute };