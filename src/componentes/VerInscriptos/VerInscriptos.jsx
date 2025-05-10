import { Button, Table, Modal } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import * as XLSX from 'xlsx';
import Image from 'react-bootstrap/Image';

import axios from 'axios';
import './VerInscriptos.css';
import { UserContext } from '../UserContext/UserContext';


export function VerInscriptos() {
    const { userData } = useContext(UserContext);
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';

    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
    const [jugadorTorneoSeleccionado, setJugadorTorneoSeleccionado] = useState(null);
    const [datos, setDatos] = useState([]);
    const [torneos, setTorneos] = useState(null);


    useEffect(() => {
        buscarTorneos();
        // console.log('torneos es: ', torneos)
        if (torneoSeleccionado) {
            // función para mostrar boton de inscribirse
            // console.log('torneoSeleccionado despes del set es: ', torneoSeleccionado)

            // console.log('idJugador es: ', userData.user.idJugador)
            buscarInscriptos();

        } else {
            setDatos([]);
            // console.log('ningun torneo seleccionado');
        }
    }
        , [torneoSeleccionado]);

    const buscarTorneos = async () => {
        const fechaActual = new Date();

        try {
            const resp = await axios.get(baseURL + '/api/v1/torneo/torneos', {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })

            const torneosData = resp.data.dato;

            const torneosFiltrados = torneosData.filter(torneo => {
                const fechaFinalizacion = new Date(torneo.fechaFinal);
                const diferenciaEnMilisegundos = fechaActual - fechaFinalizacion;
                const diferenciaEnDias = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
                return (diferenciaEnDias >= 0 && diferenciaEnDias <= 8) || fechaFinalizacion > fechaActual;
            });


            // Iterar sobre cada torneo para obtener la información completa de la provincia
            const torneosConProvinciaCompletaPromesas = torneosFiltrados.map(async (torneo) => {
                try {
                    const provinciaResp = await axios.get(baseURL + `/api/v1/provincia/provincias/${torneo.provincia}`);
                    const provinciaCompleta = provinciaResp.data; // Suponiendo que la respuesta contiene los datos completos de la provincia
                    return { ...torneo, provincia: provinciaCompleta };
                } catch (error) {
                    console.log(`Error obteniendo la provincia para el torneo con ID ${torneo.id}:`, error);
                    return torneo; // Si hay un error, simplemente devolvemos el torneo sin modificar
                }
            });

            const torneosConProvinciaCompleta = await Promise.all(torneosConProvinciaCompletaPromesas);

            torneosConProvinciaCompleta.sort((a, b) => {
                const fechaInicioA = new Date(a.fechaInicio);
                const fechaInicioB = new Date(b.fechaInicio);
                return fechaInicioA - fechaInicioB;
            });

            // console.log('torneosConProvinciaCompleta es: ', torneosConProvinciaCompleta)
            // Esperar a que se completen todas las solicitudes para obtener la lista actualizada de torneos
            setTorneos(torneosConProvinciaCompleta);
            // console.log('torneos es: ', torneos)
            // setTorneos(resp.data.dato);


        } catch (error) {
            console.log('Falló la petición get: ', error);
        }
    };

    const buscarInscriptos = async () => {
        // console.log('torneoSeleccionado en buscarInscriptos es: ', torneoSeleccionado)
        axios.get(baseURL + '/api/v1/jugadorTorneo/jugadorTorneo/' + torneoSeleccionado, {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })
            .then(resp => {

                // console.log(resp.data.dato);
                setDatos(resp.data.dato);
            })
            .catch(error => {
                console.log(error);
            })
    }



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

    const exportarExcel = () => {
        // Seleccionar solo las columnas que deseas exportar
        const datosExportados = datos.map(item => ({
            jugador1: (item.apellidoJugador1 + ', ' + item.nombreJugador1),
            dniJugador1: item.dniJugador1,
            telefonoJugador1: item.telefonoJugador1,
            jugador2: (item.apellidoJugador2 + ', ' + item.nombreJugador2),
            dniJugador2: item.dniJugador2,
            telefonoJugador2: item.telefonoJugador2
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
        ws["!cols"] = [{ width: 35 }, { width: 15 }, { width: 15 }, { width: 35 }, { width: 15 }, { width: 15 }];
        ws["!rows"] = [{ hidden: false }, { hidden: false, hpt: 24, hpx: 24 }, /* Agrega aquí el alto de las demás filas */];
        ws["A1"].s = headerStyle;
        ws["B1"].s = headerStyle;
        ws["C1"].s = headerStyle;
        ws["D1"].s = headerStyle;
        ws["E1"].s = headerStyle;
        ws["F1"].s = headerStyle;
        // Aplicar ancho automático al contenido de las celdas
        ws['!autofilter'] = { ref: 'A1:Z1' }; // Establece un rango de autofiltro para todas las columnas

        // Agregar la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(wb, ws, "Inscriptos");

        // Escribir el archivo Excel directamente al sistema de archivos del usuario
        XLSX.writeFile(wb, 'inscriptos.xlsx');
    };

    const eliminarPareja = (jugadorTorneo) => {

        if (jugadorTorneo) {

            // console.log(futbolista.posicion)
            // console.log(futbolista.pieHabil)
            // setJugadorTorneoSeleccionado(jugadorTorneo)
            confirm('¿Está seguro que desea eliminar la pareja seleccionada?');
            // console.log('pareja en eliminar es: ', jugadorTorneo);
            // console.log('idJugadoresTorneos en eliminar es: ', jugadorTorneo.idJugadoresTorneos)
            if (jugadorTorneo) {
                axios.delete(baseURL + '/api/v1/jugadorTorneo/eliminar/' + jugadorTorneo.idJugadoresTorneos, {
                    headers: {
                        Authorization: `Bearer ${userData.token}`
                    }
                })
                    .then((res) => {
                        if (res.data.estado === 'OK') {
                            buscarInscriptos();
                            // setTorneoSeleccionado(null);
                            // setTorneo({ fechaInicio: '', fechaFinal: '', ciudad: '', provincia: '' });
                            // setModificandoTorneo(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        } else {
            console.error('Seleccione una pareja a eliminar.')
        }

    };

    return (
        <>
            <div className="jugadores_form">
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <nav className="jugadores_menu">
                                <h2>Ver jugadores inscriptos</h2>
                            </nav>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='selectTorneos'>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-6'>
                                        <label>Torneos:</label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-6'>
                                        <select
                                            className='optionsTorneos'
                                            value={torneoSeleccionado || ''}
                                            onChange={(e) => setTorneoSeleccionado(e.target.value)}
                                        >
                                            <option value=''>Selecciona un torneo</option>
                                            {torneos?.map((torneo) => (
                                                <option key={torneo.idTorneo} value={torneo.idTorneo}>
                                                    {formatearFecha(torneo.fechaInicio, torneo.fechaFinal)} - {torneo.ciudad} - {torneo.provincia.dato[0].nombreProvincia}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='row'>
                        <div className='col-12'>
                            <div id='tablaInscriptos'>
                                <Table striped bordered hover>
                                    <thead id='headTabla'>
                                        <tr>
                                            <th className='thInscriptos'>Jugador 1</th>
                                            <th className='thInscriptos'>DNI Jugador 1</th>
                                            <th className='thInscriptos'>Jugador 2</th>
                                            <th className='thInscriptos'>DNI Jugador 2</th>
                                            <th className='thInscriptos'>
                                                <Button variant="primary" onClick={exportarExcel}>Exportar a Excel</Button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            datos ? (
                                                datos

                                                    .map((item, index) => (
                                                        <tr key={index}>

                                                            <td><strong>{item.apellidoJugador1 + ', ' + item.nombreJugador1}</strong></td>
                                                            <td>{item.dniJugador1}</td>
                                                            <td><strong>{item.apellidoJugador2 + ', ' + item.nombreJugador2}</strong></td>
                                                            <td>{item.dniJugador2}</td>
                                                            <td className='tdAcciones'>
                                                                <Button id='botonEliminarPareja' variant="danger" onClick={() => {
                                                                    // console.log('item es: ', item),
                                                                        eliminarPareja(item)
                                                                }} className='btn-sm'>
                                                                    Eliminar
                                                                </Button>

                                                            </td>

                                                        </tr>
                                                    )))
                                                : <></>
                                        }

                                    </tbody>

                                </Table>
                            </div>

                        </div>
                        <div className='col-md-6'>


                        </div>
                    </div>
                </div>
            </div>

        </>
    )




}