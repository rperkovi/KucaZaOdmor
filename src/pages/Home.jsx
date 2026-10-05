import { Badge, Button, Card, Col, Row } from 'react-bootstrap';
import { IME_APLIKACIJE } from '../constants';

const pogodnosti = [
  'Veliki balkon s pogledom na more',
  'Dvije spavaće sobe, a 4+2 mjesta za spavanje',
  'Obiteljska kuhinja s vrhunskom opremom',
  'Privatni bazen i terasa za ručavanje',
  'Besplatan Wi‑Fi i parking',
  'U blizini plaže, restorana, supermarketa Plodine i šetališta',
];

const galerija = [
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
];

const preporuke = [
  {
    ime: 'Ana i Marko',
    tekst: 'Savršeno mjesto za obiteljsku godišnju odmor. Kuća je lijepa, čista i vrlo udobna.',
    zvijezde: '★★★★★',
  },
  {
    ime: 'Petra',
    tekst: 'Pogled je fantastičan, a terasa je idealna za večernje ručanje. Vratit ćemo se sigurno!',
    zvijezde: '★★★★★',
  },
  {
    ime: 'Tomislav',
    tekst: 'Odlična lokacija, mirno okruženje i sve što je potrebno za opuštanje s obitelji.',
    zvijezde: '★★★★★',
  },
];

export default function Home() {
  return (
    <div className="holiday-home-page">
      <section className="hero-section">
        <div className="hero-content">
          <Badge bg="warning" text="dark" className="mb-3 hero-badge">
            Premium obiteljski odmor
          </Badge>
          <h1>{IME_APLIKACIJE}</h1>
          <p>
            Opuštajući obiteljski odmor u mirnoj kući s dvije spavaće sobe i 4+2 mjesta za spavanje,
            okružen maslinama, pogledom na zelenilo, cvijećem, u blizini plaže, ljekarne, supermarketa,
            restorana, šetališta, benzinske pumpe i praonice automobila, te vrhunskim sadržajima za sve generacije.
          </p>

          <div className="hero-actions">
            <Button href="#rezervacije" variant="primary" size="lg">
              Rezerviraj svoj odmor
            </Button>
            <Button href="#galerija" variant="outline-light" size="lg">
              Pogledaj kuću
            </Button>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>2</strong>
              <span>spavaće sobe</span>
            </div>
            <div>
              <strong>4+2</strong>
              <span>mjesta za spavanje</span>
            </div>
            <div>
              <strong>5/5</strong>
              <span>ocjena gostiju</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div
            className="hero-image-main"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          <Card className="floating-card">
            <Card.Body>
              <p className="floating-label">Sezona 2027.</p>
              <h3>Od 120 € / dan</h3>
              <span>uključeno: Wi‑Fi, parking i bazen</span>
            </Card.Body>
          </Card>
        </div>
      </section>

      <section className="stats-strip">
        <Row className="g-3 text-center">
          <Col md={3} sm={6}>
            <div className="stat-box">
              <strong>80 m²</strong>
              <span>površine</span>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="stat-box">
              <strong>5 min</strong>
              <span>do plaže</span>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="stat-box">
              <strong>2 terase</strong>
              <span>za odmor</span>
            </div>
          </Col>
          <Col md={3} sm={6}>
            <div className="stat-box">
              <strong>24/7</strong>
              <span>pristup</span>
            </div>
          </Col>
        </Row>
      </section>

      <section className="content-block about-section">
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <div className="image-panel">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                alt="Interijer kuće za odmor"
              />
            </div>
          </Col>

          <Col lg={6}>
            <div className="section-copy">
              <Badge bg="light" text="dark" className="mb-3">
                O kući
              </Badge>
              <h2>Prostor za stvarni odmor bez stresa</h2>
              <p>
                Naša kuća za odmor kombinira moderno uređenje, prirodnu toplinu i miran okoliš.
                Savršena je za obiteljski odmor, vikendice i duže boravke uz više generacija.
              </p>
              <ul className="feature-list">
                {pogodnosti.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </section>

      <section id="galerija" className="content-block gallery-section">
        <div className="section-heading">
          <Badge bg="warning" text="dark">
            Galerija
          </Badge>
          <h2>Upoznajte naš prostor</h2>
        </div>

        <Row className="g-3">
          {galerija.map((slika, index) => (
            <Col md={6} lg={3} key={index}>
              <div className="gallery-item">
                <img src={slika} alt={`Kuća za odmor ${index + 1}`} />
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <section id="rezervacije" className="content-block booking-section">
        <Row className="align-items-center g-4">
          <Col lg={7}>
            <div className="section-copy">
              <Badge bg="primary" className="mb-3">
                Usluge i sadržaji
              </Badge>
              <h2>Odmor koji vas opušta od prvog trenutka</h2>
              <p>
                Kuća sadrži sve što vam je potrebno za bezbrižan boravak: privatna terasa,
                prostrorna dnevna soba, dvije moderne kupaonice, udoban namještaj i veliki vrt za
                dječju igru i grilanje.
              </p>
            </div>
          </Col>

          <Col lg={5}>
            <Card className="booking-card">
              <Card.Body>
                <p className="booking-label">Cijena od</p>
                <h3>120 € / dan</h3>
                <ul>
                  <li>Besplatan parking</li>
                  <li>Wi‑Fi i TV</li>
                  <li>Privatni bazen</li>
                  <li>Doček i odjava</li>
                </ul>
                <Button variant="primary" size="lg" className="w-100">
                  Zatraži rezervaciju
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <section className="content-block reviews-section">
        <div className="section-heading">
          <Badge bg="success" text="white">
            Recenzije
          </Badge>
          <h2>Što kažu naši gosti</h2>
        </div>

        <Row className="g-3">
          {preporuke.map((stavka) => (
            <Col md={4} key={stavka.ime}>
              <Card className="review-card h-100">
                <Card.Body>
                  <div className="review-stars">{stavka.zvijezde}</div>
                  <p>“{stavka.tekst}”</p>
                  <strong>{stavka.ime}</strong>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
    </div>
  );
}
