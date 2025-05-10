import React, { useState } from 'react';

import './App.css';


//mis compnentes
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { Inicio } from './componentes/Inicio/Inicio';
import { Contacto } from './componentes/Contacto/Contacto';
import { Login } from './componentes/Login/Login';
import { Dashboard } from './componentes/Dashboard/Dashboard';
import { UserProvider } from './componentes/UserContext/UserContext';
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './componentes/ProtectedRoute/ProtectedRoute';
import { LaAsociacion } from './componentes/LaAsociacion/LaAsociacion';
import { Noticias } from './componentes/Noticias/Noticias';
import { Calendario } from './componentes/Calendario/Calendario';
import { Ranking } from './componentes/Ranking/Ranking';
import { Torneo } from './componentes/Torneo/Torneo';
import { Registro } from './componentes/Registro/Registro';
// import { Inscripcion } from './componentes/Inscripcion/Inscripcion';
import { Administrador } from './componentes/Administrador/Administrador';
import { VerInscriptos } from './componentes/VerInscriptos/VerInscriptos';
import { MisTorneos } from './componentes/MisTorneos/MisTorneos';
import { Jugadores } from './componentes/Jugadores/Jugadores';
import { Imagenes } from './componentes/Imagenes/Imagenes';
import { NoticiasContenido } from './componentes/Noticias/NoticiasContenido';
import { GestionarNoticias } from './componentes/GestionarNoticias/GestionarNoticias';
import { Organizadores } from './componentes/Organizadores/Organizadores';
// import { PaymentNotification } from './componentes/MercadoPagoCheckOut/PaymentNotification';
import { InscripcionPrueba } from './componentes/InscripcionPrueba/InscripcionPrueba';
import { Autorizacion } from './componentes/Autorizacion/Autorizacion';
import { Rechazo } from './componentes/Rechazo/Rechazo';


function App() {

	// const [paymentData, setPaymentData] = useState(null);

	// const handlePaymentReceived = (data) => {
	// 	console.log("Datos de pago recibidos en App:", data);
	// 	setPaymentData(data);
	// 	// Aquí puedes actualizar otros estados o realizar acciones, como habilitar el botón de inscripción.
	// };

	return (
		<>
			<HashRouter>
				<UserProvider>
					<Header />
					{/* <PaymentNotification onPaymentReceived={handlePaymentReceived} /> */}
					<Routes>
						<Route path='/' element={<Inicio />} />
						<Route path='/autorizacion' element={<Autorizacion />} />
						<Route path='/rechazo' element={<Rechazo />} />
						<Route path='/laAsociacion' element={<LaAsociacion />} />
						<Route path='/noticias' element={<Noticias />} />
						<Route path='/noticiasContenido/:id' element={<NoticiasContenido />} />
						<Route path='/calendario' element={<Calendario />} />
						<Route path='/ranking' element={<Ranking />} />
						<Route path='/contacto' element={<Contacto />} />
						<Route path='/login' element={<Login />} />
						<Route path='/registro' element={<Registro />} />
						{/* <Route path='/inscripcion' element={<Inscripcion />} /> */}
						<Route path='/torneo' element={<Torneo />} />

						<Route path='/privado/'
							element={
								// ruta protegida para usuarios logueados, jugador
								<ProtectedRoute mustBeJugador={true}>
									{<Inicio />}
								</ProtectedRoute>
							} />

						<Route path='/privado/administrador'
							element={
								// ruta protegida para usuarios logueados, administrador
								<ProtectedRoute mustBeAdministrador={true}>
									{<Administrador />}
								</ProtectedRoute>
							} />

						<Route path='/privado/verInscriptos'
							element={
								// ruta protegida para usuarios logueados, administrador
								<ProtectedRoute mustBeAdministrador={true}>
									{<VerInscriptos />}
								</ProtectedRoute>
							} />

						<Route path='/privado/jugadores'
							element={
								// ruta protegida para usuarios logueados, administrador
								<ProtectedRoute mustBeAdministrador={true}>
									{<Jugadores />}
								</ProtectedRoute>
							} />



						<Route path='/privado/dashboard'
							element={
								// ruta protegida para usuarios logueados, presidente o entrendor
								<ProtectedRoute mustBeAdministrador={false}>
									{<Dashboard />}
								</ProtectedRoute>
							} />

						<Route path='/privado/torneo'
							element={
								<ProtectedRoute mustBeAdministrador={true}>
									<Torneo />
								</ProtectedRoute>
							} />

						<Route path='/privado/imagenes'
							element={
								<ProtectedRoute mustBeAdministrador={true}>
									<Imagenes />
								</ProtectedRoute>
							} />

						<Route path='/privado/gestionarNoticias'
							element={
								<ProtectedRoute mustBeAdministrador={true}>
									<GestionarNoticias />
								</ProtectedRoute>
							} />

						<Route path='/privado/organizadores'
							element={
								<ProtectedRoute mustBeAdministrador={true}>
									<Organizadores />
								</ProtectedRoute>
							} />

						<Route path='/privado/misTorneos'
							element={
								<ProtectedRoute mustBeJugador={false}>
									<MisTorneos />
								</ProtectedRoute>
							} />

						<Route path='/privado/inscripcion'
							element={
								// ruta protegida para usuarios logueados de tipo entrenador
								<ProtectedRoute mustBeJugador={false}>
									{<InscripcionPrueba />}
								</ProtectedRoute>
							} />
						{/* <Route path='/privado/inscripcionPrueba'
							element={
								// ruta protegida para usuarios logueados de tipo entrenador
								<ProtectedRoute mustBeJugador={false}>
									{<InscripcionPrueba />}
								</ProtectedRoute>
							} /> */}
					</Routes>
				</UserProvider>
				<Footer />
			</HashRouter>
		</>
	);
}


export default App;
