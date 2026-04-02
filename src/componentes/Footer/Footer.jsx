import './Footer.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faYoutube, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import bourder from '../Img/logoBourder.svg'


export function Footer() {

    return (
        <footer>
            <div className='container'>
                <div className='containerFooter'>
                    <div className='row'>
                        <div className='col-md-6 col-sm-12'>
                            <p id='nombreEmpresaFooter'>AJPP - Asociación de Jugadores Profesionales de Padel</p>
                            <div className='datosFooter'>
                                <p className="p-info">Email: ajppargentina@gmail.com</p>
                            </div>
                        </div>
                        <div className='col-md-6 col-sm-12'>
                            <a href="https://www.facebook.com/ajppargentina/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faFacebook} className="fab" /></a>
                            <a href="https://www.youtube.com/@ajppargentina341" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYoutube} className="fab" /></a>
                            <a href="https://www.instagram.com/ajppargentina/" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faInstagram} className="fab" /></a>
                            <a href="https://twitter.com/ajppargentina" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTwitter} className="fab" /></a>
                            <p className='p-footer'>Copyright © 2024. AJPP Argentina. Todos los derechos reservados.</p>

                        </div>
                        <div>
                            <p className='p-footer-creador'>Sitio web desarrollado por <a href="https://www.bourderweb.com.ar" className='creador' target='_blank' rel="noopener noreferrer">BOURDER WEB <img src= {bourder} alt='Logo Bourder Web' className='logoBourder'/> </a> </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );

}