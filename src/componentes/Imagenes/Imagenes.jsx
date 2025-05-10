import { useState } from 'react';
import './Imagenes.css';
import { S3 } from 'aws-sdk';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { SponsorsProp } from '../Props/sponsorsProp';




export function Imagenes() {

    const baseURL = 'https://api.srv805858.hstgr.cloud';

    const s3 = new S3({
        accessKeyId: 'AKIA6ODU7PT7KYXRZXZO',
        secretAccessKey: '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',
        region: 'eu-north-1'
    });


    const [imagen, setImagen] = useState(null);

    const handleImagenChange = (event) => {
        const archivo = event.target.files[0];
        setImagen(archivo);
    };

    const handleGuardarImagenTorneo = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/proximoTorneo',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };
    
    const handleGuardarImagenTorneo2 = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/proximoTorneo2',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };
    
    const handleGuardarImagenCalendario1 = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/calendario1',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };
    
    const handleGuardarImagenCalendario2 = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/calendario2',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };
    
    const handleGuardarImagenCalendario3 = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/calendario3',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };
    
    const handleGuardarImagenRanking = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/ranking',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };
    
    const handleGuardarImagenRankingVertical = async () => {
        if (!imagen) {
            return alert('Seleccioná una imagen primero');
        }
        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/rankingVertical',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };

    const handleGuardarPdfRanking = async () => {
        if (!imagen) {
            return alert('Seleccioná un pdf primero');
        }
        console.log('imagen es: ', imagen)

        const formData = new FormData();
        // El campo 'foto' coincide con upload.single('foto') en tu backend
        formData.append('foto', imagen);

        for (let [k, v] of formData.entries()) console.log(k, v);

        console.log('formData es: ', formData)
        try {
            // Ajusta esta URL si tu backend corre en otro host/prefijo
            const resp = await axios.post(baseURL + '/api/v1/archivo/rankingPdf',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 120000, }
            );
            alert(resp.data.mensaje || 'Imagen cargada correctamente');
        } catch (err) {
            console.error(err);
            alert('Error al subir la imagen al servidor');
        }
    };

    // const handleGuardarImagenTorneo = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'proximoTorneo.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarImagenTorneo2 = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'proximoTorneo2.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarImagenRankingCuadrado = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'ranking.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarImagenRankingCelular = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'rankingVertical.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarImagenCalendario1 = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'calendario1.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarImagenCalendario2 = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'calendario2.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarImagenCalendario3 = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'calendario3.png',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar la imagen:', err);
    //             alert('Error al cargar la imagen.');
    //         } else {
    //             // console.log('Imagen cargada exitosamente:', data);
    //             alert('Imagen cargada exitosamente.');
    //         }
    //     });
    // };

    // const handleGuardarArchivoRanking = () => {
    //     if (!imagen) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: 'rankingCompleto.pdf',
    //         Body: imagen
    //     };

    //     s3.putObject(params, (err, data) => {
    //         if (err) {
    //             console.error('Error al cargar el archivo:', err);
    //             alert('Error al cargar el archivo.');
    //         } else {
    //             // console.log('Archivo cargado exitosamente:', data);
    //             alert('Archivo cargado exitosamente.');
    //         }
    //     });
    // };
    

    return (
        <div className='contenedorImagenes'>
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='tituloCarga'>
                            <h1>Carga de imágenes y archivos</h1>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgProximoTorneo'>
                            <h4>Imagen Próximo torneo</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenTorneo}>Guardar Imagen</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgProximoTorneo'>
                            <h4>Imagen Próximo torneo (cuando hay dos a la vez)</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenTorneo2}>Guardar Imagen</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgRankingCuadrado'>
                            <h4>Imagen Ranking pantallas grandes</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenRanking}>Guardar Imagen</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgRankingCelular'>
                            <h4>Imagen Ranking para celular</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenRankingVertical}>Guardar Imagen</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='archivoRankingCompleto'>
                            <h4>Archivo pdf de Ranking completo</h4>
                            <input type="file" accept=".pdf" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarPdfRanking}>Guardar Archivo</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgCalendario1'>
                            <h4>Imagen Calendario 1</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenCalendario1}>Guardar Imagen</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgCalendario2'>
                            <h4>Imagen Calendario 2</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenCalendario2}>Guardar Imagen</Button>
                        </div>
                    </div>
                    <div className='col-12 col-lg-4 col-md-6 col sm-6'>
                        <div className='imgCalendario3'>
                            <h4>Imagen Calendario 3</h4>
                            <input type="file" accept=".png" onChange={handleImagenChange} />
                            <Button id='botonImgTorneo' onClick={handleGuardarImagenCalendario3}>Guardar Imagen</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <div className='contenedorImagenes'>

        //     <div className='container'>
        //         <div className='row'>
        //             <div className='col-md-6'>
        //                 <Form onSubmit={e => enviarInfo(e)} encType="multipart/form-data">
        //                     <Form.Group className="mb-3" controlId="contenedorImgTorneo">
        //                         <Form.Label id='labelProxTorneo'>Actualizar imagen de próximo torneo</Form.Label>
        //                         <Form.Control type="file" accept=".png"
        //                             onChange={cargarImgTorneo}
        //                         />
        //                     </Form.Group>
        //                     <Button id='boton' variant="primary" type="submit">
        //                         Enviar
        //                     </Button>
        //                 </Form>




        //             </div>

        //             <div className='col-md-6'>
        //                 <div className="container-contacto">
        //                     <div className="info-contacto">
        //                         <h1 id='nombreEmpresa'>AJPP - Asociación de Jugadores Profesionales de Padel</h1>
        //                         <div className='datos'>
        //                             <h2>Contacto</h2>
        //                             <p className="p-info">Email: ajppargentina@gmail.com</p>
        //                         </div>
        //                         <div className='tituloRedes'>
        //                             <h2>Redes Sociales</h2>
        //                         </div>
        //                         <div className='linksRedes'>
        //                             <a href="https://www.facebook.com/ajppargentina/"><i className="fab fa-facebook"></i></a>
        //                             <a href="https://www.youtube.com/@ajppargentina341"><i className="fab fa-youtube"></i></a>
        //                             <a href="https://www.instagram.com/ajppargentina/"><i className="fab fa-instagram"></i></a>
        //                             <a href="https://twitter.com/ajppargentina"><i className="fab fa-twitter"></i></a>
        //                         </div>
        //                     </div>

        //                 </div>
        //             </div>

        //         </div>
        //         <div className='row'>
        //             <SponsorsProp />
        //         </div>
        //     </div>
        // </div>
    );
}


