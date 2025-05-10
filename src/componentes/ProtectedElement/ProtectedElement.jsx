import { useContext } from 'react';
import { UserContext } from '../UserContext/UserContext';

const ProtectedElement = ({mustBeAdministrador,mustBeJugador, children }) => {

    const { isLoggedIn, esAdministrador, esJugador } = useContext(UserContext);

    if (!isLoggedIn() || (mustBeAdministrador && !esAdministrador())) {
        return <></>;
    }

    if (!isLoggedIn() || (mustBeJugador && !esJugador())) {
        return <></>;
    }
    return children;
};
export { ProtectedElement };