import './Jugadores.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Form, Button, Modal } from 'react-bootstrap';
import { UserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import * as XLSX from 'xlsx';
import Image from 'react-bootstrap/Image';



export function Jugadores() {
    const { userData } = useContext(UserContext);
    // const baseURL = 'http://localhost:3005';
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';


    const navigate = useNavigate();

    // const irAJugadores = () => {
    //     navigate(`/privado/futbolistas`);
    // };

    const [showModalEditar, setShowModalEditar] = useState(false);
    const [showModalDatos, setShowModalDatos] = useState(false);

    // datos de convocatoria
    const [jugadores, setJugadores] = useState(null);

    // Nuevo estado para controlar si se está modificando una convocatoria
    const [modificandoJugador, setModificandoJugador] = useState(false);

    // datos de los rivales disponibles
    // const [provincias, setProvincias] = useState(null);

    // objeto para almacenar la informacion de la convocatoria
    const [jugador, setJugador] = useState({ dni: '', apellido: '', nombre: '', fechaNac: '', correoElectronico: '', telefono: '', localidad: '', });

    const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

    const [busqueda, setBusqueda] = useState('');

    //paginación
    // Añade el estado para mantener el número de página actual
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calcula el índice inicial y final de los elementos a mostrar según la página actual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Filtra los torneos para mostrar solo los correspondientes a la página actual
    const jugadoresPaginados = jugadores ? jugadores.slice(indexOfFirstItem, indexOfLastItem) : [];

    // Controlador de eventos para cambiar la página
    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcula el total de páginas en función de la cantidad de torneos y el número de elementos por página

    const totalPages = jugadores ? Math.ceil(jugadores.length / itemsPerPage) : 0;


    // Genera los elementos de paginación
    // let itemsPaginacion = [];
    // for (let number = 1; number <= totalPages; number++) {
    //     itemsPaginacion.push(
    //         <Pagination.Item key={number} active={number === currentPage} onClick={() => handleClick(number)}>
    //             {number}
    //         </Pagination.Item>,
    //     );
    // }

    const renderPaginationItems = () => {
        let items = [];

        items.push(
            <Pagination.Item key={1} active={1 === currentPage} onClick={() => handleClick(1)}>
                {1}
            </Pagination.Item>
        );

        if (currentPage > 3) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage} onClick={() => handleClick(number)}>
                    {number}
                </Pagination.Item>,
            );
        }

        if (currentPage < totalPages - 2) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }

        if (totalPages > 1) {
            items.push(
                <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handleClick(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    useEffect(() => {
        buscarJugador();
        // buscarProvincias();
    }, []);

    const cerrarModalEditar = () => {
        setShowModalEditar(false);
        setJugadorSeleccionado(null);
    }

    const cerrarModalDatos = () => {
        setShowModalDatos(false);
        setJugadorSeleccionado(null);
    }

    const verModalEditar = (jugador) => {
        console.log(jugador);
        // console.log(futbolista.posicion)
        // console.log(futbolista.pieHabil)
        setJugadorSeleccionado(jugador)
        setShowModalEditar(true);
    };

    const verModalDatos = (jugador) => {
        // console.log(jugador);
        // console.log(futbolista.posicion)
        // console.log(futbolista.pieHabil)
        setJugadorSeleccionado(jugador)
        setShowModalDatos(true);
    };

    function formatoFecha(dateTime) {
        const fecha = new Date(dateTime);
        fecha.setHours(fecha.getHours() + 3) // Sumar 3 horas para GMT-3        

        const fechaCompleta = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' });
        return fechaCompleta;
    }

    const buscarJugador = async () => {

        axios.get(baseURL + '/api/v1/jugador/jugadores', {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })

            .then(resp => {
                const jugadoresData = resp.data.dato;

                // Ordenar los jugadores por orden alfabetico
                const jugadoresOrdenados = jugadoresData.slice().sort((a, b) => {
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

                setJugadores(jugadoresOrdenados);

            })
            .catch(error => {
                console.log('Error al obtener la lista de jugadores:', error);
            });
    }

    const editarJugador = async (e) => {
        e.preventDefault();
        // console.log('jugadorseleccionado antes del put es: ', jugadorSeleccionado)
        axios.put(baseURL + '/api/v1/jugador/jugadores/' + jugadorSeleccionado.idJugador, jugadorSeleccionado, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                // console.log(resp.data.msj);
                cerrarModalEditar();
                buscarJugador();
            })
            .catch(error => {
                console.log(error);
            })
    }


    const eliminarJugador = (jugador) => {
        // console.log('jugador en eliminar es: ', jugador);

        // console.log('idJugador antes de delete es: ', jugador.idJugador)
        if (jugador) {
            const confirmacion = window.confirm('¿Está seguro que desea eliminar el jugador seleccionado?');
            if (confirmacion) {
                axios.delete(baseURL + '/api/v1/jugador/jugadores/' + jugador.idJugador, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                    .then((res) => {
                        if (res.data.estado === 'OK') {
                            buscarJugador();
                            setJugadorSeleccionado(null);
                            setJugador({ dni: '', apellido: '', nombre: '', fechaNac: '', correoElectronico: '', telefono: '', localidad: '' });
                            setModificandoJugador(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        }
    };

    const exportarExcel = () => {
        // Seleccionar solo las columnas que deseas exportar
        const datosExportados = jugadores.map(item => ({
            DNI: item.dni,
            Apellido: item.apellido,
            Nombre: item.nombre,
            FechaNacimiento: item.fechaNac,
            Email: item.correoElectronico,
            Telefono: item.telefono,
            Localidad: item.localidad
            // Agrega aquí las demás columnas que desees exportar
        }));

        // Crear un nuevo libro de trabajo (workbook)
        const wb = XLSX.utils.book_new();

        // Crear una nueva hoja de cálculo (worksheet)
        const ws = XLSX.utils.json_to_sheet(datosExportados);

        // Aplicar formato a la primera fila (encabezados)
        const headerStyle = {
            font: { bold: true }, // Negrita
            alignment: { horizontal: 'center' }, // Alinear al centro
        };
        ws["!cols"] = [{ width: 15 }, { width: 15 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 15 }, { width: 20 }];
        ws["!rows"] = [{ hidden: false }, { hidden: false, hpt: 24, hpx: 24 }, /* Agrega aquí el alto de las demás filas */];
        ws["A1"].s = headerStyle;
        ws["B1"].s = headerStyle;
        ws["C1"].s = headerStyle;
        ws["D1"].s = headerStyle;
        ws["E1"].s = headerStyle;
        ws["F1"].s = headerStyle;
        ws["G1"].s = headerStyle;
        // Aplicar ancho automático al contenido de las celdas
        ws['!autofilter'] = { ref: 'A1:Z1' }; // Establece un rango de autofiltro para todas las columnas

        // Agregar la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, "Jugadores");

        // Escribir el archivo Excel directamente al sistema de archivos del usuario
        XLSX.writeFile(wb, 'jugadores.xlsx');
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
        <div className="contenedorJugadores">
            <div className="jugadoresSection">
                <div className="jugadoresMenu">
                    <h2 className='jugadores'>Jugadores</h2>
                </div>
            </div>

            <div className="tablaJugadores">
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
                            <th className='thJugadores'>DNI</th>
                            <th className='thJugadores'>Apellido</th>
                            <th className='thJugadores'>Nombre</th>
                            <th className='thJugadores'>
                                <Button variant="primary" onClick={exportarExcel}>Exportar a Excel</Button>
                            </th>
                            {/* <th className='thJugadores'>Email</th> */}
                            {/* <th className='thJugadores'>Teléfono</th> */}
                            {/* <th className='thJugadores'>Localidad</th> */}
                        </tr>
                    </thead>
                    <tbody id="tbodyJugadores">
                        {
                            jugadores && jugadores.length > 0 ? (
                                jugadores
                                    .filter((item) => {
                                        // Filtra las convocatorias según el texto de búsqueda
                                        return (
                                            (item.idJugador && item.idJugador.toString().includes(busqueda)) ||
                                            (item.dni && item.dni.toString().includes(busqueda)) ||
                                            (item.apellido && item.apellido.toLowerCase().includes(busqueda)) ||
                                            (item.apellido && item.apellido.toUpperCase().includes(busqueda)) ||
                                            (item.nombre && item.nombre.toLowerCase().includes(busqueda)) ||
                                            (item.nombre && item.nombre.toLowerCase().includes(busqueda))) ||
                                            (formatoFecha(item.fechaNac) && formatoFecha(item.fechaNac).toString().includes(busqueda)) ||
                                            (item.correoElectronico && item.correoElectronico.toLowerCase().includes(busqueda)) ||
                                            (item.localidad && item.localidad.toLowerCase().includes(busqueda));
                                    })
                                    .slice(indexOfFirstItem, indexOfLastItem)
                                    .map((item, index) => (

                                        <tr key={index}>

                                            <td>{item.dni}</td>
                                            <td>{item.apellido}</td>
                                            <td>{item.nombre}</td>
                                            {/* <td>{formatoFecha(item.fechaNac)}</td> */}
                                            {/* <td>{item.correoElectronico}</td> */}
                                            {/* <td>{item.telefono}</td> */}
                                            {/* <td>{item.localidad}</td> */}
                                            <td className="acciones">

                                                <Button id='botonDatos' variant="secondary" onClick={() => verModalDatos(item)} className='btn-sm'>
                                                    Ver Datos
                                                </Button>
                                                <Button id='botonEditar' variant="success" onClick={() => verModalEditar(item)} className='btn-sm'>
                                                    Editar
                                                </Button>
                                                <Button id='botonEliminar' variant="danger" onClick={() => eliminarJugador(item)} className='btn-sm'>
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
                    {/* <Pagination>{itemsPaginacion}</Pagination> */}
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            disabled={currentPage === 1}
                            onClick={() => handleClick(currentPage - 1)}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next
                            disabled={currentPage === totalPages}
                            onClick={() => handleClick(currentPage + 1)}
                        />
                    </Pagination>
                </div>


            </div>

            <Modal show={showModalEditar} onHide={cerrarModalEditar}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar datos de jugador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {jugadorSeleccionado && (
                        <Form onSubmit={e => editarJugador(e)}>
                            <div className='row'>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formBasicDni">
                                        <Form.Label>DNI</Form.Label>
                                        <Form.Control type="number"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, dni: e.target.value })}
                                            value={jugadorSeleccionado.dni}
                                            className="campo" />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicApellido">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, apellido: e.target.value })}
                                            value={jugadorSeleccionado.apellido}
                                            className="campo" />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, nombre: e.target.value })}
                                            value={jugadorSeleccionado.nombre} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formBasicFecha">
                                        <Form.Label>Fecha Nac.</Form.Label>
                                        <Form.Control
                                            type="date"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, fechaNac: e.target.value })}
                                            value={formatoFecha(jugadorSeleccionado.fechaNac)}>                                              
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, correoElectronico: e.target.value })}
                                            value={jugadorSeleccionado.correoElectronico} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicTelefono">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, telefono: e.target.value })}
                                            value={jugadorSeleccionado.telefono} />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicLocalidad">
                                        <Form.Label>Localidad</Form.Label>
                                        <Form.Control type="text"
                                            onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, localidad: e.target.value })}
                                            value={jugadorSeleccionado.localidad} />
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


            <Modal className='modalDatos' show={showModalDatos} onHide={cerrarModalDatos}>
                <Modal.Header closeButton>
                    <Modal.Title>Datos de jugador</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {jugadorSeleccionado && (
                        <Form onSubmit={e => editarJugador(e)}>
                            <div className='row'>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formBasicApellido">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control type="text"
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, apellido: e.target.value })}
                                            value={jugadorSeleccionado.apellido}
                                            className="campo"
                                            disabled />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicNombre">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control type="text"
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, nombre: e.target.value })}
                                            value={jugadorSeleccionado.nombre}
                                            disabled />
                                    </Form.Group>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formBasicDni">
                                        <Form.Label>DNI</Form.Label>
                                        <Form.Control type="number"
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, dni: e.target.value })}
                                            value={jugadorSeleccionado.dni}
                                            className="campo"
                                            disabled />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3" controlId="formBasicFecha">
                                        <Form.Label>Fecha Nac.</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formatoFecha(jugadorSeleccionado.fechaNac)}
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, fechaNac: e.target.value })}
                                            disabled>

                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email"
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, correoElectronico: e.target.value })}
                                            value={jugadorSeleccionado.correoElectronico}
                                            disabled />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicTelefono">
                                        <Form.Label>Telefono</Form.Label>
                                        <Form.Control type="text"
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, telefono: e.target.value })}
                                            value={jugadorSeleccionado.telefono}
                                            disabled />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">

                                    <Form.Group className="mb-3" controlId="formBasicLocalidad">
                                        <Form.Label>Localidad</Form.Label>
                                        <Form.Control type="text"
                                            // onChange={(e) => setJugadorSeleccionado({ ...jugadorSeleccionado, localidad: e.target.value })}
                                            value={jugadorSeleccionado.localidad}
                                            disabled />
                                    </Form.Group>
                                </div>

                            </div>
                            {/* <Button variant="primary" type="submit">
                                Guardar
                            </Button> */}

                        </Form>
                    )}

                </Modal.Body>
            </Modal>
        </div >

    );
}