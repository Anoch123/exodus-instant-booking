import { DEVELOPER_COMPANY, SYSTEM_INFORMATION } from "../../config/constants";

export default function Footer() {
    return (
        <footer className="ftco-footer bg-bottom ftco-no-pt" style={{ backgroundImage: "url(/images/bg_3.jpg)" }}>
            <div className="container">
                <div className="row mb-5">
                    <div className="col-md pt-5">
                        <div className="ftco-footer-widget pt-md-5 mb-4">
                            <h2 className="ftco-heading-2">About</h2>
                            <p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                            <ul className="ftco-footer-social list-unstyled float-md-left float-lft">
                                <li className="ftco-animate"><a href={SYSTEM_INFORMATION.twitter}><span className="fa fa-twitter"></span></a></li>
                                <li className="ftco-animate"><a href={SYSTEM_INFORMATION.facebook}><span className="fa fa-facebook"></span></a></li>
                                <li className="ftco-animate"><a href={SYSTEM_INFORMATION.instagram}><span className="fa fa-instagram"></span></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md pt-5 border-left">
                        <div className="ftco-footer-widget pt-md-5 mb-4 ml-md-5">
                            <h2 className="ftco-heading-2">Infromation</h2>
                            <ul className="list-unstyled">
                                <li><a href="#" className="py-2 d-block">Online Enquiry</a></li>
                                <li><a href="#" className="py-2 d-block">General Enquiries</a></li>
                                <li><a href="#" className="py-2 d-block">Booking Conditions</a></li>
                                <li><a href="#" className="py-2 d-block">Privacy and Policy</a></li>
                                <li><a href="#" className="py-2 d-block">Refund Policy</a></li>
                                <li><a href="#" className="py-2 d-block">Call Us</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md pt-5 border-left">
                        <div className="ftco-footer-widget pt-md-5 mb-4">
                            <h2 className="ftco-heading-2">Experience</h2>
                            <ul className="list-unstyled">
                                <li><a href="#" className="py-2 d-block">Adventure</a></li>
                                <li><a href="#" className="py-2 d-block">Hotel and Restaurant</a></li>
                                <li><a href="#" className="py-2 d-block">Beach</a></li>
                                <li><a href="#" className="py-2 d-block">Nature</a></li>
                                <li><a href="#" className="py-2 d-block">Camping</a></li>
                                <li><a href="#" className="py-2 d-block">Party</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md pt-5 border-left">
                        <div className="ftco-footer-widget pt-md-5 mb-4">
                            <h2 className="ftco-heading-2">Have a Questions?</h2>
                            <div className="block-23 mb-3">
                                <ul>
                                    <li><span className="icon fa fa-map-marker"></span><span className="text">{SYSTEM_INFORMATION.address}</span></li>
                                    <li><a href="#"><span className="icon fa fa-phone"></span><span className="text">{SYSTEM_INFORMATION.phone}</span></a></li>
                                    <li><a href="#"><span className="icon fa fa-paper-plane"></span><span className="text">{SYSTEM_INFORMATION.contactEmail}</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">

                        <p>
                            Copyright &copy;{new Date().getFullYear()} {DEVELOPER_COMPANY.attributionText}{' '}
                            <a href={DEVELOPER_COMPANY.facebook} target="_blank" rel="noopener noreferrer">
                                {DEVELOPER_COMPANY.displayText}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
