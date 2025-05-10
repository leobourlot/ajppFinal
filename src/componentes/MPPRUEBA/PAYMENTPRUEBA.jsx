// PaymentNotification.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function PAYMENTPRUEBA({ onPaymentApproved, onPaymentReceived }) {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // const baseURL = 'https://servidorajpp.onrender.com';
        const baseURL = 'https://api.srv805858.hstgr.cloud';

        
        const socket = io(baseURL, {
            transports: ['websocket'], // Fuerza WebSockets
            secure: true
        }); // Ajusta la URL a la de tu servidor
        socket.on('connect', () => {
            console.log('Conectado a Socket.IO:', socket.id);
            setConnected(true);
        });

        socket.on('paymentApproved', (data) => {
            console.log('Evento paymentApproved recibido:', data);
            // Notifica al componente padre o actualiza el estado local
            if (onPaymentApproved) {
                onPaymentApproved(data);
            }
        });

        socket.on('disconnect', () => {
            console.log('Desconectado de Socket.IO');
            setConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, [onPaymentApproved]);

    // useEffect(() => {
    //     const handleMessage = (event) => {
    //         // Opcional: filtrar event.origin para seguridad
    //         console.log('Mensaje de pago recibido:', event.data);
    //         if (onPaymentReceived) {
    //             onPaymentReceived(event.data);
    //         }
    //     };

    //     window.addEventListener('message', handleMessage);
    //     return () => window.removeEventListener('message', handleMessage);
    // }, [onPaymentReceived]);

    return (
        <></>
    );
}
