import { useParams, useLocation } from "react-router-dom";
import { useEffect } from "react";
import useThemeScripts from "../../hooks/useThemeScripts";
import { getS3Images } from "../../utils/getS3Images";

export default function LocationDetails() {
    const { id } = useParams();
    const { state } = useLocation();
    const location = state?.location;
    useThemeScripts();

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    return (
        <div>
            <section className="hero-wraps hero-wraps-2 js-partialheight" style={{ backgroundImage: `url(${getS3Images(location)})` }}>
                <div className="overlay"></div>
                <div className="container">
                    <div className="row no-gutters slider-text js-partialheight align-items-end justify-content-center">
                        <div className="col-md-9 ftco-animate pb-5 text-center">
                            <p className="breadcrumbs">
                                <span className="mr-2">
                                    <a href="index.html">Home <i className="fa fa-chevron-right"></i></a>
                                </span>
                                <span>Locations
                                    <i className="fa fa-chevron-right ml-2"></i>
                                </span>
                            </p>
                            <h1 className="mb-0 bread">{location?.name}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="ftco-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <h3><a href="#">{location?.name}</a></h3>
                            <p className="location"><span className="fa fa-map-marker"></span> {location?.city}, {location?.district}, {location?.country}</p>

                            <div
                                className="description-content ql-editor mt-4"
                                dangerouslySetInnerHTML={{
                                    __html: location?.description || "<p>No description available.</p>"
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* IMAGES */}
            <section className="ftco-section">
                <div className="container">
                    <div className="row">
                        {location && location.images && JSON.parse(location.images).map((imgUrl, index) => (
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