<template>
  <footer class="app-footer">
    <div class="footer-container">

      <!-- TOP AREA -->
      <div class="footer-main">

        <!-- BRAND -->
        <div class="footer-brand">
          <RouterLink to="/" class="footer-logo-link">
            <img
              :src="logoAppLight"
              alt="Voyagio"
              class="footer-logo"
            />

            <span class="footer-brand-name">
              Voyagio
            </span>
          </RouterLink>

          <p class="footer-tagline">
            Travel planning built around the way you actually like to travel.
          </p>

          <div class="footer-support">
            <p class="support-title">
              Need help?
            </p>

            <p class="support-text">
              Questions about your account, trips or Voyagio?
            </p>

            <RouterLink
              to="/contact"
              class="support-link"
            >
              Contact support →
            </RouterLink>
          </div>
        </div>


        <!-- LINKS -->
        <div class="footer-links">

          <!-- VOYAGIO -->
          <div class="footer-column">
            <h3>
              Voyagio
            </h3>

            <RouterLink to="/">
              Home
            </RouterLink>

            <RouterLink to="/create-trip">
              Create Trip
            </RouterLink>

            <RouterLink to="/my-trips">
              My Trips
            </RouterLink>

            <RouterLink to="/community">
              Community
            </RouterLink>
          </div>


          <!-- COMPANY -->
          <div class="footer-column">
            <h3>
              Company
            </h3>

            <RouterLink to="/about">
              About Voyagio
            </RouterLink>

            <RouterLink to="/contact">
              Contact
            </RouterLink>

            <RouterLink to="/help">
              Help Center
            </RouterLink>

            <RouterLink to="/faq">
              FAQ
            </RouterLink>
          </div>


          <!-- LEGAL -->
          <div class="footer-column">
            <h3>
              Legal
            </h3>

            <RouterLink to="/terms">
              Terms & Conditions
            </RouterLink>

            <RouterLink to="/privacy">
              Privacy Policy
            </RouterLink>

            <RouterLink to="/cookies">
              Cookie Policy
            </RouterLink>

            <RouterLink to="/privacy-rights">
              Privacy & GDPR Rights
            </RouterLink>

            <RouterLink to="/accessibility">
              Accessibility
            </RouterLink>
          </div>

        </div>
      </div>


      <!-- BOTTOM AREA -->
      <div class="footer-bottom">

        <p class="copyright">
          © {{ currentYear }} Voyagio. All rights reserved.
        </p>

        <div class="footer-bottom-links">
          <RouterLink to="/privacy">
            Privacy
          </RouterLink>

          <RouterLink to="/terms">
            Terms
          </RouterLink>

          <RouterLink to="/cookies">
            Cookies
          </RouterLink>
        </div>

      </div>

    </div>
  </footer>
</template>


<script setup>
import logoAppLight from '../../assets/logo_app_light.svg'

const currentYear = new Date().getFullYear()
</script>


<style scoped>
.app-footer {
  width: 100%;

  background: #263025;
  color: #fff8ec;
}

.footer-container {
  width: min(100% - 48px, 1280px);

  margin: 0 auto;

  padding: 64px 0 26px;
}


/* =========================
   MAIN AREA
========================= */

.footer-main {
  display: grid;

  grid-template-columns:
    minmax(280px, 1.1fr)
    minmax(0, 1.6fr);

  gap: 80px;

  padding-bottom: 54px;
}


/* =========================
   BRAND
========================= */

.footer-brand {
  max-width: 390px;
}

.footer-logo-link {
  display: inline-flex;
  align-items: center;

  gap: 10px;

  text-decoration: none;
}

.footer-logo {
  width: 56px;
  height: 56px;

  object-fit: contain;
}

.footer-brand-name {
  font-family: 'Playfair Display', serif;

  font-size: 30px;
  font-weight: 600;

  color: #fff8ec;
}

.footer-tagline {
  margin: 20px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 15px;
  line-height: 1.7;

  color: rgba(255, 248, 236, 0.68);
}


/* =========================
   SUPPORT
========================= */

.footer-support {
  margin-top: 34px;

  padding-top: 26px;

  border-top: 1px solid rgba(255, 248, 236, 0.12);
}

.support-title {
  margin: 0 0 7px;

  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  font-weight: 700;

  color: #fff8ec;
}

.support-text {
  margin: 0 0 10px;

  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  line-height: 1.6;

  color: rgba(255, 248, 236, 0.62);
}

.support-link {
  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  font-weight: 700;

  color: #dcccac;

  text-decoration: none;

  transition: color 0.2s ease;
}

.support-link:hover {
  color: #fff8ec;
}


/* =========================
   LINK COLUMNS
========================= */

.footer-links {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 42px;
}

.footer-column {
  display: flex;
  flex-direction: column;

  align-items: flex-start;

  gap: 12px;
}

.footer-column h3 {
  margin: 0 0 8px;

  font-family: 'DM Sans', sans-serif;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.13em;

  text-transform: uppercase;

  color: #dcccac;
}

.footer-column a {
  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  line-height: 1.5;

  color: rgba(255, 248, 236, 0.72);

  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-column a:hover {
  color: #fff8ec;
}


/* =========================
   BOTTOM BAR
========================= */

.footer-bottom {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 24px;

  padding-top: 24px;

  border-top: 1px solid rgba(255, 248, 236, 0.12);
}

.copyright {
  margin: 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 12px;

  color: rgba(255, 248, 236, 0.5);
}

.footer-bottom-links {
  display: flex;
  align-items: center;

  gap: 20px;
}

.footer-bottom-links a {
  font-family: 'DM Sans', sans-serif;

  font-size: 12px;

  color: rgba(255, 248, 236, 0.58);

  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-bottom-links a:hover {
  color: #fff8ec;
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .footer-container {
    padding-top: 52px;
  }

  .footer-main {
    grid-template-columns: 1fr;

    gap: 48px;
  }

  .footer-brand {
    max-width: 520px;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .footer-container {
    width: calc(100% - 32px);

    padding: 44px 0 22px;
  }

  .footer-main {
    gap: 40px;

    padding-bottom: 38px;
  }

  .footer-logo {
    width: 50px;
    height: 50px;
  }

  .footer-brand-name {
    font-size: 27px;
  }

  .footer-links {
    grid-template-columns: 1fr 1fr;

    gap: 38px 26px;
  }

  .footer-column:last-child {
    grid-column: 1 / -1;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;

    gap: 14px;
  }

  .footer-bottom-links {
    flex-wrap: wrap;

    gap: 14px;
  }
}


/* =========================
   VERY SMALL MOBILE
========================= */

@media (max-width: 420px) {
  .footer-links {
    grid-template-columns: 1fr;

    gap: 32px;
  }

  .footer-column:last-child {
    grid-column: auto;
  }
}
</style>