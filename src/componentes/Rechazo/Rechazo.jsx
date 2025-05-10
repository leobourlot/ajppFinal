import { SponsorsProp } from '../Props/sponsorsProp'
import './Rechazo.css';

export function Rechazo() {
    

    return (
        <>
            <div className="banner-container">
                <div className="banner">
                    <div className='container'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='textoRechazo'>
                                    <p> <strong>El pago fue rechazado por Mercado Pago. </strong></p>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12'>
                                <div className="content">
                                    <h3>Por favor, intenta nuevamente en unos minutos, o con otro método de pago.</h3>
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