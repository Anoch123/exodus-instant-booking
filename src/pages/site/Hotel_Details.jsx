import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useThemeScripts from "../../hooks/useThemeScripts";
import { getS3Images } from "../../utils/getS3Images";
import { AMENITIES } from "../../config/constants";

export default function HotelDetails() {
    const { id } = useParams();
    const { state } = useLocation();
    const hotel = state?.hotel;
    useThemeScripts();

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div>
            <section className="hero-wraps hero-wraps-2 js-partialheight" style={{ backgroundImage: `url(${getS3Images(hotel)})` }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-partialheight align-items-end justify-content-center">
                        <div className="col-md-9 ftco-animate pb-5 text-center">
                            <p className="breadcrumbs">
                                <span className="mr-2">
                                    <a href="index.html">Home <i className="fa fa-chevron-right"></i></a>
                                </span>
                                <span>hotels
                                    <i className="fa fa-chevron-right ml-2"></i>
                                </span>
                            </p>
                            <h1 className="mb-0 bread">{hotel?.name}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {/* <h3><a href="#">{hotel?.name}</a></h3> */}

                            <div className="project-wrap-hotels">
                                <div className="text p-4">
                                    <ul className="amenities-list" style={{
                                        listStyle: 'none',
                                        padding: 0,
                                        margin: 0,
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                        gap: '20px'
                                    }}>
                                            {AMENITIES.map((a) => (
                                                hotel?.[a.field] ? (
                                                    <li key={a.field} className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                                        <img src={a.icon} className="amenities-icons" alt={a.label} style={{width: '32px', height: '32px', objectFit: 'contain'}}/> {a.displayText}
                                                    </li>
                                                ) : null
                                            ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <p className="location"><span className="icon fa fa-map-marker"></span> {hotel?.city}, {hotel?.district}, {hotel?.country}</p>

                            <div
                                className="description-content ql-editor mt-4"
                                dangerouslySetInnerHTML={{
                                    __html: hotel?.description || "<p>No description available.</p>"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* IMAGES */}
            <section>
                <div className="container">
                    <div className="row">
                        {hotel && hotel.images && JSON.parse(hotel.images).map((imgUrl, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="project-wrap">
                                    <a href="#" className="img" style={{ backgroundImage: `url(${imgUrl})` }}></a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}