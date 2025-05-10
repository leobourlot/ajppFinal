import Button from 'react-bootstrap/Button';
import { Modal } from 'react-bootstrap';
import { CalendarioProp } from '../Props/CalendarioProp'
import { SponsorsProp } from '../Props/sponsorsProp'

import './Calendario.css';

//hook de react
import { useEffect, useState } from "react";

export function Calendario() {
    const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
    const [subtituloModal, setSubtituloModal] = useState("");

    const modalFoto = (foto, subtitulo) => {
        setFotoSeleccionada(foto);
        setSubtituloModal(subtitulo)
    };

    // const imgCalendario1 = 'https://ajpp.s3.eu-north-1.amazonaws.com/calendario1.png'
    // const imgCalendario2 = 'https://ajpp.s3.eu-north-1.amazonaws.com/calendario2.png'
    // const imgCalendario3 = 'https://ajpp.s3.eu-north-1.amazonaws.com/calendario3.png'
    const baseURL = 'https://api.srv805858.hstgr.cloud';

    const imgCalendario1  = `${baseURL}/archivos/calendario1.png`;
    const imgCalendario2  = `${baseURL}/archivos/calendario2.png`;
    const imgCalendario3  = `${baseURL}/archivos/calendario3.png`;


    return (
        <>
            <div className='contenedorCalendario'>
                <div className='calendario'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-4 col-sm-12'>
                                <div className='contenedorFotoCalendario'>
                                    <CalendarioProp imagen={imgCalendario1} modalFoto={modalFoto} />
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div className='contenedorFotoCalendario'>
                                    <CalendarioProp imagen={imgCalendario2} modalFoto={modalFoto} />
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-12'>
                                <div className='contenedorFotoCalendario'>
                                    <CalendarioProp imagen={imgCalendario3} modalFoto={modalFoto} />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <SponsorsProp />
                        </div>
                    </div>

                </div>

            </div>

            <Modal className='imgModalContainer' show={fotoSeleccionada !== null} onHide={() => setFotoSeleccionada(null)}>
                <Modal.Header closeButton>
                    {subtituloModal && <Modal.Title>{subtituloModal}</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {fotoSeleccionada && (<img src={fotoSeleccionada} alt="Calendario de torneos" className="imgModal" />)}
                </Modal.Body>
            </Modal>
        </>
    )
}