import React from 'react';

// clases de bootstrap
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

export function MiCard(props) {

    const { noticia } = props;

    let imagenesArray = [];
    try {
        imagenesArray = JSON.parse(noticia.imagenes) || [];;
        // console.log('imagenesArray es: ', imagenesArray)
    } catch (error) {
        console.error('Error al parsear el campo imagenes:', error);
    }

    const navigate = useNavigate();

    const verContenido = () => {
        navigate(`/noticiasContenido/${noticia.idNoticia}`);
    };

    return (
        <div className='card-container'>
            <Card>
                {imagenesArray.length > 0 && (
                    <Card.Img variant="top" src={imagenesArray[0]} />
                )}
                <Card.Body>
                    <Card.Title>{noticia.titulo}</Card.Title>
                    <Card.Text>
                        {noticia.descripcion}
                    </Card.Text>
                    <Button variant='primary'
                        onClick={verContenido}
                        id='botonVerNota'
                    >Ver Nota
                    </Button>
                </Card.Body>
            </Card>
        </div>
    )
}