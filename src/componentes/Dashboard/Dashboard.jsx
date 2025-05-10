import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext/UserContext';
import { ProtectedElement } from '../ProtectedElement/ProtectedElement';
import './Dashboard.css'
import axios from 'axios';

import { Button } from 'react-bootstrap';

const Dashboard = () => {
    
    const navigate = useNavigate();
    const { userData, setUserData } = useContext(UserContext);

    const [estadistica, setEstadistica] = useState(null);

    useEffect(() => {
        if (userData.user.tipoUsuario === 0) {
            buscarEstadistica();
        }
    }, []);

    const irATorneo = () => {
        navigate(`/privado/torneo`);
    };

    const irAInicio = () => {
        navigate(`/privado/`);
    };

    const irATitulares = () => {
        navigate(`/privado/titulares`);
    };

    const irAEstadistica = () => {
        navigate(`/privado/estadistica`);
    }

    return (userData.user ? (
        <>
            <div className='container mt-3 mb-1 mb-5'>
                <h1>Bienvenido {userData.user.nombre}!</h1>

                <ProtectedElement mustBeAdministrador={true}>
                    <div className='row'>
                        <div className="col-md-10">
                            <div className='mi-div-estilo'>
                                <h3>Torneo</h3>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <Button variant="primary" onClick={irATorneo}>Ver</Button>
                        </div>
                    </div>

                    {/* <div className='row'>
                        <div className="col-md-10">
                            <div className='mi-div-estilo'>
                                <h3>Jugadores</h3>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <Button variant="primary" onClick={irAJugadores}>Ver</Button>
                        </div>
                    </div>

                    <div className='row'>
                        <div className="col-md-10">
                            <div className='mi-div-estilo'>
                                <h3>Titulares</h3>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <Button variant="primary" onClick={irATitulares}>Ver</Button>
                        </div>
                    </div> */}
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
        </>
    ) : <></>);
};

export { Dashboard };