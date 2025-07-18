// src/components/NewsDetail.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { SponsorsProp } from '../Props/sponsorsProp';
import Carousel from 'react-bootstrap/Carousel';

import './Noticias.css';

export function NoticiasContenido() {

    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'http://localhost:3005';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';



    const { id } = useParams();
    const [noticia, setNoticia] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const verNoticia = async () => {
        try {
            const resp = await axios.get(baseURL + '/api/v1/noticia/noticias/' + id)
            // console.log('resp.data.dato es: ', resp.data.dato);
            const noticiaData = resp.data.dato;

            // console.log('noticiaData es: ', noticiaData)
            // console.log('noticiasData.imagenes es: ', noticiaData[0].imagenes)
            // console.log('noticiasData.contenidos es: ', noticiaData[0].contenidos)
            // console.log('noticiasData.descripcionesImagenes es: ', noticiaData[0].descripcionesImagenes)


            // Verificar y convertir las propiedades serializadas de JSON a arrays si existen
            if (noticiaData[0].imagenes || noticiaData[0].contenidos || noticiaData[0].descripcionesImagenes || noticiaData[0].creador) {
                noticiaData[0].imagenes = JSON.parse(noticiaData[0].imagenes);
                noticiaData[0].contenidos = JSON.parse(noticiaData[0].contenidos)
                noticiaData[0].descripcionesImagenes = JSON.parse(noticiaData[0].descripcionesImagenes);
            }

            // console.log()

            setNoticia(noticiaData);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false);

        }
    }

    useEffect(() => {
        verNoticia();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!noticia) return <div>No se encontró la noticia</div>;

    // Filtrar las imágenes que existen
    const imagenes = noticia[0].imagenes.filter(url => url);
    const descripcionesImagenes = noticia[0].descripcionesImagenes.filter((desc, index) => noticia[0].imagenes[index]);

    const formattedDate = new Date(noticia[0].fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <>
            <div className="noticiasContenido">
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='tituloContenido'>
                                <h1>{noticia[0].titulo}</h1>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='descripcionNoticia'>
                                <p>{noticia[0].descripcion}</p>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <p className='fechaPublicacion'>Publicada el {formattedDate} por {noticia[0].creador} </p>
                    </div>
                    <div className='row'>

                        {/* <figure className='imagenContenido'>
                                <img src={noticia[0].urlImagen} alt={noticia[0].titulo} />
                                <figcaption>{noticia[0].descripcionImagen}</figcaption>
                            </figure> */}
                        <Carousel interval={null} className='carrousel'>
                            {imagenes.map((url, index) => (
                                <Carousel.Item key={index} id='imgCarrousel'>
                                    <img
                                        className="imagenesCarrousel"
                                        src={url}
                                        alt={descripcionesImagenes[index]}
                                        fetchpriority="high"
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </div>
                    <div className='row'>

                        <div className='textoNoticia'>
                            {noticia[0].contenidos.map((contenido, index) => (
                                <p key={index}>{contenido}</p>
                            ))}
                        </div>
                    </div>


                    <div className='row'>
                        <SponsorsProp />
                    </div>
                </div>
            </div >

        </>
    );
}
