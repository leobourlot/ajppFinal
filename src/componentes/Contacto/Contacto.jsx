import { useState } from 'react';
import './Contacto.css';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { SponsorsProp } from '../Props/sponsorsProp';




export function Contacto() {

    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com/api/v1/publico/contacto';
    // const baseURL = 'https://servidorajpp.onrender.com/api/v1/publico/contacto';
    const baseURL = 'https://api.srv805858.hstgr.cloud/api/v1/publico/contacto';


    const [formulario, setFormulario] = useState({ nombre: '', apellido: '', email: '', telefono: '', mensaje: '' });

    const enviarInfo = async (e) => {
        e.preventDefault();
        // console.log(formulario);
        axios.post(baseURL, formulario)
            .then(res => {
                // console.log(res);
                alert(res.data.respuesta);
                e.target.reset();
            })
            .catch(error => {
                // console.log(formulario);
                console.log('Error en el post ', error);
            })
    }

    return (
        <div className='contenedorContacto'>

            <div className='container'>
                <div className='row'>


                    <div className='col-md-6'>

                        <div className='contenedorCard'>
                            <Card>

                                <Card.Body>
                                    <Card.Title>Ingresa tu consulta</Card.Title>
                                </Card.Body>

                                <Form onSubmit={e => enviarInfo(e)}>
                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text" required onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })} />

                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control type="text" required onChange={(e) => setFormulario({ ...formulario, apellido: e.target.value })} />

                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" required onChange={(e) => setFormulario({ ...formulario, email: e.target.value })} />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control type="text" required onChange={(e) => setFormulario({ ...formulario, telefono: e.target.value })} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Mensaje</Form.Label>
                                        <Form.Control as="textarea" rows={4} placeholder='Introduzca su mensaje' onChange={(e) => setFormulario({ ...formulario, mensaje: e.target.value })} />
                                    </Form.Group>

                                    <Button id='boton' variant="primary" type="submit">
                                        Enviar
                                    </Button>
                                </Form>

                            </Card>
                        </div>



                    </div>

                    <div className='col-md-6'>
                        <div className="container-contacto">
                            <div className="info-contacto">
                                <h1 id='nombreEmpresa'>AJPP - Asociación de Jugadores Profesionales de Padel</h1>
                                <div className='datos'>
                                    <h2>Contacto</h2>
                                    <p className="p-info">Email: ajppargentina@gmail.com</p>
                                </div>
                                <div className='tituloRedes'>
                                    <h2>Redes Sociales</h2>
                                </div>
                                <div className='linksRedes'>
                                    <a href="https://www.facebook.com/ajppargentina/"><i className="fab fa-facebook"></i></a>
                                    <a href="https://www.youtube.com/@ajppargentina341"><i className="fab fa-youtube"></i></a>
                                    <a href="https://www.instagram.com/ajppargentina/"><i className="fab fa-instagram"></i></a>
                                    <a href="https://twitter.com/ajppargentina"><i className="fab fa-twitter"></i></a>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div className='row'>
                    <SponsorsProp/>
                </div>
            </div>
        </div>
    );
}


