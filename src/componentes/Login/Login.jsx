// propio de reactjs
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { SponsorsProp } from '../Props/sponsorsProp'

import axios from 'axios';
import './Login.css';

export function Login() {
    
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com/api/v1/';
    // const baseURL = 'https://servidorajpp.onrender.com/api/v1/';
    // const baseURL = 'http://localhost:3005/api/v1/';
    const baseURL = 'https://api.srv805858.hstgr.cloud/api/v1/';


    const navigate = useNavigate();
    const [formularioLogin, setFormularioLogin] = useState({ dni: '', clave: '' });
    const [loading, setLoading] = useState(false); // Estado para controlar la visibilidad del spinner

    const { setUserData } = useContext(UserContext);

    const [enviandoFormulario, setEnviandoFormulario] = useState(false);


    useEffect(() => {
        const storedToken = localStorage.getItem('token');

    }, [setUserData]);

    const enviarInformacion = async (e) => {
        e.preventDefault();
        setEnviandoFormulario(true); // Deshabilitar el botón de login
        // console.log('loading antes del set: ', loading);
        setLoading(true); // Mostrar spinner al iniciar sesión
        // console.log('loading despues del set: ', loading);
        // console.log('formulario antes del post login es: ', formularioLogin)
        axios.post(baseURL + 'auth/login', formularioLogin)
            .then(res => {
                setLoading(false); // Ocultar spinner al obtener respuesta
                // console.log('Login successful');
                if (res.status === 200) {
                    // console.log(res.data);

                    // con los datos del usuario seteo el contexto del usuario, 
                    // también seteo el token para utilizarlo en las consultas al back
                    // localStorage.setItem('token', res.data.token);

                    setUserData({ user: res.data.usuario, token: res.data.token });
                    navigate('/privado/');
                } else {
                    setLoading(false); // Ocultar spinner en caso de error
                    // console.log('Login failed'); // Añade un mensaje de error
                }
                // tarea, qué pasa si no se loguea correctemente?!
            })
            .catch(error => {
                // console.log(error.response.data);
                alert(error.response.data.msj.message);
            })
            .finally(() => {
                setEnviandoFormulario(false); // Vuelve a habilitar el botón de registro
            });
    }

    // const cerrarSesion = () => {
    //     // Eliminar el token del almacenamiento local del navegador
    //     localStorage.removeItem('token');
    //     // Limpiar el contexto del usuario
    //     setUserData(null);
    // }

    return (
        <>
            <div className="login-container">
                <div className='container'>
                    <div className='row' >
                        <div className='contenedorFormulario'>
                            <div className="login-form">
                                <Form onSubmit={e => enviarInformacion(e)}>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicUsuario">
                                                <Form.Label id='labelLogin'>Usuario</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={(e) => setFormularioLogin({ ...formularioLogin, dni: e.target.value })}
                                                    value={formularioLogin.dni}
                                                    placeholder='Ingrese su usuario'
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>


                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicClave">
                                                <Form.Label id='labelLogin'>Clave</Form.Label>
                                                <Form.Control type="password"
                                                    onChange={(e) => setFormularioLogin({ ...formularioLogin, clave: e.target.value })}
                                                    value={formularioLogin.clave}
                                                    placeholder='Ingrese su clave'
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <Button 
                                    id='botonInicioSesion' 
                                    variant="primary" 
                                    type="submit"
                                    disabled={enviandoFormulario}>
                                        {enviandoFormulario ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                    </Button>


                                </Form>
                                <div className='row'>
                                    <div className="col-md-12">
                                        <div className='botonRegistro'>
                                            <p>¿No tenés usuario?</p>
                                            <Link to="/registro" className='botonR'>Registrate</Link>
                                        </div>
                                        {loading && <Button variant="warning" disabled>
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                            Espere un momento por favor...
                                        </Button>} {/* Mostrar spinner si loading es true */}

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <SponsorsProp />
                    </div>
                </div>
            </div>
        </>
    );
}