import { Link } from "react-router-dom";
import { useState } from "react";
import { siteRoutes } from "../../router/routes";
import { SYSTEM_INFORMATION } from "../../config/constants";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleNavClick = () => {
        setMenuOpen(false);
        // Also close using Bootstrap's collapse method if available
        const navbarCollapse = document.getElementById("ftco-nav");
        if (navbarCollapse && navbarCollapse.classList.contains("show")) {
            navbarCollapse.classList.remove("show");
        }
    };

    return (
          <nav
      className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light"
      id="ftco-navbar"
    >
      <div className="container">

        <Link className="navbar-brand" to="/" onClick={handleNavClick}>
          {SYSTEM_INFORMATION.displayText} <span>Book Your Travel Fast</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#ftco-nav"
          aria-controls="ftco-nav"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="oi oi-menu"></span> Menu
        </button>

        <div className="collapse navbar-collapse" id="ftco-nav">
          <ul className="navbar-nav ml-auto">

            {siteRoutes.filter(route => !route.hidden).map((route, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={`/${route.path}`} onClick={handleNavClick}>
                  {route.name}
                </Link>
              </li>
            ))}

          </ul>
        </div>
      </div>
    </nav>
    );
}
