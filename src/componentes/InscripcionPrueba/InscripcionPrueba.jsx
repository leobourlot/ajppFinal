import { Button, Table, Modal, Form, Placeholder } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Registro } from '../Registro/Registro';
import axios from 'axios';
import './InscripcionPrueba.css';
import { UserContext } from '../UserContext/UserContext';
import { SponsorsProp } from '../Props/sponsorsProp';
import { MPPRUEBA } from '../MPPRUEBA/MPPRUEBA'
import { PAYMENTPRUEBA } from '../MPPRUEBA/PAYMENTPRUEBA'


export function InscripcionPrueba() {
    const { userData } = useContext(UserContext);
    // const baseURL = 'https://servidorajpp.eu-north-1.elasticbeanstalk.com';
    // const baseURL = 'https://retrieval-obligations-anti-duke.trycloudflare.com';
    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';


    const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
    const [torneos, setTorneos] = useState(null);
    const [public_key, setPublicKey] = useState(null);
    const [inscribiendoTorneo, setInscribiendoTorneo] = useState(false);

    const [dniJugador2, setDniJugador2] = useState('');
    const [jugador2, setJugador2] = useState(null)
    const [paymentApproved, setPaymentApproved] = useState(false);


    useEffect(() => {
        buscarTorneos();

        // console.log('paymentaproved es: ', paymentApproved)

        if (torneoSeleccionado) {
            // console.log('torneoSeleccionado es: ', torneoSeleccionado);
            // console.log('idJugador es: ', userData.user.idJugador)
        } else {
            console.log('ningun torneo seleccionado');
        }

    }
        , []);

    useEffect(() => {
        if (torneoSeleccionado && torneoSeleccionado.idOrganizador) {
            obtenerKey();
        }
    }, [torneoSeleccionado]);

    const buscarTorneos = async () => {
        try {
            const resp = await axios.get(baseURL + '/api/v1/torneo/torneos', {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            });

            const torneosInscripcionAbierta = resp.data.dato.filter(torneo => torneo.activo === 1);

            const torneosFiltrados = torneosInscripcionAbierta
                .filter(torneo => {
                    const fechaInicio = new Date(torneo.fechaInicio);
                    const hoy = new Date();
                    const diferenciaDias = Math.ceil((fechaInicio - hoy) / (1000 * 60 * 60 * 24));
                    return diferenciaDias >= 0;
                })
                .slice(0, 10);

            // Iterar sobre cada torneo para obtener la información completa de la provincia
            const torneosConProvinciaCompletaPromesas = torneosFiltrados.map(async (torneo) => {
                try {
                    const provinciaResp = await axios.get(baseURL + `/api/v1/provincia/provincias/${torneo.provincia}`);
                    const provinciaCompleta = provinciaResp.data; // Suponiendo que la respuesta contiene los datos completos de la provincia
                    return { ...torneo, provincia: provinciaCompleta };
                } catch (error) {
                    // console.log(`Error obteniendo la provincia para el torneo con ID ${torneo.id}:`, error);
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
        } catch (error) {
            console.log('Falló la petición get: ', error);
        }
    };

    useEffect(() => {
        // console.log('paymentApproved actualizado:', paymentApproved);
    }, [paymentApproved]);

    const consultarDni = async () => {

        // console.log('dniJugador2 antes del get es: ', dniJugador2)

        axios.get(baseURL + '/api/v1/jugadorTorneo/consulta/' + dniJugador2, {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                const datosJugador2 = resp.data.dato


                setJugador2(datosJugador2);


                // console.log('jugador1 es: ', userData.user.idJugador)
                // console.log('jugador2 es: ', datosJugador2)
                // console.log('torneoSeleccionado es: ', torneoSeleccionado)

                if (datosJugador2) {
                    // Si se encontró un jugador, mostrar el formulario con los datos del jugador encontrado
                    setInscribiendoTorneo(true);
                } else {
                    // Si no se encontró ningún jugador, mostrar un mensaje de alerta
                    alert("El jugador 2 no está registrado en el sistema. Debe registrarse primero.");
                }

            })
            .catch(error => {
                console.log('Falló la petición get: ', error);
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

    const enviarDatosInscripcion = () => {

        if (torneoSeleccionado) {
            // ID del torneo seleccionado
            const idTorneo = torneoSeleccionado;

            // IDs del jugador seleccionado
            const idJugador1 = userData.user.idJugador;
            const idJugador2 = jugador2.idJugador;

            // Objeto con ID del torneo y del jugador
            const datosTorneo = {
                idTorneo: idTorneo,
                idJugador1: idJugador1,
                idJugador2: idJugador2,
            };
            // POST al servidor para guardar la convocatoria
            // console.log('datosTorneo antes del post es: ', datosTorneo)
            axios.post(baseURL + '/api/v1/jugadorTorneo/inscripcion', datosTorneo, {
                headers: {
                    Authorization: `Bearer ${userData.token}`
                }
            })
                .then(resp => {
                    // console.log(resp.data.msj);
                    // console.log('los datos del torneo guardados son: ', resp.data.jugadorTorneo);
                    alert(resp.data.msj);
                    setTorneoSeleccionado(null)

                    const jugador1Correo = userData.user.correoElectronico;
                    const jugador2Correo = jugador2.correoElectronico;

                    // Enviar información al servidor para el envío del correo
                    enviarCorreoInscripcion(jugador1Correo, jugador2Correo);
                })
                .catch(error => {
                    console.error('error es: ', error);
                    alert(error.response.data.msj)
                    setTorneoSeleccionado(null)

                });
        }
        else {
            alert("Selecciona un torneo.");
        }
    };

    const enviarCorreoInscripcion = (correoJugador1, correoJugador2) => {
        // Objeto con los datos del correo
        const datosCorreo = {
            nombre1: userData.user.nombre,
            apellido1: userData.user.apellido,
            nombre2: jugador2.nombre,
            apellido2: jugador2.apellido,
            correoJugador1: correoJugador1,
            correoJugador2: correoJugador2
            // Otros datos relevantes para el correo de inscripción
        };

        // console.log('datosCorreo es: ', datosCorreo)
        // 'https://servidorajpp.onrender.com/api/v1/publico/contacto'
        // POST al servidor para enviar el correo
        axios.post(baseURL + '/api/v1/publico/inscripcion', datosCorreo, {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                // console.log(resp.data.respuesta);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handlePaymentApproved = (data) => {
        // console.log('Pago aprobado recibido:', data);
        setPaymentApproved(true);
    };

    const obtenerKey = async () => {

        if (!torneoSeleccionado || !torneoSeleccionado.idOrganizador) {
            // console.log('No se tiene el idOrganizador');
            return;
        }
        // console.log('idOrganizador antes del get es: ', torneoSeleccionado.idOrganizador);

        axios.get(baseURL + '/api/v1/organizador/' + torneoSeleccionado.idOrganizador, {
            headers: {
                Authorization: `Bearer ${userData.token}`
            }
        })
            .then(resp => {
                const organizador = resp.data.dato
                // console.log('organizador es: ', organizador)
                setPublicKey(organizador[0].public_key);
                // console.log('publicKey es: ', organizador[0].public_key)


                // setPublicKey(public_key);


                // console.log('jugador1 es: ', userData.user.idJugador)
                // console.log('jugador2 es: ', datosJugador2)
                // console.log('torneoSeleccionado es: ', torneoSeleccionado)



            })
            .catch(error => {
                console.log('Falló la petición get: ', error);
            })
    }



    return (
        <>
            <div className="inscripcionForm">
                <div className='container'>
                    <div className='row'>
                        <div className='col-12'>
                            <nav className="tituloInscripcion">
                                <h2>Inscripción a torneos</h2>
                            </nav>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='selectTorneosInscripcion'>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-6'>
                                        <label>Torneos: </label>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12 col-sm-6'>
                                        <select
                                            className='optionsTorneos'
                                            value={torneoSeleccionado ? torneoSeleccionado.idTorneo : ''}
                                            onChange={(e) => {
                                                const selectedId = e.target.value;
                                                // Buscá el torneo completo a partir del id seleccionado:
                                                const selectedTorneo = torneos.find(t => t.idTorneo.toString() === selectedId);
                                                setTorneoSeleccionado(selectedTorneo);
                                            }}
                                        >
                                            <option value="">Selecciona un torneo</option>
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
                            <h2 className='datosJugador'>Datos del jugador</h2>
                        </div>
                    </div>

                    <div className="jugadores-container">
                        <div className="jugadores-form">
                            <Form id='formJugador1'>
                                <div className='row'>
                                    <div className="col-lg-2 col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicDni">
                                            <Form.Label className='labelJugador1'>DNI</Form.Label>
                                            <Form.Control className='inputJugador1'
                                                type="text"
                                                value={userData.user.dni}
                                                disabled />
                                        </Form.Group>
                                    </div>
                                    <div className="col-lg-2 col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicApellido">
                                            <Form.Label className='labelJugador1'>Apellido</Form.Label>
                                            <Form.Control className='inputJugador1'
                                                type="text"
                                                value={userData.user.apellido}
                                                disabled />
                                        </Form.Group>
                                    </div>
                                    <div className="col-lg-2 - col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicNombre">
                                            <Form.Label className='labelJugador1'>Nombre</Form.Label>
                                            <Form.Control className='inputJugador1'
                                                type="text"
                                                value={userData.user.nombre}
                                                disabled />
                                        </Form.Group>
                                    </div>
                                    <div className="col-lg-2 col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicCorreo">
                                            <Form.Label className='labelJugador1'>Correo electrónico</Form.Label>
                                            <Form.Control className='inputJugador1'
                                                type="email"
                                                value={userData.user.correoElectronico}
                                                disabled />
                                        </Form.Group>
                                    </div>
                                    <div className="col-lg-2 col-md-6">
                                        <Form.Group className="mb-3" controlId="formBasicLocalidad">
                                            <Form.Label className='labelJugador1'>Localidad</Form.Label>
                                            <Form.Control className='inputJugador1'
                                                type="text"
                                                value={userData.user.localidad}
                                                disabled />
                                        </Form.Group>
                                    </div>
                                </div>
                            </Form>

                            <div className='consultaDniJugador2'>
                                <Form onSubmit={(e) => e.preventDefault()}>
                                    <div className='row'>
                                        <div className="col-md-4">
                                            <Form.Group className="mb-3" controlId="formBasicDni">
                                                <Form.Label className='labelConsulta'>Ingrese DNI del jugador 2</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={(e) => {
                                                        setDniJugador2(e.target.value)
                                                    }}
                                                    placeholder='DNI sin puntos'
                                                    value={dniJugador2}
                                                    // pattern="[0-9]{1,8}"
                                                    required />
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-2">
                                            <div className='contenedorBotonRegistrarme'>
                                                <Button id='botonRegistro' variant="primary" type="submit" onClick={consultarDni}>
                                                    Consultar
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>

                            </div>

                            {inscribiendoTorneo && jugador2 ? (

                                <div className="form_convocatoria">
                                    <div className='row'>
                                        <div className='col-12'>
                                            <h2 className='datosJugador2'>Datos del jugador 2</h2>
                                        </div>
                                    </div>
                                    <Form>
                                        <div className='row'>
                                            <div className="col-lg-2 col-md-6">
                                                <Form.Group className="mb-3" controlId="formBasicDni">
                                                    <Form.Label className='labelJugador1'>DNI</Form.Label>
                                                    <Form.Control className='inputJugador1'
                                                        type="text"
                                                        value={jugador2.dni}
                                                        disabled />
                                                </Form.Group>
                                            </div>
                                            <div className="col-lg-2 col-md-6">
                                                <Form.Group className="mb-3" controlId="formBasicApellido">
                                                    <Form.Label className='labelJugador1'>Apellido</Form.Label>
                                                    <Form.Control className='inputJugador1'
                                                        type="text"
                                                        value={jugador2.apellido}
                                                        disabled />
                                                </Form.Group>
                                            </div>
                                            <div className="col-lg-2 col-md-6">
                                                <Form.Group className="mb-3" controlId="formBasicNombre">
                                                    <Form.Label className='labelJugador1'>Nombre</Form.Label>
                                                    <Form.Control className='inputJugador1'
                                                        type="text"
                                                        value={jugador2.nombre}
                                                        disabled />
                                                </Form.Group>
                                            </div>

                                            <div className="col-lg-2 col-md-6">
                                                <Form.Group className="mb-3" controlId="formBasicCorreo">
                                                    <Form.Label className='labelJugador1'>Correo electrónico</Form.Label>
                                                    <Form.Control className='inputJugador1'
                                                        type="email"
                                                        value={jugador2.correoElectronico}
                                                        disabled />
                                                </Form.Group>
                                            </div>
                                            <div className="col-lg-2 col-md-6">
                                                <Form.Group className="mb-3" controlId="formBasicLocalidad">
                                                    <Form.Label className='labelJugador1'>Localidad</Form.Label>
                                                    <Form.Control className='inputJugador1'
                                                        type="text"
                                                        value={jugador2.localidad}
                                                        disabled />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </Form>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {torneoSeleccionado && jugador2 && public_key && torneoSeleccionado.formaPago === 'mercadoPago' && (
                        // console.log('torneoSeleccionado es: ', torneoSeleccionado),
                        <div className='row'>
                            <div className='col-12'>
                                <div className='mp'>
                                    <h5>Costo de inscripción: $ {torneoSeleccionado.costoInscripcion} por cada jugador.</h5>
                                    <MPPRUEBA
                                        idTorneo={torneoSeleccionado?.idTorneo}
                                        idOrganizador={torneoSeleccionado?.idOrganizador}
                                        public_key={public_key}
                                    />
                                    <PAYMENTPRUEBA onPaymentApproved={handlePaymentApproved} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className='row'>
                        <div className='col-12'>
                            <div id='botonInscribir'>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    onClick={enviarDatosInscripcion}
                                    // disabled={!(torneoSeleccionado && paymentApproved)}
                                    // disabled={!torneoSeleccionado}
                                    disabled={torneoSeleccionado
                                        ? torneoSeleccionado.formaPago === 'mercadoPago'
                                            ? !paymentApproved  // Si es "mercadoPago": el botón está deshabilitado si paymentApproved es false
                                            : false           // Si es "otro": el botón no está deshabilitado (o podrías poner otra condición)
                                        : true // Si no hay torneo seleccionado, deshabilitado
                                    }
                                >
                                    Inscribirme a torneo
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <SponsorsProp />
                    </div>
                </div>
            </div>
        </>
    );
}