import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useThemeScripts from "../../hooks/useThemeScripts";
import { supabase } from "../../supabaseClient";
import { getS3Images } from "../../utils/getS3Images";

export default function Hotels() {
  useThemeScripts();
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all hotels from all agencies (public data)
        const { data, error: fetchError } = await supabase
          .from('hotels')
          .select('*')
          .eq('status', 'Active');

        if (fetchError) throw fetchError;

        setHotels(data || []);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(hotels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedHotels = hotels.slice(startIndex, startIndex + itemsPerPage);

  // Ensure current page is valid when hotels change
  useEffect(() => {
    if (currentPage > 1 && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
    if (totalPages === 0) setCurrentPage(1);
  }, [hotels.length, totalPages]);

  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => goToPage(currentPage - 1);
  const goNext = () => goToPage(currentPage + 1);

  return (
    <div>
      <section className="hero-wraps hero-wraps-2 js-partialheight" style={{ backgroundImage: "url('images/bg_1.jpg')" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-partialheight align-items-end justify-content-center">
            <div className="col-md-9 ftco-animate pb-5 text-center">
              <p className="breadcrumbs"><span className="mr-2"><a href="index.html">Home <i className="fa fa-chevron-right"></i></a></span> <span>Hotels <i className="fa fa-chevron-right"></i></span></p>
              <h1 className="mb-0 bread">Hotels</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section ftco-no-pb">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 text-center">
              <h3 className="mb-3 ftco-animate">
                Explore Our Hotels
              </h3>

              <p className="ftco-animate text-muted">
                Explore a curated selection of hotels designed to deliver exceptional travel experiences.
                From dynamic cityscapes to serene retreats, each hotel offers distinctive attractions,
                cultural richness, and lasting memories. Whether planning a short escape or an extended stay,
                our destinations provide the ideal foundation for a seamless and rewarding journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section">
        <div className="container">
          {!loading && displayedHotels.length > 0 && (
            <div className="row">
              {displayedHotels.map((hotel) => (
                <div key={hotel.id} className="col-md-4">
                  <div className="project-wrap hotel">
                    <a href="#" className="img" style={{ backgroundImage: `url(${getS3Images(hotel)})` }}>
                      <span className="price">${hotel.per_person_chargers}/person</span>
                    </a>
                    <div className="text p-4">
                      <p className="star mb-2">
                        {Array.from({ length: parseInt(hotel.hotel_rating) }).map((_, i) => (
                          <span key={i} className="fa fa-star"></span>
                        ))}
                      </p>
                      <span className="days">{hotel.total_rooms_count} Rooms</span>
                      <h3><a href="#">{hotel.name}</a></h3>
                      <p className="location"><span className="fa fa-map-marker"></span> {hotel.city}, {hotel.country}</p>
                      <div className="d-flex justify-content-center mt-4">
                        <button 
                          onClick={() => navigate(`/hotel-details/${hotel.id}`, { state: { hotel } })} 
                          className="btn btn-primary"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="row mt-5">
            <div className="col text-center">
              <div className="block-27">
                <ul>
                  <li className={currentPage <= 1 ? 'disabled' : ''}>
                    <a href="#" onClick={(e) => { e.preventDefault(); goPrev(); }}>&lt;</a>
                  </li>
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const page = idx + 1;
                    return (
                      <li key={page} className={page === currentPage ? 'active' : ''}>
                        {page === currentPage ? (
                          <span>{page}</span>
                        ) : (
                          <a href="#" onClick={(e) => { e.preventDefault(); goToPage(page); }}>{page}</a>
                        )}
                      </li>
                    );
                  })}
                  <li className={currentPage >= totalPages ? 'disabled' : ''}>
                    <a href="#" onClick={(e) => { e.preventDefault(); goNext(); }}>&gt;</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}