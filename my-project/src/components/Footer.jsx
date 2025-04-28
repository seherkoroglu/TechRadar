export default function Footer() {
  return (
      <footer className="bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-center text-gray-700 text-sm mt-auto" style={{ bottom: 0, width: "100%" }}>

        {/* Section: Social media */}
        <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
          <div className="me-5 d-none d-lg-block">
            <span>Get connected with us on social networks:</span>
          </div>

          <div>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-google"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="me-4 text-reset">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </section>

        {/* Section: Links */}
        <section className="">
          <div className="container text-center text-md-start mt-5">
            <div className="row mt-3">
              {/* Company column */}
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">
                  <i className="fas fa-gem me-3"></i> COMPANY NAME
                </h6>
                <p>
                  Here you can use rows and columns to organize your footer content.
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
              </div>

              {/* Products column */}
              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">PRODUCTS</h6>
                <p><a href="#!" className="text-reset">Angular</a></p>
                <p><a href="#!" className="text-reset">React</a></p>
                <p><a href="#!" className="text-reset">Vue</a></p>
                <p><a href="#!" className="text-reset">Laravel</a></p>
              </div>

              {/* Useful links column */}
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="text-uppercase fw-bold mb-4">USEFUL LINKS</h6>
                <p><a href="#!" className="text-reset">Pricing</a></p>
                <p><a href="#!" className="text-reset">Settings</a></p>
                <p><a href="#!" className="text-reset">Orders</a></p>
                <p><a href="#!" className="text-reset">Help</a></p>
              </div>

              {/* Contact column */}
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="text-uppercase fw-bold mb-4">CONTACT</h6>
                <p><i className="fas fa-home me-3"></i> New York, NY 10012, US</p>
                <p><i className="fas fa-envelope me-3"></i> info@example.com</p>
                <p><i className="fas fa-phone me-3"></i> +01 234 567 88</p>
                <p><i className="fas fa-print me-3"></i> +01 234 567 89</p>
              </div>
            </div>
          </div>
        </section>

        {/* Copyright */}
        <div className="text-center p-4" style={{backgroundColor: "rgba(0, 0, 0, 0.05)"}}>
          © 2021 Copyright:
          <a className="text-reset fw-bold" href="https://mdbootstrap.com/"> MDBootstrap.com</a>
        </div>
      </footer>
  );
}
