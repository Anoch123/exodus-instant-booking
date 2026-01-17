import useThemeScripts from "../../hooks/useThemeScripts";

export default function CustomerSignup() {

  useThemeScripts();
  return (
    <div>
      <div className="hero-wrap js-partialheight" style={{ backgroundImage: "url('/images/bg_5.jpg')" }}>
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text js-partialheight align-items-center" data-scrollax-parent="true">
            <div className="col-md-7 ftco-animate">
              <h1 className="mb-4">Customer Sign Up</h1>
              <p className="caps">Travel to the any corner of the world, without going around in circles</p>
            </div>
          </div>
        </div>
      </div>

      <section className="ftco-section bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="login-wrap">
                <h3 className="mb-4 text-center">Create an account</h3>
                <form action="#" className="login-form">
                  <div className="form-group">
                    <input type="text" className="form-control rounded-left" placeholder="Username" required />
                  </div>
                  <div className="form-group d-flex">
                    <input type="password" className="form-control rounded-left" placeholder="Password" required />
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-primary rounded submit p-3 px-5">Sign Up</button>
                  </div>
                </form>
              </div>
              <p className="text-center text-gray-500">
                Already have an account?{' '}
                <a href="/customer-login" className="text-blue-500 hover:underline font-medium">
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
