import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Wallet, initMercadoPago } from '@mercadopago/sdk-react';
import { UserContext } from '../UserContext/UserContext';

export function MPPRUEBA({ idTorneo, idOrganizador, public_key }) {
    const { userData } = useContext(UserContext);

    const [preferenceId, setPreferenceId] = useState(null);

    // const baseURL = 'https://servidorajpp.onrender.com';
    const baseURL = 'https://api.srv805858.hstgr.cloud';


    useEffect(() => {
        if (public_key) {
            initMercadoPago(public_key);
            // console.log('SDK inicializado con public_key: ' + public_key);
        }
    }, [public_key]);
    
    // Crea la preferencia de pago en el backend y obtiene el preferenceId.
    useEffect(() => {
        const crearOrden = async () => {
            try {
                // console.log('idTorneo en checkout es :', idTorneo)
                // console.log('idOrganizador en checkout es :', idOrganizador)
                // console.log('public_key en checkout es: '.public_key)
                const response = await axios.post(`${baseURL}/api/v1/pagos/crearOrden`, { idTorneo, idOrganizador });
                // Asumiendo que tu backend retorna { id: <preferenceId> }
                const id = response.data.id;
                // console.log('Preference ID:', id);
                setPreferenceId(id);
            } catch (error) {
                console.error("Error al crear la preferencia:", error);
            }
        };

        crearOrden();
    }, []);

    const customization = {
        
    }

    return (
        <div>
            <div className='mp'>
                {preferenceId ? (
                    <Wallet
                        id="wallet_container"
                        publicKey={public_key}
                        initialization={{ preferenceId, redirectMode: 'blank' }}
                        customization={customization}
                        onSubmit={(data) => {
                            // console.log("Datos de retorno:", data);
                            // Aquí puedes manejar los datos de retorno del checkout
                        }}
                    />
                ) : (
                    <p>Cargando...</p>
                )}
            </div>
        </div>
    );
}
