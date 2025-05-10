import './CalendarioProp.css';

export function CalendarioProp(props) {
    return (
        <>
            <img className="fotoCalendario"
                src={props.imagen}

                onClick={() => props.modalFoto(props.imagen)}
                alt={`Calendario 2024`}
                fetchpriority='high' />

        </>
    )
}