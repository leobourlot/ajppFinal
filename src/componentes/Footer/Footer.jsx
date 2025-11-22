import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
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
                            <a href="https://www.facebook.com/ajppargentina/"><i className="fab fa-facebook"></i></a>
                            <a href="https://www.youtube.com/@ajppargentina341"><i className="fab fa-youtube"></i></a>
                            <a href="https://www.instagram.com/ajppargentina/"><i className="fab fa-instagram"></i></a>
                            <a href="https://twitter.com/ajppargentina"><i className="fab fa-twitter"></i></a>
                            <p className='p-footer'>Copyright © 2024. AJPP Argentina. Todos los derechos reservados.</p>

                        </div>
                        <div>
                            <p className='p-footer-creador'>Sitio web desarrollado por <a href="https://www.bourderweb.com.ar" className='creador' target='_blank'>BOURDER WEB <img src= {bourder} alt='Logo Bourder Web' className='logoBourder'/> </a> </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );

}