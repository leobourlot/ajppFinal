import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { ProtectedElement } from '../ProtectedElement/ProtectedElement';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import './Administrador.css'
import axios from 'axios';

import { Button } from 'react-bootstrap';

const Administrador = () => {

    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    const irATorneo = () => {
        navigate(`/privado/torneo`);
    };

    const irAInicio = () => {
        navigate(`/privado/`);
    };

    const irAInscriptos = () => {
        navigate(`/privado/verInscriptos`);
    };

    const irAMisTorneos = () => {
        navigate(`/privado/misTorneos`);
    };

    const irAJugadores = () => {
        navigate(`/privado/jugadores`);
    };

    const irAImagenes = () => {
        navigate(`/privado/imagenes`);
    };

    const irAGestionarNoticias = () => {
        navigate(`/privado/gestionarNoticias`);
    };
    const irAOrganizadores = () => {
        navigate(`/privado/organizadores`);
    };

    return (userData.user ? (
        <>
            <div className='contenedorAdministrador'>
                <div className='container mt-3 mb-1 mb-5'>
                    <h1 id='bienvenida'>Bienvenido {userData.user.nombre + ' ' + userData.user.apellido}</h1>

                    <ProtectedElement mustBeAdministrador={true}>
                        <div className='row'>
                            <Col sm={12} lg={4}>
                                <Card onClick={irATorneo}>
                                    <Card.Body id='cardTorneos'>
                                        <Card.Title>Creación y modificación de torneos</Card.Title>
                                        {/* <Card.Text><h3>{futbolistasTotales}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={12} lg={4}>
                                <Card onClick={irAInscriptos}>
                                    <Card.Body id='cardInscriptos'>
                                        <Card.Title>Ver inscriptos a torneo</Card.Title>
                                        {/* <Card.Text><h3>{convocatorias}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={12} lg={4}>
                                <Card onClick={irAMisTorneos}>
                                    <Card.Body id='cardMisTorneos'>
                                        <Card.Title>Ver mis inscripciones a torneos</Card.Title>
                                        {/* <Card.Text><h3>{convocatorias}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </div>
                        <div className='row'>
                            <Col sm={12} lg={4}>
                                <Card onClick={irAJugadores}>
                                    <Card.Body id='cardJugadores'>
                                        <Card.Title>Ver jugadores</Card.Title>
                                        {/* <Card.Text><h3>{convocatorias}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={12} lg={4}>
                                <Card onClick={irAImagenes}>
                                    <Card.Body id='cardImagenes'>
                                        <Card.Title>Actualizar imágenes y archivos</Card.Title>
                                        {/* <Card.Text><h3>{convocatorias}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={12} lg={4}>
                                <Card onClick={irAGestionarNoticias}>
                                    <Card.Body id='cardNoticias'>
                                        <Card.Title>Gestionar noticias</Card.Title>
                                        {/* <Card.Text><h3>{convocatorias}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </div>
                        <div className='row'>
                            <Col sm={12} lg={4}>
                                <Card onClick={irAOrganizadores}>
                                    <Card.Body id='cardOrganizadores'>
                                        <Card.Title>Gestionar organizadores</Card.Title>
                                        {/* <Card.Text><h3>{convocatorias}</h3></Card.Text> */}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </div>

                    </ProtectedElement>
                    <ProtectedElement mustBeJugador={true}>

                        <div className='row'>
                            <div className="col-md-10">
                                <div className='mi-div-estilo'>
                                    <h3>Inscripciones</h3>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <Button variant="primary" onClick={irAInicio}>Ver</Button>
                            </div>
                        </div>

                    </ProtectedElement>
                </div>
            </div>
        </>
    ) : <></>);
};

export { Administrador };