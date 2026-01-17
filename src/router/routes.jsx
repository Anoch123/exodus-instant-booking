// router/routes.js
import Home from "../pages/site/Home";
import AboutUs from "../pages/site/About_us";
import Tours from "../pages/site/Tours";
import Hotels from "../pages/site/Hotels";
import Locations from "../pages/site/Locations";
import CustomTour from "../pages/site/Custom_Tour";
import ContactUs from "../pages/site/Contact_Us";
import LocationDetails from "../pages/site/Location_Details";

import CustomerLogin from "../pages/customer/Login";
import CustomerSignup from "../pages/customer/SignUp";
import CustomerDashboard from "../pages/customer/Dashboard";

import AgencyLogin from "../pages/agency/Login";
import AgencyDashboard from "../pages/agency/Dashboard";
import HotelDetails from "../pages/site/Hotel_Details";

// Public site routes
export const siteRoutes = [
  { path: "", name: "Home", element: <Home /> },
  { path: "tours", name: "Tours", element: <Tours /> },
  { path: "hotels", name: "Hotels", element: <Hotels /> },
  { path: "hotel-details/:id", name: "Hotel Details", element: <HotelDetails /> , hidden: true },
  { path: "locations", name: "Locations", element: <Locations /> },
  { path: "location-details/:id", name: "Location Details", element: <LocationDetails /> , hidden: true },
  { path: "custom-tour", name: "Custom Tour", element: <CustomTour /> },
  { path: "about-us", name: "About Us", element: <AboutUs /> },
  { path: "contact-us", name: "Contact Us", element: <ContactUs /> },
  { path: "customer-login", name: "Login", element: <CustomerLogin /> },
  { path: "customer-signup", name: "Sign Up", element: <CustomerSignup /> , hidden: true },
];

// Customer routes
export const customerRoutes = [
  { path: "login", name: "Login", element: <CustomerLogin /> },
  { path: "dashboard", name: "Dashboard", element: <CustomerDashboard /> },
];

// Agency routes
export const agencyRoutes = [
  { path: "ageny_login", name: "Login", element: <AgencyLogin /> },
  { path: "agency_dashboard", name: "Dashboard", element: <AgencyDashboard /> },
];
