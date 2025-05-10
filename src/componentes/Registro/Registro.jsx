// propio de reactjs
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import axios from 'axios';
import './Registro.css';
import { SponsorsProp } from '../Props/sponsorsProp';

export function Registro() {
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com/api/v1/';
    const baseURL = 'https://api.srv805858.hstgr.cloud/api/v1/';
    

    // const baseURL = 'https://servidorajpp.onrender.com/api/v1/';
    const navigate = useNavigate();
    const [formulario, setFormulario] = useState({      // PARA JUGADORES
        dni: '',
        apellido: '',
        nombre: '',
        fechaNac: '',
        correoElectronico: '',
        telefono: '',
        localidad: '',
        clave: '123456789'
    });

    // const [formulario, setFormulario] = useState({      PARA ADMINISTRADORES
    //     dni: '', 
    //     apellido: '', 
    //     nombre: '',
    //     fechaNac: '', 
    //     correoElectronico: '', 
    //     telefono: '', 
    //     localidad: '', 
    //     clave: 'marupaidami' });

    const { setUserData } = useContext(UserContext);

    const [enviandoFormulario, setEnviandoFormulario] = useState(false);



    const enviarInformacion = async (e) => {
        e.preventDefault();
        setEnviandoFormulario(true); // Deshabilitar el botón de registro
        // console.log('formulario antes del post es: ', formulario)
        axios.post(baseURL + 'registro/nuevo', formulario)
            .then(res => {
                // console.log('Registro correcto');
                if (res.status === 201) {
                    // console.log(res.data);
                    // console.log('Registro correcto');
                    alert('Registro correcto. Por favor, inicie sesión.')

                    // axios.post(baseURL + '')
                    // con los datos del usuario seteo el contexto del usuario, 
                    // también seteo el token para utilizarlo en las consultas al back
                    // setUserData({ user: res.data.usuario, token: res.data.token });
                    navigate('/login');
                } else {
                    console.log('Registro fallido'); // Añade un mensaje de error
                }
                // tarea, qué pasa si no se loguea correctemente?!
            })
            .catch(error => {
                if (error.response.status === 400) {
                    alert(error.response.data.msj); // Muestra el mensaje de error enviado desde el servidor
                } else {
                    console.log('Error:', error.message);
                }
            })
            .finally(() => {
                setEnviandoFormulario(false); // Vuelve a habilitar el botón de registro
            });
    }

    const primeraMayuscula = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <>
            <div className="registro-container">
                <div className='container'>
                    <div className='row'>
                        <div className='containerRegistro'>
                            <div className="registro-form">
                                <Form onSubmit={e => enviarInformacion(e)}>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicDni">
                                                <Form.Label id='labelLogin'>DNI (sin puntos)</Form.Label>
                                                <Form.Control type="number"
                                                    onChange={(e) => {
                                                        const value = e.target.value.slice(0, 8);
                                                        setFormulario({ ...formulario, dni: value })
                                                    }}
                                                    value={formulario.dni}
                                                    min="1000000"
                                                    // pattern="[0-9]{1,8}"
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicApellido">
                                                <Form.Label id='labelLogin'>Apellido</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value.toUpperCase() })}
                                                    value={formulario.apellido}
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicNombre">
                                                <Form.Label id='labelLogin'>Nombre</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={(e) => setFormulario({ ...formulario, nombre: primeraMayuscula(e.target.value) })}
                                                    value={formulario.nombre}
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicFecha">
                                                <Form.Label id='labelLogin'>Fecha de nacimiento</Form.Label>
                                                <Form.Control type="date"
                                                    onChange={(e) => setFormulario({ ...formulario, fechaNac: (e.target.value) })}
                                                    value={formulario.fechaNac}
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicCorreo">
                                                <Form.Label id='labelLogin'>Correo electrónico</Form.Label>
                                                <Form.Control type="email"
                                                    onChange={(e) => setFormulario({ ...formulario, correoElectronico: e.target.value })}
                                                    value={formulario.correoElectronico}
                                                    required />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicLocalidad">
                                                <Form.Label id='labelLogin'>Nº de contacto</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })}
                                                    value={formulario.telefono} />
                                            </Form.Group>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="col-md-12">
                                            <Form.Group className="mb-3" controlId="formBasicLocalidad">
                                                <Form.Label id='labelLogin'>Localidad</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={(e) => setFormulario({ ...formulario, localidad: e.target.value })}
                                                    value={formulario.localidad} />
                                            </Form.Group>
                                        </div>
                                    </div>

                                    <div className='contenedorBotonRegistrarme'>
                                        <Button
                                            id='botonRegistro'
                                            variant="primary"
                                            type="submit"
                                            disabled={enviandoFormulario}>

                                            {enviandoFormulario ? 'Enviando...' : 'Registrarme'}
                                        </Button>
                                    </div>
                                </Form>
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