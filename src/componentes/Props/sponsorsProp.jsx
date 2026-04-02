import './sponsorsProp.css';

export function SponsorsProp() {
    return (
        <>

            <div className='sponsors'>
                <div>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAJPP.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div>

                <div>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAtomik.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div>
                <div>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoSixty.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div>
                <div>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoOdpro2026.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div>
                {/* <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoRoyalPadel.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div> */}
                <div>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAJPPAscenso.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div>
                {/* <div className='col-3 col-sm-3 col-md-3 col-lg-1'>
                    <img className="fotoSponsor"
                        src={require(`../Img/LogoAPA.png`)}
                        alt={`Sponsor`}
                        loading="lazy" />
                </div> */}
            </div>
        </>
    )
}