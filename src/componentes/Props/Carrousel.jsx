import Carousel from 'react-bootstrap/Carousel';
import './Carrousel.css';


export function Carrousel (){
    return (
        <Carousel data-bs-theme="dark">
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require('../Img/1.webp')}
                    alt="Detectores Standgas"
                    fetchpriority="high"
                />

            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require('../Img/2.webp')}
                    alt="Seguridad"
                />

            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={require('../Img/3.webp')}
                    alt="Túneles"
                />

            </Carousel.Item>

        </Carousel>
    )
}