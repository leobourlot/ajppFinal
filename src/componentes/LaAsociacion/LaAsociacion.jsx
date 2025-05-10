import Button from 'react-bootstrap/Button';
import './LaAsociacion.css';

//hook de react
import { useEffect, useState } from "react";
import { SponsorsProp } from '../Props/sponsorsProp';

export function LaAsociacion() {

    return (
        <>
            <div className='contenedorAsociacion'>
                <div className='container'>
                    <div className='row'>
                        <div>
                            <h1>Sitio web en construcción</h1>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='row'>
                            <SponsorsProp />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}