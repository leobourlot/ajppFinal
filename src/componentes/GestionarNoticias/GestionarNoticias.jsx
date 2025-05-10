// propio de reactjs
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext/UserContext';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { SponsorsProp } from '../Props/sponsorsProp'
import Pagination from 'react-bootstrap/Pagination';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'; // Importa uuid para generar identificadores únicos

import axios from 'axios';
import './GestionarNoticias.css';

export function GestionarNoticias() {

    const { userData } = useContext(UserContext);

    const [noticias, setNoticias] = useState([]);
    const [nuevaNoticia, setNuevaNoticia] = useState({
        titulo: '',
        descripcion: '',
        imagenes: Array(10).fill(''),  // Array para 10 imágenes
        descripcionesImagenes: Array(10).fill(''),  // Array para 10 descripciones de imágenes
        contenidos: Array(5).fill(''),  // Array para 5 contenidos
        creador: userData.user.nombre + ' ' + userData.user.apellido
    });

    const [showModalEditar, setShowModalEditar] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
    const [imagen, setImagen] = useState(null);  // Estado para la imagen
    const [imagenCargada, setImagenCargada] = useState(false); // Estado para verificar si la imagen se cargó

    // const baseURL = 'http://localhost:3005';
    // const baseURL = 'https://servidorajpp.onrender.com';
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';



    //paginación
    // Añade el estado para mantener el número de página actual
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calcula el índice inicial y final de los elementos a mostrar según la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtra las noticias para mostrar solo las correspondientes a la página actual
    const noticiasPaginadas = noticias ? noticias.slice(indexOfFirstItem, indexOfLastItem) : [];

    // Controlador de eventos para cambiar la página
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcula el total de páginas en función de la cantidad de torneos y el número de elementos por página

    const totalPages = noticias ? Math.ceil(noticias.length / itemsPerPage) : 0;


    // Genera los elementos de paginación
    let itemsPaginacion = [];
    for (let number = 1; number <= totalPages; number++) {
        itemsPaginacion.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => handleClick(number)}>
                {number}
            </Pagination.Item>,
        );
    }

    useEffect(() => {
        buscarNoticias();
    }, []);

    const buscarNoticias = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/v1/noticia/noticias`);
            setNoticias(response.data.dato);
        } catch (error) {
            console.log(error);
        }
    };

    const s3 = new S3({
        accessKeyId: 'AKIA6ODU7PT7KYXRZXZO',
        secretAccessKey: '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',
        region: 'eu-north-1'
    });

    // const handleImagenChange = async (index, event) => {
    //     const archivo = event.target.files[0];
    //     setImagen(archivo);
    //     setImagenCargada(false); // Reset imagen cargada


    //     if (!archivo) {
    //         alert('No se ha seleccionado ninguna imagen.');
    //         return;
    //     }

    //     const uniqueFileName = `imagenesNoticias/${uuidv4()}.png`;  // Genera un nombre único para la imagen

    //     const params = {
    //         Bucket: 'ajpp',
    //         Key: uniqueFileName,
    //         Body: archivo
    //     };

    //     try {
    //         await s3.putObject(params).promise();
    //         const imageUrl = `https://${params.Bucket}.s3.${s3.config.region}.amazonaws.com/${params.Key}`;
    //         setNuevaNoticia(prevState => {
    //             const nuevasImagenes = [...prevState.imagenes];
    //             nuevasImagenes[index] = imageUrl;
    //             return { ...prevState, imagenes: nuevasImagenes };
    //         });
    //         setImagenCargada(true); // Marca que la imagen ha sido cargada
    //         alert('Imagen cargada exitosamente.');
    //     } catch (err) {
    //         console.error('Error al cargar la imagen:', err);
    //         alert('Error al cargar la imagen.');
    //     }
    // };

    const handleImagenChange = async (index, event) => {
        const archivo = event.target.files[0];
        setImagen(archivo);
        setImagenCargada(false); // Reset imagen cargada


        if (!archivo) {
            alert('No se ha seleccionado ninguna imagen.');
            return;
        }

        const uniqueFileName = `imagenesNoticias/${uuidv4()}.png`;  // Genera un nombre único para la imagen

        const params = {
            Bucket: 'ajpp',
            Key: uniqueFileName,
            Body: archivo
        };

        try {
            await s3.putObject(params).promise();
            const imageUrl = `https://${params.Bucket}.s3.${s3.config.region}.amazonaws.com/${params.Key}`;
            setNuevaNoticia(prevState => {
                const nuevasImagenes = [...prevState.imagenes];
                nuevasImagenes[index] = imageUrl;
                return { ...prevState, imagenes: nuevasImagenes };
            });
            setImagenCargada(true); // Marca que la imagen ha sido cargada
            alert('Imagen cargada exitosamente.');
        } catch (err) {
            console.error('Error al cargar la imagen:', err);
            alert('Error al cargar la imagen.');
        }
    };
    
    const handleContenidoChange = (index, event) => {
        const { value } = event.target;
        setNuevaNoticia(prevState => {
            const nuevosContenidos = [...prevState.contenidos];
            nuevosContenidos[index] = value;
            return { ...prevState, contenidos: nuevosContenidos };
        });
    };

    const guardarNoticia = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${baseURL}/api/v1/noticia/nueva`, nuevaNoticia);
            setNuevaNoticia({
                titulo: '',
                descripcion: '',
                imagenes: Array(10).fill(''),
                descripcionesImagenes: Array(10).fill(''),
                contenidos: Array(5).fill('')
            });
            // setImagen(null);
            // setImagenCargada(false);
            buscarNoticias(); // Fetch updated list of noticias
        } catch (error) {
            console.log(error);
        }
    };

    const eliminarNoticia = async (idNoticia) => {
        const confirmacion = window.confirm('¿Está seguro que desea eliminar la noticia seleccionada?');
        if (confirmacion) {
            try {
                // console.log("idNoticia en eliminar es: ", idNoticia.idNoticia)
                await axios.delete(`${baseURL}/api/v1/noticia/eliminar/${idNoticia.idNoticia}`);
                buscarNoticias(); // Fetch updated list of noticias
            } catch (error) {
                console.log(error);
            }
        }
    };

    const cerrarModalEditar = () => {
        setShowModalEditar(false);
        setNoticiaSeleccionada(null);
    }

    const verModalEditar = (noticia) => {
        // console.log(noticia);
        // console.log(futbolista.posicion)
        // console.log(futbolista.pieHabil)
        setNoticiaSeleccionada(noticia)
        setShowModalEditar(true);
        setImagenCargada(false); // Reinicia el estado de la carga de imagen
    };

    const actualizaciónNoticiaSeleccionada = (e) => {
        const { name, value } = e.target;
        setNoticiaSeleccionada(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImagenChangeEditar = async (event) => {
        const archivo = event.target.files[0];
        setImagen(archivo); // Actualiza el estado de la imagen seleccionada

        if (!archivo) {
            alert('No se ha seleccionado ninguna imagen.');
            return;
        }

        const uniqueFileName = `imagenesNoticias/${uuidv4()}.png`;  // Genera un nombre único para la imagen

        const params = {
            Bucket: 'ajpp',
            Key: uniqueFileName,
            Body: archivo
        };

        try {
            await s3.putObject(params).promise();
            const imageUrl = `https://${params.Bucket}.s3.${s3.config.region}.amazonaws.com/${params.Key}`;

            // Actualiza la noticia seleccionada con la nueva URL de la imagen
            setNoticiaSeleccionada(prevState => ({ ...prevState, urlImagen: imageUrl }));
            setImagenCargada(true); // Indica que la imagen ha sido cargada
            alert('Imagen cargada exitosamente.');
        } catch (err) {
            console.error('Error al cargar la imagen:', err);
            alert('Error al cargar la imagen.');
        }
    };

    const editarNoticia = async (e) => {
        e.preventDefault();
        // console.log('noticiaSeleccionada antes de editar es: ', noticiaSeleccionada)
        // const noticia = { ...noticiaSeleccionada }; // Copiamos el estado para asegurar que es el actualizado
        // console.log('noticiaSeleccionada antes de editar es: ', noticia[0]);

        if (!imagenCargada) {
            alert('Espere a que la imagen termine de cargar.');
            return;
        }

        axios.put(baseURL + '/api/v1/noticia/modificar/' + noticiaSeleccionada.idNoticia, noticiaSeleccionada, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                // console.log(resp.data.msj);
                cerrarModalEditar();
                buscarNoticias();
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <>
            <div className="contenedorGestionNoticias">
                <div className="gestionNoticiasSection">
                    <div className="gestionNoticiasMenu">
                        <h2 className='gestionNoticias'>Gestión de noticias</h2>
                    </div>
                    <br />
                    <details className='detailsNuevaNoticia'>
                        <summary>Cargar nueva noticia</summary>
                        <h2>Completar formulario para agregar una nueva noticia</h2>
                        <br />
                        <div className="formGestionNoticias">
                            <form onSubmit={guardarNoticia}>
                                <fieldset className='fieldsetNoticias'>
                                    <legend>Título y descripción</legend>
                                    <div className="form-group">
                                        <label>Título</label>
                                        <input
                                            type="text"
                                            name="titulo"
                                            className="campo"
                                            value={nuevaNoticia.titulo}
                                            onChange={(e) => setNuevaNoticia({ ...nuevaNoticia, titulo: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Descripción</label>
                                        <textarea
                                            name="descripcion"
                                            value={nuevaNoticia.descripcion}
                                            className="campo"
                                            onChange={(e) => setNuevaNoticia({ ...nuevaNoticia, descripcion: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                </fieldset>
                                {[...Array(10)].map((_, index) => (
                                    <div className="form-group" key={index}>
                                        <fieldset className='fieldsetNoticias'>
                                            <legend>Imagen y descripción {index + 1}</legend>
                                            <label>Imagen {index + 1}</label>
                                            <input
                                                type="file"
                                                accept=".png"
                                                className="campo"
                                                onChange={(e) => handleImagenChange(index, e)}
                                            />
                                            <label>Descripción de la Imagen {index + 1}</label>
                                            <textarea
                                                name={`descripcionImagen${index}`}
                                                value={nuevaNoticia.descripcionesImagenes[index]}
                                                className="campo"
                                                onChange={(e) => {
                                                    const nuevasDescripciones = [...nuevaNoticia.descripcionesImagenes];
                                                    nuevasDescripciones[index] = e.target.value;
                                                    setNuevaNoticia({ ...nuevaNoticia, descripcionesImagenes: nuevasDescripciones });
                                                }}

                                            ></textarea>
                                        </fieldset>
                                    </div>
                                ))}
                                <fieldset className='fieldsetNoticias'>
                                    <legend>Párrafos</legend>
                                    {[...Array(5)].map((_, index) => (
                                        <div className="form-group" key={index}>
                                            <label>Párrafo {index + 1}</label>
                                            <textarea
                                                name={`contenido${index}`}
                                                value={nuevaNoticia.contenidos[index]}
                                                className="campo"
                                                onChange={(e) => handleContenidoChange(index, e)}

                                            ></textarea>
                                        </div>
                                    ))}
                                </fieldset>
                                <button type="submit" className="btn btn-outline-dark" disabled={!imagenCargada}>Agregar Noticia</button>
                            </form>

                        </div>
                    </details>
                </div>

                <div className="tablaGestionNoticias">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className='busqueda'
                        placeholder="Buscar..."
                    />
                    <Table responsive striped bordered hover>
                        <thead>
                            <tr>
                                <th className='thGestionNoticias'>Título</th>
                                <th className='thGestionNoticias'>Descripcion</th>
                                <th className='thGestionNoticias'>Fecha</th>
                                <th className='thGestionNoticias'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tbodyGestionNoticias">
                            {
                                noticias && noticias.length > 0 ? (
                                    noticias
                                        .filter((item) => {
                                            // Filtra las noticias según el texto de búsqueda
                                            return (
                                                (item.idNoticia && item.idNoticia.toString().includes(busqueda)) ||
                                                (item.fecha && item.fecha.includes(busqueda)) ||
                                                (item.descripcion && item.descripcion.toLowerCase().includes(busqueda))
                                            );
                                        })
                                        .slice(indexOfFirstItem, indexOfLastItem)
                                        .map((item, index) => (

                                            <tr key={index}>

                                                <td>{item.titulo}</td>
                                                <td>{item.descripcion}</td>
                                                <td>{new Date(item.fecha).toLocaleDateString('es-ES')}</td>
                                                <td className="acciones">

                                                    <Button id='botonEditar' variant="success" onClick={() => verModalEditar(item)} className='btn-sm'>
                                                        Editar
                                                    </Button>

                                                    <Button id='botonEliminar' variant="danger" onClick={() => eliminarNoticia(item)} className='btn-sm'>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                            </tr>
                                        )))
                                    : <></>
                            }

                        </tbody>

                    </Table>
                    <div>
                        {/* Paginación */}
                        <Pagination>{itemsPaginacion}</Pagination>
                    </div>


                </div>
                <Modal show={showModalEditar} onHide={cerrarModalEditar}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar noticia</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {noticiaSeleccionada && (
                            <Form onSubmit={e => editarNoticia(e)}>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicTitulo">
                                            <Form.Label>Título</Form.Label>
                                            <Form.Control type="text"
                                                name="titulo"
                                                onChange={actualizaciónNoticiaSeleccionada}
                                                // onChange={(e) => setNoticiaSeleccionada({ ...noticiaSeleccionada, titulo: e.target.value })}
                                                value={noticiaSeleccionada.titulo}
                                                className="campo" />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicDescripcion">
                                            <Form.Label>Descripción</Form.Label>
                                            <Form.Control type="textarea"
                                                name="descripcion"
                                                onChange={actualizaciónNoticiaSeleccionada}
                                                // onChange={(e) => setNoticiaSeleccionada({ ...noticiaSeleccionada, descripcion: e.target.value })}
                                                value={noticiaSeleccionada.descripcion} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicImagen">
                                            <Form.Label>Imágen</Form.Label>
                                            <Form.Control type="file"
                                                accept='.png'
                                                name="urlImagen"
                                                onChange={handleImagenChangeEditar}
                                            />
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicDescripcionImagen">
                                            <Form.Label>Descripción de la imágen</Form.Label>
                                            <Form.Control type="text"
                                                name="descripcionImagen"
                                                onChange={actualizaciónNoticiaSeleccionada}
                                                // onChange={(e) => setNoticiaSeleccionada({ ...noticiaSeleccionada, descripcionImagen: e.target.value })}
                                                value={noticiaSeleccionada.descripcionImagen} />
                                        </Form.Group>
                                    </div>

                                </div>
                                <div className='row'>
                                    <div className="col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicContenido">
                                            <Form.Label>Contenido de la noticia</Form.Label>
                                            <Form.Control type="textarea"
                                                name="contenido"
                                                onChange={actualizaciónNoticiaSeleccionada}
                                                // onChange={(e) => setNoticiaSeleccionada({ ...noticiaSeleccionada, contenido: e.target.value })}
                                                value={noticiaSeleccionada.contenido} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <Button variant="primary" type="submit">
                                    Guardar
                                </Button>

                            </Form>
                        )}

                    </Modal.Body>
                </Modal>
            </div>

        </>
    );
}