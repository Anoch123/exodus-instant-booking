import { useEffect } from "react";
import $ from "jquery";

import "owl.carousel/dist/assets/owl.carousel.css";
import "magnific-popup/dist/magnific-popup.css";

import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";

if (typeof window !== "undefined") {
  window.$ = window.jQuery = $;
}

export default function useThemeScripts() {
  useEffect(() => {
    (async () => {
      try {
        // Load required JS plugins
        await import("../../public/js/scrollax.min.js");
        await import("../../public/js/jquery.stellar.min.js").catch(() => { });
        await import("owl.carousel");
        await import("magnific-popup");
        await import("bootstrap-datepicker");

        // Waypoints (public → npm fallback)
        try {
          await import("../../public/js/jquery.waypoints.min.js");
        } catch {
          await import("waypoints/lib/jquery.waypoints").catch(() => {
            console.warn("Waypoints failed to load");
          });
        }

        // animateNumber
        try {
          await import("../../public/js/jquery.animateNumber.min.js");
        } catch (e) {
          console.warn("animateNumber plugin missing:", e);
        }

        // Load Popper and Bootstrap via script tags instead of import to avoid module resolution issues
        const loadScript = (src) => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        };

        // Load popper first, then bootstrap
        await loadScript('/js/popper.min.js').catch(() => 
          console.warn("Popper.js failed to load")
        );
        await loadScript('/js/bootstrap.min.js').catch(() =>
          console.warn("Bootstrap JS missing")
        );
      } catch (err) {
        console.error("Plugin loading failed:", err);
      }

      /* ---------------------------------------------------
       *  ORIGINAL THEME SCRIPTS (converted to React version)
       * --------------------------------------------------- */

      /** 1. 🟦 Stellar Parallax */
      try {
        $(window).stellar({
          responsive: true,
          parallaxBackgrounds: true,
          parallaxElements: true,
          horizontalScrolling: false,
          hideDistantElements: false,
          scrollProperty: "scroll",
        });
      } catch { }


      /** 2. 🟩 Full Height */
      const setFullHeight = () => {
        $(".js-fullheight").css("height", $(window).height());
      };
      setFullHeight();
      $(window).resize(setFullHeight);

      // partially height
      const setPartialHeight = () => {
        $(".js-partialheight").css("height", $(window).height() * 0.5);
      };
      setPartialHeight();
      $(window).resize(setPartialHeight);


      /** 3. 🟨 Loader */
      setTimeout(() => $("#ftco-loader").removeClass("show"), 1);


      /** 4. 🟪 Scrollax Init */
      try {
        $.Scrollax();
      } catch { }


      /** 5. 🟧 Owl Carousel */
      $(".carousel-testimony").owlCarousel({
        center: true,
        loop: true,
        items: 1,
        margin: 30,
        stagePadding: 0,
        nav: false,
      });

      $(".carousel-destination").owlCarousel({
        loop: true,
        items: 1,
        margin: 30,
        responsive: {
          600: { items: 2 },
          1000: { items: 4 },
        },
      });


      /** 6. 🟫 Dropdown Hover */
      $("nav .dropdown").hover(
        function () {
          const $this = $(this);
          $this.addClass("show");
          $this.find("> a").attr("aria-expanded", true);
          $this.find(".dropdown-menu").addClass("show");
        },
        function () {
          const $this = $(this);
          $this.removeClass("show");
          $this.find("> a").attr("aria-expanded", false);
          $this.find(".dropdown-menu").removeClass("show");
        }
      );


      /** 7. 🟥 Navbar Scroll Animation */
      $(window).scroll(() => {
        let st = $(window).scrollTop();
        let navbar = $(".ftco_navbar");
        let sd = $(".js-scroll-wrap");

        if (st > 150 && !navbar.hasClass("scrolled")) navbar.addClass("scrolled");
        if (st < 150 && navbar.hasClass("scrolled"))
          navbar.removeClass("scrolled sleep");

        if (st > 350 && !navbar.hasClass("awake")) navbar.addClass("awake");
        if (st < 350 && navbar.hasClass("awake"))
          navbar.removeClass("awake").addClass("sleep");

        if (st > 350) sd.addClass("sleep");
        else sd.removeClass("sleep");
      });


      /** 8. 🟦 Counter Animation */
      const counter = () => {
        $("#section-counter, .hero-wrap, .ftco-counter").waypoint(
          function (direction) {
            if (
              direction === "down" &&
              !$(this.element).hasClass("ftco-animated")
            ) {
              $(".number").each(function () {
                const num = $(this).data("number");
                const commaStep = $.animateNumber.numberStepFactories.separator(",");
                $(this).animateNumber(
                  {
                    number: num,
                    numberStep: commaStep,
                  },
                  7000
                );
              });
            }
          },
          { offset: "95%" }
        );
      };
      counter();


      /** 9. 🟩 Content Waypoint Animation */
      const contentWayPoint = () => {
        let i = 0;
        $(".ftco-animate").waypoint(
          function (direction) {
            if (direction === "down" && !$(this.element).hasClass("ftco-animated")) {
              i++;
              $(this.element).addClass("item-animate");

              setTimeout(() => {
                $("body .ftco-animate.item-animate").each(function (k) {
                  const el = $(this);
                  setTimeout(() => {
                    const effect = el.data("animate-effect");
                    if (effect === "fadeIn") el.addClass("fadeIn ftco-animated");
                    else if (effect === "fadeInLeft") el.addClass("fadeInLeft ftco-animated");
                    else if (effect === "fadeInRight") el.addClass("fadeInRight ftco-animated");
                    else el.addClass("fadeInUp ftco-animated");
                    el.removeClass("item-animate");
                  }, k * 50);
                });
              }, 100);
            }
          },
          { offset: "95%" }
        );
      };
      contentWayPoint();


      /** 10. 🟨 Magnific Popup */
      $(".image-popup").magnificPopup({
        type: "image",
        closeOnContentClick: true,
        fixedContentPos: true,
        gallery: { enabled: true },
      });

      $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
        type: "iframe",
        mainClass: "mfp-fade",
        removalDelay: 160,
      });


      /** 11. 🟫 Datepicker */
      try {
        $(".checkin_date, .checkout_date").datepicker({
          format: "mm/dd/yyyy", // corrected format
          autoclose: true,
        });
      } catch (e) {
        console.warn("Datepicker init failed:", e);
      }

    })();
  }, []);
}
