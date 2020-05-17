import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter } from "mdbreact";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from 'react-icons/fa';

const FooterPage = () => {
    return (
        <MDBFooter color="blue" className="font-small pt-0 mt-0 footerColor footer fixed-bottom">
            <MDBContainer fluid className="text-center text-md-left " >
                <MDBRow style={{ display: "flex",  alignItems: "center"}}>
                    <MDBCol md="4" className="text-left">
                        <h5 style={{ color: 'white' }} >&copy; {new Date().getFullYear()} Copyright: moviePal </h5>
                    </MDBCol>
                    <MDBCol md="4" className="text-center">
                        <h5 style={{ color: 'white' }} > Partners: &nbsp;
                         <a style={{ color: "#F49F1C" }} href="https://www.themoviedb.org/" target="_blank">The Movie DB</a>
                         &nbsp; and &nbsp;
                                <a style={{ color: "#F49F1C" }} href="https://rapidapi.com/utelly/api/utelly" target="_blank">uTelly API on RapidAPI</a>
                        </h5>
                    </MDBCol>
                    <MDBCol md="4" className="text-right">
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

