import React, { useContext, useState } from 'react'; // Asegúrate de importar useState
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; // Importa el icono faBars
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import logo from '../Img/logo.svg';

export function Header() {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const accion = () => {
        navigate('/login');
    }

    const irInicio = () => {
        setUserData(null);
        {<Link to="/"/>};
    };

    const [menuOpen, setMenuOpen] = useState(false); // Estado para controlar si el menú está abierto

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Cambia el estado del menú
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <header>
                <div className="logo" onClick={irInicio}>
                    <img src={logo} alt="logoAJPP" />
                </div>
                <div className="content-menu">
                    <nav>
                        <button className="menu-toggle" onClick={toggleMenu}>
                            <FontAwesomeIcon icon={faBars}/>
                        </button>
                        <ul className={`menu ${menuOpen ? "show" : ""}`}>
                            <li><Link to="/" onClick={closeMenu}>Inicio</Link></li>
                            <li><Link to="/laAsociacion" onClick={closeMenu}>La asociación</Link></li>
                            <li><Link to="/noticias" onClick={closeMenu}>Noticias</Link></li>
                            <li><Link to="/calendario" onClick={closeMenu}>Calendario</Link></li>
                            <li><Link to="/ranking" onClick={closeMenu}>Ranking</Link></li>
                            <li><a href='https://www.padelnetwork.com/ajpp/circuito-padelnetwork/el-ascenso/' target="_blank" rel="noopener noreferrer" onClick={closeMenu}>AJPP Ascenso</a></li>
                            <li><Link to="/contacto" onClick={closeMenu}>Contacto</Link></li>
                            {/* <li><Link to="https://forms.gle/GB1AqA3SCag3nZAy8" id='linkInscripciones' target="_blank" rel="noopener noreferrer" onClick={closeMenu}>Inscripciones</Link></li> */}
                            {userData && (
                                <li id='linkInscripciones'><Link to="/privado/inscripcion" onClick={() => closeMenu()}>Inscripciones</Link></li>
                            )}
                            { userData && userData.user.tipoUsuario === 1 && (
                                <li id='linkControles'><Link to="/privado/administrador" onClick={() => closeMenu()}>Controles</Link></li>
                            )}
                            { userData && userData.user.tipoUsuario === 0 && (
                                <li id='linkControles'><Link to="/privado/misTorneos" onClick={() => closeMenu()}>Mis Torneos</Link></li>
                            )}
                            {userData ? (
                                <li><Link to="/" className="login-button" onClick={() => {setUserData(null); closeMenu()}}>Cerrar Sesión</Link></li>
                            ) : (
                                <li><Link to="/login" className="login-button" onClick={() => {setUserData(null); closeMenu()}}>Iniciar Sesión</Link></li>
                            )}
                            
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}