import { SponsorsProp } from '../Props/sponsorsProp'
import './Autorizacion.css';

export function Autorizacion() {
    

    return (
        <>
            <div className="banner-container">
                <div className="banner">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='textoCircuito'>
                                    <p> <strong>Autorización exitosa. </strong></p>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <div className="content">
                                    <h3>Asociación Argentina de Jugadores de Padel (AJPP)</h3>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <SponsorsProp />
                        </div>
                    </div>
                </div >
            </div>


        </>
    )
}