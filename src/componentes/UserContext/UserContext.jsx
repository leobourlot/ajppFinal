import { createContext, useState, useEffect } from 'react';

const UserContext = createContext({
    userData: { user: null }
});

const UserProvider = ({ children }) => {

    // datos del usuario logueado
    // const [userData, setUserData] = useState(null);
    const [userData, setUserData] = useState(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : null;
    });

    // Cada vez que userData cambie, lo actualizamos en localStorage
    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            localStorage.removeItem('userData');
        }
    }, [userData]);

    const isLoggedIn = () => {
        return (userData != null && userData.user != null);
    }

    const esAdministrador = () => {
        return (userData != null && userData.user.tipoUsuario === 1);
    }

    const esJugador = () => {
        return (userData != null && userData.user.tipoUsuario === 0);
    }

    return (
        <UserContext.Provider value={{ userData, setUserData, isLoggedIn, esAdministrador, esJugador }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };