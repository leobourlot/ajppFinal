import Button from 'react-bootstrap/Button';
// import rankingCompleto from '../Archivos/rankingCompleto.pdf';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'; // Importa el icono faBars
// import { SponsorsProp } from '../Props/sponsorsProp'
import './Ranking.css';

//hook de react
import { useEffect, useState } from "react";

export function Ranking() {

    const logoPdf = <FontAwesomeIcon icon={faFilePdf} size="xl" style={{ color: "#006c87", }} />

    const abrirPdf = (url) => {
        window.open(url, '_blank');
    };

    // const urlRankingCompleto = 'https://ajpp.s3.eu-north-1.amazonaws.com/rankingCompleto.pdf';
    const baseURL = 'https://api.srv805858.hstgr.cloud';
    const urlRankingCompleto = `${baseURL}/archivos/rankingCompleto.pdf`;

    const clicEnlacePdf = () => {
        abrirPdf(urlRankingCompleto);
    };

    const imgRankingCuadrado = `${baseURL}/archivos/ranking.png`
    const imgRankingCelular = `${baseURL}/archivos/rankingVertical.png`

    return (
        <>
            <div className='contenedorRanking'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-7 col-sm-12' id='fotoDeRanking'>
                            <div className='ranking'>
                                <div className='container'>
                                    <div className='contenedorFotoRanking'>
                                        {/* <img className="img-fluid fotoRanking"
                                            src={require("../Img/rankingCuadrado2.jpg")}
                                            onClick={() => modalFoto(require("../Img/rankingCuadrado2.jpg"), 'Ranking AJPP')}
                                            alt='Ranking' /> */}
                                        <img className="img-fluid fotoRanking d-none d-md-block"
                                            id='fotoRanking'
                                            src={imgRankingCuadrado}
                                            alt='Ranking' />
                                        {/* Utiliza la clase d-md-none para ocultar la imagen en pantallas medianas y grandes */}
                                        <img className="img-fluid fotoRanking d-md-none"
                                            id='fotoRankingCelular'
                                            src={imgRankingCelular}
                                            alt='Ranking' />

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5 col-sm-12'>
                            <div className='contenedorRankingCompleto'>
                                <div className='tituloRankingCompleto'>
                                    <h4>
                                        Para ver el ranking completo, hacé clic en el siguiente enlace:
                                    </h4>
                                </div>
                                <Button className='rankingCompleto'
                                    variant="warning"
                                    onClick={() => clicEnlacePdf('rankingCompleto')}
                                    target="_blank"> {logoPdf} Ranking completo</Button>{' '}

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <SponsorsProp />
                    </div>
                </div>
            </div>
            {/* <Modal className='imgModalContainer' show={fotoSeleccionada !== null} onHide={() => setFotoSeleccionada(null)}>
                <Modal.Header closeButton>
                    {subtituloModal && <Modal.Title>{subtituloModal}</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    {fotoSeleccionada && (<img src={fotoSeleccionada} alt="Calendario de torneos" className="imgModal" />)}
                </Modal.Body>
            </Modal> */}
        </>

    )
}
import { ResponsiveEmbed } from 'react-bootstrap'; import { SponsorsProp } from '../Props/sponsorsProp';

