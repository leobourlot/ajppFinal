import './Organizadores.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Form, Button, Modal } from 'react-bootstrap';
import { UserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Image from 'react-bootstrap/Image';



export function Organizadores() {
    const { userData } = useContext(UserContext);
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'https://retrieval-obligations-anti-duke.trycloudflare.com';
    // const baseURL = 'http://localhost:3005';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';


    const navigate = useNavigate();

    const [showModalEditar, setShowModalEditar] = useState(false);

    const [organizadores, setOrganizadores] = useState(null);

    const [modificandoOrganizador, setModificandoOrganizador] = useState(false);

    const [organizador, setOrganizador] = useState({ apellido: '', ciudad: '', club: '' });

    const [organizadorSeleccionado, setOrganizadorSeleccionado] = useState(null);

    const [busqueda, setBusqueda] = useState('');

    const [linkMP, setLinkMP] = useState('');

    //paginación
    // Añade el estado para mantener el número de página actual
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calcula el índice inicial y final de los elementos a mostrar según la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtra los torneos para mostrar solo los correspondientes a la página actual
    const organizadoresPaginados = organizadores ? organizadores.slice(indexOfFirstItem, indexOfLastItem) : [];

    // Controlador de eventos para cambiar la página
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcula el total de páginas en función de la cantidad de torneos y el número de elementos por página

    const totalPages = organizadores ? Math.ceil(organizadores.length / itemsPerPage) : 0;


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
        buscarOrganizador();
    }, []);

    const cerrarModalEditar = () => {
        setShowModalEditar(false);
        setOrganizadorSeleccionado(null);
    }

    const verModalEditar = (organizador) => {
        setOrganizadorSeleccionado(organizador)
        setShowModalEditar(true);
    };

    const buscarOrganizador = async () => {

        axios.get(baseURL + '/api/v1/organizador/organizadores', {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })

            .then(resp => {
                const organizadoresData = resp.data.dato;


                const organizadoresOrdenados = organizadoresData.slice().sort((a, b) => {
                    const apellidoA = a.apellido.toLowerCase();
                    const apellidoB = b.apellido.toLowerCase();
                    if (apellidoA !== apellidoB) {
                        return apellidoA.localeCompare(apellidoB);
                    } else {
                        const nombreA = a.nombre.toLowerCase();
                        const nombreB = b.nombre.toLowerCase();
                        return nombreA.localeCompare(nombreB);
                    }
                });

                setOrganizadores(organizadoresOrdenados);
            })
            .catch(error => {
                console.log('Error al obtener la lista de organizadores: ', error);
            });
    }

    const guardarOrganizador = async (e) => {
        e.preventDefault();

        if (modificandoOrganizador) {
            axios.put(baseURL + `/api/v1/organizador/organizadores/${organizadorSeleccionado}`, { apellido: organizador.apellido, ciudad: organizador.ciudad, club: organizador.club }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
                .then((res) => {
                    if (res.data.estado === 'OK') {
                        buscarOrganizador();
                        setOrganizadorSeleccionado(null);
                        setOrganizador({ apellido: '', ciudad: '', club: '' });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            axios.post(baseURL + '/api/v1/organizador/nuevo', { apellido: organizador.apellido, ciudad: organizador.ciudad, club: organizador.club }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
                .then((res) => {
                    if (res.data.estado === 'OK') {
                        buscarOrganizador();
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    const editarOrganizador = async (e) => {
        e.preventDefault();
        axios.put(baseURL + '/api/v1/organizador/modificar/' + organizadorSeleccionado.idOrganizador, organizadorSeleccionado, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                cerrarModalEditar();
                buscarOrganizador();
            })
            .catch(error => {
                console.log(error);
            })
    }

    const eliminarOrganizador = (organizador) => {
        confirm('¿Está seguro que desea eliminar el organizador seleccionado?');
        if (organizador) {
            const confirmacion = window.confirm('¿Está seguro que desea eliminar el organizador seleccionado?');
            if (confirmacion) {
                axios.delete(baseURL + '/api/v1/organizador/eliminar/' + organizador.idOrganizador, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                    .then((res) => {
                        if (res.data.estado === 'OK') {
                            buscarOrganizador();
                            setOrganizadorSeleccionado(null);
                            setOrganizador({ apellido: '', ciudad: '', club: '' });
                            setModificandoOrganizador(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };

    const generarLinkMP = (organizador) => {
        if (organizador) {
            axios.get(`${baseURL}/api/v1/oauth/iniciar/` + organizador.idOrganizador, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userData.token}`
                },
                withCredentials: true  // Importante para enviar y recibir la cookie de sesión
            })
                .then(resp => {
                    // La respuesta contiene la propiedad authorizationUrl
                    const link = resp.data.authorizationUrl;
                    console.log("Link recibido:", link);
                    // Aquí puedes actualizar el estado para mostrar el link en el formulario
                    setLinkMP(link)
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    return (
        <div className="contenedorOrganizadores">
            <div className="organizadoresSection">
                <div className="organizadoresMenu">
                    <h2 className='organizadores'>Organizadores</h2>
                </div>
                <br />
                <h2>Completar formulario para agregar un nuevo organizador</h2>
                <br />
                <div className="formOrganizador">
                    <form onSubmit={guardarOrganizador}>

                        <label>Apellido</label>
                        <input
                            type="text"
                            value={organizador.apellido || ''}
                            onChange={(e) => setOrganizador({ ...organizador, apellido: e.target.value })}
                            className="campo"
                            required
                        />
                        <label>Ciudad</label>
                        <input
                            type="text"
                            value={organizador.ciudad || ''}
                            onChange={(e) => setOrganizador({ ...organizador, ciudad: e.target.value })}
                            className="campo"
                            required
                        />
                        <label>Club</label>
                        <input
                            type="text"
                            value={organizador.club || ''}
                            onChange={(e) => setOrganizador({ ...organizador, club: e.target.value })}
                            className="campo"
                            required
                        />

                        {modificandoOrganizador ? (
                            // Muestra el botón "Modificar" si se está modificando
                            <button type="submit" value="submit" className="btn btn-outline-dark">
                                Modificar
                            </button>
                        ) : (
                            // Muestra el botón "Agregar" si no se está modificando
                            <button type="submit" value="submit" className="btn btn-outline-dark">
                                Agregar
                            </button>
                        )}
                    </form>
                </div>
            </div>

            <div className="tablaOrganizadores">
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
                            <th className='thOrganizadores'>Apellido</th>
                            <th className='thOrganizadores'>Ciudad</th>
                            <th className='thOrganizadores'>Club</th>
                            <th className='thOrganizadores'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyOrganizadores">
                        {
                            organizadores && organizadores.length > 0 ? (
                                organizadores
                                    .filter((item) => {
                                        // Filtra las convocatorias según el texto de búsqueda
                                        return (
                                            (item.idOrganizador && item.idOrganizador.toString().includes(busqueda)) ||
                                            (item.apellido && item.apellido.toLowerCase().includes(busqueda)) ||
                                            (item.apellido && item.apellido.toUpperCase().includes(busqueda)) ||
                                            (item.club && item.club.toLowerCase().includes(busqueda)) ||
                                            (item.club && item.club.toUpperCase().includes(busqueda)));
                                    })
                                    .slice(indexOfFirstItem, indexOfLastItem)
                                    .map((item, index) => (

                                        <tr key={index}>
                                            <td>{item.apellido}</td>
                                            <td>{item.ciudad}</td>
                                            <td>{item.club}</td>
                                            <td className="acciones">

                                                <Button id='botonEditar' variant="success" onClick={() => verModalEditar(item)} className='btn-sm'>
                                                    Editar
                                                </Button>

                                                <Button id='botonEliminar' variant="danger" onClick={() => eliminarOrganizador(item)} className='btn-sm'>
                                                    Eliminar
                                                </Button>

                                                <Button
                                                    id='botonLinkMP'
                                                    variant="warning"
                                                    onClick={() => generarLinkMP(item)}
                                                    className='btn-sm'
                                                >
                                                    Link MP
                                                    {/* {item.activo === 1 ? "Cerrar inscripción" : "Inscripción cerrada"} */}
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

                <div>
                    <label>Link de autorización MP:</label>
                    <input type="text" value={linkMP} readOnly />
                    <button onClick={() => navigator.clipboard.writeText(linkMP)}>Copiar Link</button>
                </div>


            </div>

            <Modal show={showModalEditar} onHide={cerrarModalEditar}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar datos de organizador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {organizadorSeleccionado && (
                        <Form onSubmit={e => editarOrganizador(e)}>

                            <div className='row'>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setOrganizadorSeleccionado({ ...organizadorSeleccionado, apellido: e.target.value })}
                                            value={organizadorSeleccionado.apellido} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Ciudad</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setOrganizadorSeleccionado({ ...organizadorSeleccionado, ciudad: e.target.value })}
                                            value={organizadorSeleccionado.ciudad} />
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
        </div >

    );
}