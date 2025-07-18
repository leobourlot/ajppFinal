import Button from 'react-bootstrap/Button';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { MiCard } from './MiCard';
import { SponsorsProp } from '../Props/sponsorsProp';
// import { NoticiasContenido } from './NoticiasContenido';
import './Noticias.css';

export function Noticias() {

    const [noticias, setNoticias] = useState([]);
    const [pagina, setPagina] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 6;



    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'http://localhost:3005';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';


    useEffect(() => {
        buscarNoticias();

    }, [pagina]);

    const buscarNoticias = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/v1/noticia/noticiasPaginadas`, {
                params: {
                    pagina,
                    limite: itemsPerPage
                }
            });
            const nuevasNoticias = response.data.dato;
            // console.log('noticias es: ', nuevasNoticias)
            
            if (nuevasNoticias.length > 0) {
                setNoticias(prevNoticias => {
                    if (pagina === 1) {
                        return nuevasNoticias;
                    } else {
                        // Filtrar noticias duplicadas y agregar solo las nuevas
                        const noticiasFiltradas = nuevasNoticias.filter(nuevaNoticia => (
                            !prevNoticias.some(prevNoticia => prevNoticia.idNoticia === nuevaNoticia.idNoticia)
                        ));
                        return [...prevNoticias, ...noticiasFiltradas];
                    }
                });
                setHasMore(nuevasNoticias.length === itemsPerPage);
                
            } else {
                setHasMore(false);
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    const cargarMasNoticias = () => {
        setPagina(prevPagina => prevPagina + 1);
    };

    // useEffect(() => {
    //     if (pagina > 1) {
    //         buscarNoticias();
    //     }
    // }, [pagina]);

    return (
        <>
            <div className='contenedorNoticias'>
                <div className='container'>
                    <div className="container-fluid">
                        <section className="noticias">
                            <h2>Noticias</h2>
                            <div className="cardsNoticias">
                                <div className='row'>

                                    {
                                        noticias.length > 0 ? (
                                            noticias.map((item, index) => (
                                                <div key={index} className='col-xl-4 col-md-6 col-sm-12'>
                                                    <MiCard noticia={item} />
                                                </div>
                                            ))
                                        ) : (
                                            <p>No hay noticias disponibles.</p>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                hasMore && (
                                    <div className="text-center mt-4">
                                        <Button onClick={cargarMasNoticias}>Cargar más noticias</Button>
                                    </div>
                                )
                            }
                        </section>
                        <div className='row'>
                            <SponsorsProp />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}