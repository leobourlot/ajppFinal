import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { SponsorsProp } from '../Props/sponsorsProp'
// import AWS from 'aws-sdk';

import './Inicio.css';

//hook de react
import { useEffect, useState } from "react";

export function Inicio() {
    

    const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
    const [subtituloModal, setSubtituloModal] = useState("");

    // const url = "https://ajpp.s3.eu-north-1.amazonaws.com/proximoTorneo.png";
    // const url2 = "https://ajpp.s3.eu-north-1.amazonaws.com/proximoTorneo2.png";
    const baseURL = 'https://api.srv805858.hstgr.cloud';


    const url  = `${baseURL}/archivos/imagenTorneo.png`;
    const url2 = `${baseURL}/archivos/imagenTorneo2.png`;

    const modalFoto = (foto, subtitulo) => {
        setFotoSeleccionada(foto);
        setSubtituloModal(subtitulo)
    };


    return (
        <>
            <div className="banner-container">
                <div className="banner">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='textoCircuito'>
                                    <p> <strong>Circuito AJPP Tour 2025 </strong></p>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <div className="content">
                                    <h3>Próximos torneos AJPP</h3>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 col-sm-12' id='columnaContenedorTorneo'> {/*CUANDO HAY DOS TORNEOS A LA VEZ*/}
                            {/* <div className='col-12' id='columnaContenedorTorneo'> */}
                                <div className="contenedorImagenTorneo" id='torneo1'>
                                    <img className='imagenTorneo'
                                        src={url}
                                        onClick={() => modalFoto(url, 'Próximo torneo')}
                                        width="400"
                                        height="500"
                                        alt="Próximo torneo"
                                        fetchPriority='high' />
                                    {/* <Button className='inscripciones' variant="warning" href='https://forms.gle/GB1AqA3SCag3nZAy8' target="_blank">Inscripciones</Button>{' '} */}
                                </div>
                            </div>
                            <div className='col-md-6 col-sm-12' id='columnaContenedorTorneo'>
                                <div className="contenedorImagenTorneo" id='torneo2'>
                                    <img className='imagenTorneo'
                                        src={url2}
                                        onClick={() => modalFoto(url2, 'Próximo torneo')}
                                        width="400"
                                        height="500"
                                        alt="Próximo torneo"
                                        fetchpriority='high' />
                                </div>
                            </div>

                        </div>
                        <div className='row'>
                            <SponsorsProp />
                        </div>
                    </div>
                </div >
            </div>

            <Modal id='imgModalContainer' show={fotoSeleccionada !== null} onHide={() => setFotoSeleccionada(null)}>
                <Modal.Header closeButton>
                    {subtituloModal && <Modal.Title>{subtituloModal}</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {fotoSeleccionada && (<img src={fotoSeleccionada} alt="Calendario de torneos" className="imgModal" height="700" width="auto" />)}
                </Modal.Body>
            </Modal>
        </>
    )
}