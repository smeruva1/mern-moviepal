import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const FooterPage = () => {
    return (
        <MDBFooter color="blue" className="font-small pt-0 mt-0 footerColor footer fixed-bottom">
            <MDBContainer fluid className="text-center text-md-left " >
                <MDBRow>
                    <MDBCol md="3" style={{ justifyContent: "center", alignItems: "center" }}>
                        <h5>&copy; {new Date().getFullYear()} Copyright: moviePal </h5>
                    </MDBCol>
                    <MDBCol md="3" style={{ justifyContent: "center", alignItems: "center"}}>
                        <a href="https://www.themoviedb.org/">The Movie DB</a>
                    </MDBCol>
                    <MDBCol md="3" style={{ justifyContent: "center", alignItems: "center",}}>
                        <a href="https://rapidapi.com/utelly/api/utelly">uTelly API on RapidAPI</a>
                    </MDBCol>
                    <MDBCol md="3" style={{ justifyContent: "center", alignItems: "center",}}>
                        <FaFacebook size={24} style={{ color: 'white', margin: "10px" }} />
                        <FaInstagram size={24} style={{ color: 'white', margin: "10px" }} />
                        <FaTwitter size={24} style={{ color: 'white', margin: "10px" }} />
                        <FaPinterest size={24} style={{ color: 'white', margin: "10px" }} />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </MDBFooter >
    );
}

export default FooterPage;

