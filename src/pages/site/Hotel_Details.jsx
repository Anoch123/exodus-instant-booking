import { useParams, useLocation } from "react-router-dom";
import useThemeScripts from "../../hooks/useThemeScripts";
import { getS3Images } from "../../utils/getS3Images";

export default function HotelDetails() {
    const { id } = useParams();
    const { state } = useLocation();
    const hotel = state?.hotel;
    useThemeScripts();

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
                                        {
                                            hotel?.is_wifi && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/wi-fi.png" className="amenities-icons" alt="WiFi" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> WiFi Available</li>
                                        }
                                        {
                                            hotel?.is_balcony && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/balcony.png" className="amenities-icons" alt="Balcony" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Balcony Rooms</li>
                                        }
                                        {
                                            hotel?.is_spa && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/lotus.png" className="amenities-icons" alt="Spa" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Spa Services</li>
                                        }
                                        {
                                            hotel?.is_room_service && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/hotel-service.png" className="amenities-icons" alt="Room Service" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Room Service</li>
                                        }
                                        {
                                            hotel?.is_swimming_pool && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/swimmer.png" className="amenities-icons" alt="Swimming Pool" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Swimming Pool</li>
                                        }
                                        {
                                            hotel?.is_air_conditioned && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/air-conditioning.png" className="amenities-icons" alt="Air Conditioned" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Air Conditioned</li>
                                        }
                                        {
                                            hotel?.is_family_rooms && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/home-sharing.png" className="amenities-icons" alt="Family Rooms" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Family Rooms</li>
                                        }
                                        {
                                            hotel?.is_gym && <li className="amenities-li" style={{ display: "flex", gap: "10px", alignItems: "center" }}><img src="/public/icons/weightlifting.png" className="amenities-icons" alt="Gym" style={{width: '32px', height: '32px', objectFit: 'contain'}}/> Gym Facilities</li>
                                        }
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