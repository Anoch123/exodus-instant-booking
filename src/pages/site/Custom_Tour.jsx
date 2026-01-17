import { useState, useRef, useEffect } from "react";
import useThemeScripts from "../../hooks/useThemeScripts";

function CustomTour() {
  useThemeScripts();
  const inputRef = useRef(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [numDays, setNumDays] = useState(0);
  const [trip, setTrip] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phone: "",
    adults: 1,
    children: 0,
    infants: 0,
    title: "",
    start_date: "",
    end_date: "",
    total_travelers: 1,
    hotel_rating: "",
  });

  const [days, setDays] = useState([]);

  /* -------------------------
     Calculate Number of Days
  ------------------------- */
  const calculateDays = (start, end) => {
    if (!start || !end) {
      setNumDays(0);
      setDays([]);
      return;
    }

    const s = new Date(start);
    const e = new Date(end);
    const diff = e - s;

    if (diff < 0) {
      setNumDays(0);
      setDays([]);
      return;
    }

    const daysCount = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    setNumDays(daysCount);

    const generatedDays = Array.from({ length: daysCount }, (_, i) => ({
      day_number: i + 1,
      title: "",
      description: "",
      activities: []
    }));

    setDays(generatedDays);
  };

  /* -------------------------
     Add Activity
  ------------------------- */
  const addActivity = (dayIndex) => {
    setDays((prevDays) =>
      prevDays.map((day, i) => {
        if (i === dayIndex) {
          return {
            ...day,
            activities: [
              ...day.activities,
              {
                location: "",
                start_time: "",
                end_time: "",
                activity_description: "",
                transport: "",
                meals: "",
              },
            ],
          };
        }
        return day;
      })
    );
  };

  /* -------------------------
     Update Activity
  ------------------------- */
  const updateActivity = (dayIndex, activityIndex, field, value) => {
    setDays((prevDays) =>
      prevDays.map((day, i) => {
        if (i === dayIndex) {
          return {
            ...day,
            activities: day.activities.map((act, j) => {
              if (j === activityIndex) {
                return { ...act, [field]: value };
              }
              return act;
            }),
          };
        }
        return day;
      })
    );
  };

  /* -------------------------
     Update Day Field
  ------------------------- */
  const updateDay = (dayIndex, field, value) => {
    setDays((prevDays) =>
      prevDays.map((day, i) => {
        if (i === dayIndex) {
          return { ...day, [field]: value };
        }
        return day;
      })
    );
  };

  /* -------------------------
     Submit Handler
  ------------------------- */
  const handleSubmit = () => {
    const payload = {
      ...trip,
      total_travelers:
        Number(trip.adults) + Number(trip.children) + Number(trip.infants),
      days: days
    };

    console.log("FINAL ITINERARY:", payload);
    alert("Itinerary saved successfully!");
  };

  return (
    <div>
      <section
        className="hero-wraps hero-wraps-2 js-partialheight"
        style={{ backgroundImage: "url('images/bg_1.jpg')" }}
      >
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-partialheight align-items-end justify-content-center">
            <div className="col-md-9 ftco-animate pb-5 text-center">
              <p className="breadcrumbs">
                <span className="mr-2">
                  <a href="/">Home <i className="fa fa-chevron-right"></i></a>
                </span>
                <span>Custom Tour <i className="fa fa-chevron-right"></i></span>
              </p>
              <h1 className="mb-0 bread">Custom Tour</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="ftco-section services-section">

        <div className="container mb-4">
          <h4>Personal Information</h4>
          <input className="border p-3 w-full rounded mb-3 mr-3" placeholder="First Name" onChange={(e) => setTrip({ ...trip, firstName: e.target.value })} />
          <input className="border p-3 w-full rounded mb-3 mr-3" placeholder="Last Name" onChange={(e) => setTrip({ ...trip, lastName: e.target.value })} />
          <input className="border p-3 w-full rounded mb-3 mr-3" placeholder="Email Address" onChange={(e) => setTrip({ ...trip, email: e.target.value })} />
          <input className="border p-3 w-full rounded mb-3 mr-3" placeholder="Country" onChange={(e) => setTrip({ ...trip, country: e.target.value })} />
          <input className="border p-3 w-full rounded mb-3" placeholder="Contact Number" onChange={(e) => setTrip({ ...trip, phone: e.target.value })} />
        </div>

        <div className="container">
          <h4>Trip Details</h4>
          <input type="number" className="border p-3 w-full rounded mb-3 mr-3" placeholder="No of Adults" onChange={(e) => setTrip({ ...trip, adults: e.target.value })} />
          <input type="number" className="border p-3 w-full rounded mb-3 mr-3" placeholder="No of Children" onChange={(e) => setTrip({ ...trip, children: e.target.value })} />
          <input type="number" className="border p-3 w-full rounded mb-3 mr-3" placeholder="No of Infants" onChange={(e) => setTrip({ ...trip, infants: e.target.value })} />

          <select className="border bg-white p-3 w-full rounded mb-3 mr-3" onChange={(e) => setTrip({ ...trip, hotel_rating: e.target.value })}>
            <option value="">Select Hotel Star Rating</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <div className="row mb-3">
            <div className="col-md-3">
              <label className="font-medium">Start Date</label><br />
              <input type="date" className="border p-3 w-full rounded mt-1 col-md-12"
                onChange={(e) => {
                  const v = e.target.value;
                  setTrip({ ...trip, start_date: v });
                  calculateDays(v, trip.end_date);
                }} />
            </div>
            <div className="col-md-3">
              <label className="font-medium">End Date</label><br />
              <input type="date" className="border p-3 w-full rounded mt-1 col-md-12"
                onChange={(e) => {
                  const v = e.target.value;
                  setTrip({ ...trip, end_date: v });
                  calculateDays(trip.start_date, v);
                }} />
            </div>
          </div>

          {numDays > 0 && (
            <p className="text-lg font-semibold text-green-700">
              Total Trip Duration: {numDays} days
            </p>
          )}

          {/* Day Sections */}
          {days.length === 0 ? (
            <div>
              <p className="text-left text-gray-500">No trip design Yet</p>
            </div>
          ) : (
            <div className="mt-4">
              <h4>Design your Trip</h4>
              {days.map((day, i) => (
                <div key={i} className="border p-4 rounded-lg mb-4 shadow-sm bg-gray-50">
                  <h2 className="font-semibold text-xl">Day {day.day_number}</h2>

                  <input
                    className="border p-2 w-full my-2 rounded col-md-12"
                    placeholder="Day Title"
                    value={day.title}
                    onChange={(e) => updateDay(i, "title", e.target.value)}
                  />

                  <textarea
                    className="border p-2 w-full my-2 rounded col-md-12"
                    placeholder="Description"
                    rows={5}
                    value={day.description}
                    onChange={(e) => updateDay(i, "description", e.target.value)}
                  />

                  <button
                    className="bg-info text-white px-4 py-1 rounded my-2"
                    onClick={() => addActivity(i)}
                  >
                    + Add Activity
                  </button>

                  {day.activities.map((act, j) => (
                    <div key={j} className="border p-3 mt-3 bg-white shadow rounded">
                      <input
                        className="border p-2 w-full my-1 rounded col-md-12"
                        placeholder="Location"
                        value={act.location}
                        onChange={(e) => updateActivity(i, j, "location", e.target.value)}
                      />
                      <div className="flex gap-2">
                        <input
                          type="time"
                          className="border p-2 w-full my-1 rounded col-md-2 mr-3"
                          value={act.start_time}
                          onChange={(e) => updateActivity(i, j, "start_time", e.target.value)}
                        />
                        <input
                          type="time"
                          className="border p-2 w-full my-1 rounded col-md-2"
                          value={act.end_time}
                          onChange={(e) => updateActivity(i, j, "end_time", e.target.value)}
                        />
                      </div>
                      <input
                        className="border p-2 w-full my-1 rounded col-md-5 mr-3"
                        placeholder="Transport (Optional)"
                        value={act.transport}
                        onChange={(e) => updateActivity(i, j, "transport", e.target.value)}
                      />
                      <input
                        className="border p-2 w-full my-1 rounded col-md-5"
                        placeholder="Meals (Optional)"
                        value={act.meals}
                        onChange={(e) => updateActivity(i, j, "meals", e.target.value)}
                      />
                      <textarea
                        className="border p-2 w-full my-1 rounded col-md-12"
                        placeholder="Activity Description"
                        rows={3}
                        value={act.activity_description}
                        onChange={(e) => updateActivity(i, j, "activity_description", e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="container text-right">
          <button
            className="bg-success text-white border-success rounded w-full mt-4"
            onClick={handleSubmit}
          >
            Request Itinerary from Agency
          </button>
        </div>
      </section>


      {/* ITINERARY VIEW BELOW */}
      <div className="container">
        {days.length === 0 ? (
          <div></div>
        ) : (
          <div>
            <h4>Itinerary Overview</h4>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold mb-4">{trip.title}</h1>

              <p><strong>Customer Full Name:</strong> {trip.firstName} {trip.lastName}</p>
              <p><strong>Contact Email:</strong> {trip.email}</p>
              <p><strong>Contact Phone:</strong> {trip.phone}</p>
              <p><strong>Dates:</strong> {trip.start_date} → {trip.end_date}</p>
              <p><strong>Travelers:</strong> {trip.adults} Adults / {trip.children} Children / {trip.infants} Infants</p>

              {days.map((day) => (
                <div key={day.day_number} className="border p-4 mb-4 mt-4 rounded shadow">
                  <h2 className="text-2xl font-bold">
                    Day {day.day_number}: {day.title}
                  </h2>
                  <p className="text-gray-700 mb-3">{day.description}</p>

                  {day.activities.map((act, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded mb-2">
                      <h3 className="font-bold">{act.location}</h3>
                      <p>{act.start_time} - {act.end_time}</p>
                      <p>{act.activity_description}</p>
                      <p>Transport: {act.transport || "N/A"}</p>
                      <p>Meals: {act.meals || "N/A"}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomTour;
