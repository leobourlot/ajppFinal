import React, { useState, Suspense, lazy } from 'react';

import './App.css';


//mis compnentes
import { Header } from './componentes/Header/Header';
import { Footer } from './componentes/Footer/Footer';
import { UserProvider } from './componentes/UserContext/UserContext';
import { HashRouter, BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './componentes/ProtectedRoute/ProtectedRoute';

// Lazy load components
const Inicio = lazy(() => import('./componentes/Inicio/Inicio').then(module => ({ default: module.Inicio })));
const Contacto = lazy(() => import('./componentes/Contacto/Contacto').then(module => ({ default: module.Contacto })));
const Login = lazy(() => import('./componentes/Login/Login').then(module => ({ default: module.Login })));
const Dashboard = lazy(() => import('./componentes/Dashboard/Dashboard').then(module => ({ default: module.Dashboard })));
const LaAsociacion = lazy(() => import('./componentes/LaAsociacion/LaAsociacion').then(module => ({ default: module.LaAsociacion })));
const Noticias = lazy(() => import('./componentes/Noticias/Noticias').then(module => ({ default: module.Noticias })));
const Calendario = lazy(() => import('./componentes/Calendario/Calendario').then(module => ({ default: module.Calendario })));
const Ranking = lazy(() => import('./componentes/Ranking/Ranking').then(module => ({ default: module.Ranking })));
const Torneo = lazy(() => import('./componentes/Torneo/Torneo').then(module => ({ default: module.Torneo })));
const Registro = lazy(() => import('./componentes/Registro/Registro').then(module => ({ default: module.Registro })));
const Administrador = lazy(() => import('./componentes/Administrador/Administrador').then(module => ({ default: module.Administrador })));
const VerInscriptos = lazy(() => import('./componentes/VerInscriptos/VerInscriptos').then(module => ({ default: module.VerInscriptos })));
const MisTorneos = lazy(() => import('./componentes/MisTorneos/MisTorneos').then(module => ({ default: module.MisTorneos })));
const Jugadores = lazy(() => import('./componentes/Jugadores/Jugadores').then(module => ({ default: module.Jugadores })));
const Imagenes = lazy(() => import('./componentes/Imagenes/Imagenes').then(module => ({ default: module.Imagenes })));
const NoticiasContenido = lazy(() => import('./componentes/Noticias/NoticiasContenido').then(module => ({ default: module.NoticiasContenido })));
const GestionarNoticias = lazy(() => import('./componentes/GestionarNoticias/GestionarNoticias').then(module => ({ default: module.GestionarNoticias })));
const Organizadores = lazy(() => import('./componentes/Organizadores/Organizadores').then(module => ({ default: module.Organizadores })));
const InscripcionPrueba = lazy(() => import('./componentes/InscripcionPrueba/InscripcionPrueba').then(module => ({ default: module.InscripcionPrueba })));
const Autorizacion = lazy(() => import('./componentes/Autorizacion/Autorizacion').then(module => ({ default: module.Autorizacion })));
const Rechazo = lazy(() => import('./componentes/Rechazo/Rechazo').then(module => ({ default: module.Rechazo })));


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
					<Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
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
					</Suspense>
				</UserProvider>
				<Footer />
			</HashRouter>
		</>
	);
}


export default App;
