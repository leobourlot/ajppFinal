import './sponsorsProp.css';

export function SponsorsProp() {
    return (
        <>

            <div className='sponsors'>
                <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAJPP.png`)}
                        alt={`Sponsor`} />
                </div>
                <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAJPPAscenso.png`)}
                        alt={`Sponsor`} />
                </div>
                
                <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoMadma.png`)}
                        alt={`Sponsor`} />
                </div>
                <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoODpro.png`)}
                        alt={`Sponsor`} />
                </div>
                <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoODEA.png`)}
                        alt={`Sponsor`} />
                </div>
                <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoRoyalPadel.png`)}
                        alt={`Sponsor`} />
                </div>
                {/* <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAPA.png`)}
                        alt={`Sponsor`} />
                </div> */}
            </div>
        </>
    )
}