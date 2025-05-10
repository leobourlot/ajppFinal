import './MisTorneos.css';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Form, Button, Modal } from 'react-bootstrap';
import { UserContext } from '../UserContext/UserContext';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-bootstrap/Pagination';
import { SponsorsProp } from '../Props/sponsorsProp'
import Image from 'react-bootstrap/Image';



export function MisTorneos() {
    const { userData } = useContext(UserContext);
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';

    const navigate = useNavigate();

    const [showModalEditar, setShowModalEditar] = useState(false);

    // datos de convocatoria
    const [torneos, setTorneos] = useState(null);

    // Nuevo estado para controlar si se está modificando una convocatoria
    const [modificandoTorneo, setModificandoTorneo] = useState(false);

    // datos de los rivales disponibles
    const [provincias, setProvincias] = useState(null);

    // objeto para almacenar la informacion de la convocatoria
    const [torneo, setTorneo] = useState({ fechaInicio: '', fechaFinal: '', ciudad: '', provincia: '' });

    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);

    const [busqueda, setBusqueda] = useState('');

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
    }, []);

    const cerrarModalEditar = () => {
        setShowModalEditar(false);
        setTorneoSeleccionado(null);
    }

    const verModalEditar = (torneo) => {
        // console.log(torneo);
        // console.log(futbolista.posicion)
        // console.log(futbolista.pieHabil)
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
    // return fecha.toISOString().split('T')[0];
    // }

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

        // console.log('idJugador es: ', userData.user.idJugador)
        axios.get(baseURL + '/api/v1/jugadorTorneo/misInscriptos/' + userData.user.idJugador, {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })

            .then(resp => {
                const torneosData = resp.data.dato;

                // Filtrar los torneos para que solo se muestren los que aún no han finalizado
                const torneosFiltrados = torneosData.filter(torneo => {
                    const fechaFinalizacion = new Date(torneo.fechaFinal);
                    return fechaFinalizacion > fechaActual;
                });

                // Ordenar los torneos por la fecha de inicio
                torneosFiltrados.sort((a, b) => {
                    const fechaInicioA = new Date(a.fechaInicio);
                    const fechaInicioB = new Date(b.fechaInicio);
                    return fechaInicioA - fechaInicioB;
                });

                // Iterar sobre cada torneo para obtener la información completa de la provincia
                const torneosConProvinciaCompleta = torneosFiltrados.map(async (torneo) => {
                    try {
                        const provinciaResp = await axios.get(baseURL + `/api/v1/provincia/provincias/${torneo.provincia}`);
                        // console.log('provinciaResp es: ', provinciaResp)
                        const provinciaCompleta = provinciaResp.data; // Suponiendo que la respuesta contiene los datos completos de la provincia
                        // console.log('provinciaCompleta es: ', provinciaCompleta)
                        return { ...torneo, provincia: provinciaCompleta };
                    } catch (error) {
                        // console.log(`Error obteniendo la provincia para el torneo con ID ${torneo.id}:`, error);
                        return torneo; // Si hay un error, simplemente devolvemos el torneo sin modificar
                    }
                });

                // Esperar a que se completen todas las solicitudes para obtener la lista actualizada de torneos
                Promise.all(torneosConProvinciaCompleta)
                    .then((torneosActualizados) => {
                        // console.log('torneosActualizados es: ', torneosActualizados)
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

    return (
        <div className="contenedorMisTorneos">
            <div className='container'>
                <div className='row'>
                    <div className="convocatoria_section">
                        <div className="convocatoria_menu">
                            <h2 className='convocatoria'>Torneos a los que estoy inscripto</h2>
                        </div>
                    </div>

                    <div className="tablaConvocatoria">
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
                                </tr>
                            </thead>
                            <tbody id="tbody">
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


                </div >
                <div className='row'>
                    <SponsorsProp/>
                </div>
            </div>
        </div>

    );
}