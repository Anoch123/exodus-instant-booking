import { Link } from "react-router-dom";
import { siteRoutes } from "../../router/routes";
import { SYSTEM_INFORMATION } from "../../config/constants";

export default function Navbar() {
    return (
          <nav
      className="navbar navbar-expand-lg navbar-dark ftco_navbar bg-dark ftco-navbar-light"
      id="ftco-navbar"
    >
      <div className="container">

        <Link className="navbar-brand" to="/">
          {SYSTEM_INFORMATION.displayText} <span>Book Your Travel Fast</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#ftco-nav"
          aria-controls="ftco-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="oi oi-menu"></span> Menu
        </button>

        <div className="collapse navbar-collapse" id="ftco-nav">
          <ul className="navbar-nav ml-auto">

            {siteRoutes.filter(route => !route.hidden).map((route, index) => (
              <li key={index} className="nav-item">
                <Link className="nav-link" to={`/${route.path}`}>
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
