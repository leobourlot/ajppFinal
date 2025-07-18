import './Torneo.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Form, Button, Modal } from 'react-bootstrap';
import { UserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';


export function Torneo() {
    const { userData } = useContext(UserContext);
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'https://retrieval-obligations-anti-duke.trycloudflare.com';
    // const baseURL = 'http://localhost:3005';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';
        

    const navigate = useNavigate();

    const irAJugadores = () => {
        navigate(`/privado/futbolistas`);
    };

    const [showModalEditar, setShowModalEditar] = useState(false);

    // datos de convocatoria
    const [torneos, setTorneos] = useState(null);

    // Nuevo estado para controlar si se está modificando una convocatoria
    const [modificandoTorneo, setModificandoTorneo] = useState(false);

    // datos de los rivales disponibles
    const [provincias, setProvincias] = useState(null);

    // objeto para almacenar la informacion de la convocatoria
    const [torneo, setTorneo] = useState({ fechaInicio: '', fechaFinal: '', ciudad: '', provincia: '', organizador: '', costoInscripcion: '', formaPago: '' });
    const [organizadores, setOrganizadores] = useState(null);


    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
    const [organizadorSeleccionado, setOrganizadorSeleccionado] = useState(null);


    const [busqueda, setBusqueda] = useState('');
    const [cargandoTorneo, setCargandoTorneo] = useState(false);


    //paginación
    // Añade el estado para mantener el número de página actual
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calcula el índice inicial y final de los elementos a mostrar según la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtra los torneos para mostrar solo los correspondientes a la página actual
    const torneosPaginados = torneos ? torneos.slice(indexOfFirstItem, indexOfLastItem) : [];

    // Controlador de eventos para cambiar la página
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcula el total de páginas en función de la cantidad de torneos y el número de elementos por página

    const totalPages = torneos ? Math.ceil(torneos.length / itemsPerPage) : 0;


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
        buscarTorneo();
        buscarProvincias();
        buscarOrganizadores();
    }, []);

    const cerrarModalEditar = () => {
        setShowModalEditar(false);
        setTorneoSeleccionado(null);
    }

    const verModalEditar = (torneo) => {
        setTorneoSeleccionado(torneo)
        setShowModalEditar(true);
    };

    // me quedo solo con la fecha del datetime
    const formatearFecha = (fechaInicio, fechaFinal) => {
        const options = { day: 'numeric', month: 'long' };

        const inicio = new Date(fechaInicio);
        const final = new Date(fechaFinal);

        // Ajustar las fechas sumando la diferencia horaria entre GMT y la zona horaria local
        inicio.setHours(inicio.getHours() + 3); // Sumar 3 horas para GMT-3
        final.setHours(final.getHours() + 3); // Sumar 3 horas para GMT-3

        const diaInicio = inicio.toLocaleDateString('es-ES', { day: 'numeric' });
        const diaFinal = final.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

        const diaInicioMesDistinto = inicio.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

        // Si el mes de inicio y final son diferentes, mostramos las fechas como "diaInicio al diaFinal"
        if (inicio.getMonth() !== final.getMonth()) {
            return `${diaInicioMesDistinto} al ${diaFinal}`;
        } else {
            // Si el mes de inicio y final son iguales, mostramos solo el día de inicio y el día de la fecha final
            return `${diaInicio} al ${final.toLocaleDateString('es-ES', options)}`;
        }
    };

    const buscarProvincias = async () => {
        axios.get(baseURL + '/api/v1/provincia/provincias', {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                setProvincias(resp.data.dato);
            })
            .catch(error => {
                console.log(error);
            });
    }

    const buscarTorneo = async () => {
        const fechaActual = new Date();

        axios.get(baseURL + '/api/v1/torneo/torneos', {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })

            .then(resp => {
                const torneosData = resp.data.dato;


                // Ordenar los torneos por la fecha de inicio
                torneosData.sort((a, b) => {
                    const fechaInicioA = new Date(a.fechaInicio);
                    const fechaInicioB = new Date(b.fechaInicio);
                    return fechaInicioA - fechaInicioB;
                });

                // Iterar sobre cada torneo para obtener la información completa de la provincia
                const torneosConProvinciaCompleta = torneosData.map(async (torneo) => {
                    try {
                        const provinciaResp = await axios.get(baseURL + `/api/v1/provincia/provincias/${torneo.provincia}`);
                        const provinciaCompleta = provinciaResp.data; // Suponiendo que la respuesta contiene los datos completos de la provincia
                        return { ...torneo, provincia: provinciaCompleta };
                    } catch (error) {
                        return torneo; // Si hay un error, simplemente devolvemos el torneo sin modificar
                    }
                });

                // Esperar a que se completen todas las solicitudes para obtener la lista actualizada de torneos
                Promise.all(torneosConProvinciaCompleta)
                    .then((torneosActualizados) => {
                        setTorneos(torneosActualizados);
                    })
                    .catch((error) => {
                        console.log('Error al obtener la información completa de la provincia para los torneos:', error);
                    });
            })
            .catch(error => {
                console.log('Error al obtener la lista de torneos:', error);
            });
    }

    const buscarOrganizadores = async () => {

        axios.get(baseURL + '/api/v1/organizador/organizadores', {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })

            .then(resp => {
                const organizadoresData = resp.data.dato;
                // console.log('organizadoresData es: ', organizadoresData)
                setOrganizadores(organizadoresData);

            })
            .catch(error => {
                console.log('Error al obtener la lista de organizadores:', error);
            });
    }

    const guardarTorneo = async (e) => {
        e.preventDefault();
        setCargandoTorneo(true); // comienza la carga


        // Manejo de la fecha
        const [diaInicio, mesInicio] = torneo.fechaInicio.split('/');
        const [diaFinal, mesFinal] = torneo.fechaFinal.split('/');

        let diaFinalCorregido = diaFinal;
        let mesFinalCorregido = mesFinal;

        // Verificar si el día final es menor que el día de inicio
        if (parseInt(diaFinal) < parseInt(diaInicio)) {
            // Obtener el último día del mes anterior
            const fechaInicio = new Date(2024, parseInt(mesInicio) - 1, parseInt(diaInicio));
            const ultimoDiaMesAnterior = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 0).getDate();
            diaFinalCorregido = ultimoDiaMesAnterior;

            // Obtener el mes final corregido
            const mesSiguiente = parseInt(mesInicio) % 12 + 1;
            mesFinalCorregido = mesSiguiente.toString().padStart(2, '0');
        }

        // Guardar el torneo
        if (modificandoTorneo) {
            axios.put(baseURL + `/api/v1/torneo/torneos/${torneoSeleccionado}`, { fechaInicio: torneo.fechaInicio, fechaFinal: torneo.fechaFinal, ciudad: torneo.ciudad, provincia: torneo.provincia, organizador: torneo.organizador, costoInscripcion: torneo.costoInscripcion, formaPago: torneo.formaPago }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
                .then((res) => {
                    if (res.data.estado === 'OK') {
                        buscarTorneo();
                        setTorneoSeleccionado(null);
                        setTorneo({ fechaInicio: '', fechaFinal: '', ciudad: '', provincia: '', organizador: '', costoInscripcion: '' });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            // console.log('torneo antes de crear es: ', torneo)
            // console.log('torneo en el form antes del post es: ', torneo)
            axios.post(baseURL + '/api/v1/torneo/nuevo', { fechaInicio: torneo.fechaInicio, fechaFinal: torneo.fechaFinal, ciudad: torneo.ciudad, provincia: torneo.provincia, organizador: torneo.organizador, costoInscripcion: torneo.costoInscripcion, formaPago: torneo.formaPago }, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
                .then((res) => {
                    if (res.data.estado === 'OK') {
                        buscarTorneo();
                    }
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setCargandoTorneo(false); // Termina el loading
                });
        }
    }

    const editarTorneo = async (e) => {
        e.preventDefault();
        // console.log('torneoseleccionado antes del put es: ', torneoSeleccionado)
        axios.put(baseURL + '/api/v1/torneo/modificar/' + torneoSeleccionado.idTorneo, torneoSeleccionado, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                // console.log(resp.data.msj);
                cerrarModalEditar();
                buscarTorneo();
            })
            .catch(error => {
                console.log(error);
            })
    }

    const cerrarInscripcion = (torneo) => {
        if (torneo) {
            const confirmacion = window.confirm('¿Está seguro que desea cerrar la inscripción?');
            if (confirmacion) {
                const torneoActualizado = { ...torneo, activo: 0 };
                // console.log('torneoactualizado es: ', torneoActualizado)
                axios.put(baseURL + '/api/v1/torneo/cerrarInscripcion/' + torneoActualizado.idTorneo, torneoActualizado, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                    .then((res) => {
                        if (res.data.estado === 'OK') {
                            buscarTorneo();
                            setTorneoSeleccionado(null);
                            setTorneo({ fechaInicio: '', fechaFinal: '', ciudad: '', provincia: '', organizador: '', costoInscripcion: '', formaPago: '' });
                            setModificandoTorneo(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };

    const eliminarTorneo = (torneo) => {
        confirm('¿Está seguro que desea eliminar el torneo seleccionado?');
        if (torneo) {
            const confirmacion = window.confirm('¿Está seguro que desea eliminar el torneo seleccionado?');
            if (confirmacion) {
                axios.delete(baseURL + '/api/v1/torneo/eliminar/' + torneo.idTorneo, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                    .then((res) => {
                        if (res.data.estado === 'OK') {
                            buscarTorneo();
                            setTorneoSeleccionado(null);
                            setTorneo({ fechaInicio: '', fechaFinal: '', ciudad: '', provincia: '', organizador: '', costoInscripcion: '', formaPago: '' });
                            setModificandoTorneo(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };


    const cargarImagen = async (e) => {
        const archivo = e.target.files[0];
        setTorneo({ ...torneo, foto: archivo });
    };

    const cargarImagenModificacion = async (e) => {
        const archivo = e.target.files[0];
        setTorneoSeleccionado({ ...torneoSeleccionado, foto: archivo });
    };

    return (
        <div className="contenedorTorneos">
            <div className="torneosSection">
                <div className="torneosMenu">
                    <h2 className='torneos'>Torneos</h2>
                </div>
                <br />
                <h2>Completar formulario para agregar un nuevo torneo</h2>
                <br />
                <div className="formTorneo">
                    <form onSubmit={guardarTorneo}>
                        <label>Fecha de inicio (dd/mm/aaaa):</label>
                        <input
                            type="date"
                            value={torneo.fechaInicio || ''}
                            onChange={(e) => setTorneo({ ...torneo, fechaInicio: e.target.value })}
                            className="campo"
                            required
                        />
                        <label>Fecha final (dd/mm/aaaa):</label>
                        <input
                            type="date"
                            value={torneo.fechaFinal || ''}
                            onChange={(e) => setTorneo({ ...torneo, fechaFinal: e.target.value })}
                            className="campo"
                            required
                        />
                        <label>Ciudad</label>
                        <input
                            type="text"
                            value={torneo.ciudad || ''}
                            onChange={(e) => setTorneo({ ...torneo, ciudad: e.target.value })}
                            className="campo"
                            required
                        />

                        <label>Provincia</label>
                        <select
                            required
                            className="campo"
                            value={torneo.provincia || ''}
                            onChange={(e) => setTorneo({ ...torneo, provincia: e.target.value })}>
                            <option value="">Seleccione una opción</option>
                            {(provincias?.length > 0) ? provincias.map(item => (
                                <option key={item.idProvincia} value={item.idProvincia}>
                                    {item.nombreProvincia}
                                </option>
                            )) : <></>}
                        </select>
                        <label>Organizador</label>
                        <select
                            className='campo'
                            value={torneo.organizador || ''}
                            onChange={(e) => setTorneo({ ...torneo, organizador: e.target.value })}>
                            <option value="">Selecciona un organizador</option>
                            {organizadores?.map((organizador) => (
                                <option key={organizador.idOrganizador} value={organizador.idOrganizador}>

                                    {organizador.apellido} - {organizador.ciudad} - {organizador.club}
                                </option>
                            ))}
                        </select>

                        <label>Costo de inscripción</label>
                        <input
                            type="text"
                            value={torneo.costoInscripcion || ''}
                            onChange={(e) => setTorneo({ ...torneo, costoInscripcion: e.target.value })}
                            className="campo"
                            required
                        />
                        <label>Forma de pago:
                            <select
                                name="formasPago"
                                className="campo"
                                id='selectPagos'
                                onChange={(e) => setTorneo({ ...torneo, formaPago: e.target.value })}
                                required>

                                <option value="">Seleccione un medio de pago</option>
                                <option value="otro">Otro</option>
                                <option value="mercadoPago">Mercado Pago</option>
                            </select>
                        </label>

                        {/* <div className='col-6'>

                            {modificandoTorneo ? (
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
                        </div> */}
                        <div className='col-6'>
                            {modificandoTorneo ? (
                                // Botón "Modificar"
                                <button
                                    type="submit"
                                    value="submit"
                                    className="btn btn-outline-dark"
                                    disabled={cargandoTorneo}
                                >
                                    {cargandoTorneo ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Modificando...
                                        </>
                                    ) : (
                                        'Modificar'
                                    )}
                                </button>
                            ) : (
                                // Botón "Agregar"
                                <button
                                    type="submit"
                                    value="submit"
                                    className="btn btn-outline-dark"
                                    disabled={cargandoTorneo}
                                >
                                    {cargandoTorneo ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Agregando...
                                        </>
                                    ) : (
                                        'Agregar'
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="tablaTorneos">
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
                            <th className='thTorneos'>Fecha</th>
                            <th className='thTorneos'>Ciudad</th>
                            <th className='thTorneos'>Provincia</th>
                            <th className='thTorneos'>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tbodyTorneos">
                        {
                            torneos && torneos.length > 0 ? (
                                torneos
                                    .filter((item) => {
                                        // Filtra las convocatorias según el texto de búsqueda
                                        return (
                                            (item.idTorneo && item.idTorneo.toString().includes(busqueda)) ||
                                            (formatearFecha(item.fechaInicio, item.fechaFinal) && formatearFecha(item.fechaInicio, item.fechaFinal).includes(busqueda)) ||
                                            (item.ciudad && item.ciudad.toLowerCase().includes(busqueda)) ||
                                            (item.provincia.dato[0].nombreProvincia && item.provincia.dato[0].nombreProvincia.toLowerCase().includes(busqueda)));
                                    })
                                    .slice(indexOfFirstItem, indexOfLastItem)
                                    .map((item, index) => (

                                        <tr key={index}>

                                            <td>{formatearFecha(item.fechaInicio, item.fechaFinal)}</td>
                                            <td>{item.ciudad}</td>
                                            <td>{item.provincia.dato[0].nombreProvincia}</td>
                                            <td className="acciones">

                                                <Button id='botonEditar' variant="success" onClick={() => verModalEditar(item)} className='btn-sm'>
                                                    Editar
                                                </Button>

                                                <Button id='botonEliminar' variant="danger" onClick={() => eliminarTorneo(item)} className='btn-sm'>
                                                    Eliminar
                                                </Button>

                                                <Button
                                                    id='botonCerrarInscripcion'
                                                    variant={item.activo === 1 ? "danger" : "secondary"}
                                                    onClick={() => cerrarInscripcion(item)}
                                                    className='btn-sm'
                                                >
                                                    {item.activo === 1 ? "Cerrar inscripción" : "Inscripción cerrada"}
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
                    <Modal.Title>Editar datos de torneo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {torneoSeleccionado && (
                        <Form onSubmit={e => editarTorneo(e)}>
                            <div className='row'>
                                <div className="col-md-6">


                                    <Form.Group className="mb-3" controlId="formBasicApellido">
                                        <Form.Label>Fecha inicio</Form.Label>
                                        <Form.Control type="date"
                                            onChange={(e) => setTorneoSeleccionado({ ...torneoSeleccionado, fechaInicio: e.target.value })}
                                            value={torneoSeleccionado.fechaInicio}
                                            className="campo" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">


                                    <Form.Group className="mb-3" controlId="formBasicApellido">
                                        <Form.Label>Fecha final</Form.Label>
                                        <Form.Control type="date"
                                            onChange={(e) => setTorneoSeleccionado({ ...torneoSeleccionado, fechaFinal: e.target.value })}
                                            value={torneoSeleccionado.fechaFinal}
                                            className="campo" />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Ciudad</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setTorneoSeleccionado({ ...torneoSeleccionado, ciudad: e.target.value })}
                                            value={torneoSeleccionado.ciudad} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formBasicPosicion">
                                        <Form.Label>Provincia</Form.Label>
                                        <Form.Select
                                            className="campo"
                                            value={torneoSeleccionado.provincia || ''}
                                            onChange={(e) => setTorneoSeleccionado({ ...torneoSeleccionado, provincia: e.target.value })}>
                                            <option value="">Seleccione una opción</option>
                                            {(provincias?.length > 0) ? provincias.map(item => (
                                                <option key={item.idProvincia} value={item.idProvincia}>
                                                    {item.nombreProvincia}
                                                </option>
                                            )) : <></>}
                                        </Form.Select>
                                    </Form.Group>
                                </div>

                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Organizador</Form.Label>
                                        <Form.Select
                                            className="campo"
                                            value={torneoSeleccionado.organizador || ''}
                                            onChange={(e) => setOrganizadorSeleccionado({ ...torneoSeleccionado, organizador: e.target.value })}>
                                            <option value="">Seleccione una opción</option>
                                            {organizadores?.map((organizador) => (
                                                <option key={organizador.idOrganizador} value={organizador.idOrganizador}>

                                                    {organizador.apellido} - {organizador.ciudad} - {organizador.club}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Costo de inscripción</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setTorneoSeleccionado({ ...torneoSeleccionado, costoInscripcion: e.target.value })}
                                            value={torneoSeleccionado.costoInscripcion} />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <Form.Group className="mb-3" controlId="formBasicPosicion">
                                        <Form.Label>Forma de Pago</Form.Label>
                                        <Form.Select
                                            className="campo"
                                            value={torneoSeleccionado.formaPago || ''}
                                            onChange={(e) => setTorneoSeleccionado({ ...torneoSeleccionado, formaPago: e.target.value })}>
                                            <option value="">Seleccione una opción</option>

                                            <option value="otro">Otro</option>
                                            <option value="mercadoPago">Mercado Pago</option>

                                        </Form.Select>
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