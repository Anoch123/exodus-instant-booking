import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteLayout from "../layouts/SiteLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import AgencyLayout from "../layouts/AgencyLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import AgencyLogin from "../pages/agency/Login";
import AgencyDashboard from "../pages/agency/Dashboard";

// Locations
import ViewLocations from "../pages/agency/manage_locations/ViewLocations";
import CreateLocation from "../pages/agency/manage_locations/CreateLocation";

// Categories
import ViewCategories from "../pages/agency/manage_categories/ViewCategories";
import CreateCategory from "../pages/agency/manage_categories/CreateCategory";

// Tours
import ViewTours from "../pages/agency/manage_tours/ViewTours";
import CreateTour from "../pages/agency/manage_tours/CreateTour";

// Hotels
import ViewHotels from "../pages/agency/manage_hotels/ViewHotels";
import CreateHotel from "../pages/agency/manage_hotels/CreateHotel";

// Custom Tours & Bookings
import ViewCustomTours from "../pages/agency/manage_customTours/ViewCustomTours";
import ViewBookings from "../pages/agency/manage_bookings/ViewBookings";

// Settings
import Settings from "../pages/agency/manage_settings/Settings";

import { siteRoutes, customerRoutes } from "./routes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<SiteLayout />}>
          {siteRoutes.map((route, index) =>
            route.path === "" ? (
              <Route key={index} index element={route.element} />
            ) : (
              <Route key={index} path={route.path} element={route.element} />
            )
          )}
        </Route>

        {/* Customer */}
        <Route path="/customer" element={<CustomerLayout />}>
          {customerRoutes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Agency */}
        <Route path="/agency" element={<AgencyLayout />}>
          {/* Public agency route - redirects if already logged in */}
          <Route element={<PublicRoute redirectTo="agency_dashboard" />}>
            <Route index element={<AgencyLogin />} />
          </Route>

          {/* Protected agency routes */}
          <Route element={<ProtectedRoute role={["Agency_Admin", "Agency_User"]} />}>
            <Route path="agency_dashboard" element={<AgencyDashboard />} />
            
            {/* Locations */}
            <Route path="agency_locations" element={<ViewLocations />} />
            <Route path="locations/create/:id" element={<CreateLocation />} />
            <Route path="locations/create" element={<CreateLocation />} />
            
            {/* Categories */}
            <Route path="agency_categories" element={<ViewCategories />} />
            <Route path="categories/create/:id" element={<CreateCategory />} />
            <Route path="categories/create" element={<CreateCategory />} />
            
            {/* Tours */}
            <Route path="agency_tours" element={<ViewTours />} />
            <Route path="tours/create" element={<CreateTour />} />
            <Route path="tours/create/:id" element={<CreateTour />} />
            
            {/* Hotels */}
            <Route path="agency_hotels" element={<ViewHotels />} />
            <Route path="hotels/create" element={<CreateHotel />} />
            <Route path="hotels/create/:id" element={<CreateHotel />} />
            
            {/* Custom Tours & Bookings */}
            <Route path="agency_custom-tours" element={<ViewCustomTours />} />
            <Route path="agency_bookings" element={<ViewBookings />} />
            
            {/* Settings */}
            <Route path="agency_settings" element={<Settings />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
