import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import GostService from "../../services/gosti/GostService";

export default function GostiNovi(){

    const navigate = useNavigate()

    async function dodaj(gost){
        //console.table(smjer) // ovo je za kontrolu da li je sve OK
        await GostService.dodaj(gost).then(()=>{
            navigate(RouteNames.GOSTI)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        
         // --- KONTROLA 1: Ime (Postojanje) ---
        if (!podaci.get('ime') || podaci.get('ime').trim().length === 0) {
            alert("Ime je obavezno i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 2: Ime (Minimalna duljina) ---
        if (podaci.get('ime').trim().length < 2) {
            alert("Ime mora imati najmanje 2 znaka!");
            return;
        }

        // --- KONTROLA 3: Prezime (Postojanje) ---
        if (!podaci.get('prezime') || podaci.get('prezime').trim().length === 0) {
            alert("Prezime je obavezno i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 4: Prezime (Minimalna duljina) ---
        if (podaci.get('prezime').trim().length < 2) {
            alert("Prezime mora imati najmanje 2 znaka!");
            return;
        }

        // --- KONTROLA 5: Email (Postojanje) ---
        if (!podaci.get('email') || podaci.get('email').trim().length === 0) {
            alert("Email je obavezan!");
            return;
        }

        // --- KONTROLA 6: Email (Format) ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(podaci.get('email'))) {
            alert("Email nije u ispravnom formatu!");
            return;
        }
        
        
        
        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
            aktivan: podaci.get('aktivan') === 'on',
        })
    }






    return(
        <>
        <h3>
            Unos novog gosta
        </h3>
         <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o gostu</Card.Title>
                            <Form onSubmit={odradiSubmit}>
                            {/* Naziv - Pun širina na svim ekranima */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="ime" className="mb-3">
                                        <Form.Label className="fw-bold">Ime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="ime"
                                            placeholder="Unesite ime gosta"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="prezime" className="mb-3">
                                        <Form.Label className="fw-bold">Prezime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="prezime"
                                            placeholder="Unesite prezime gosta"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Trajanje i Cijena - Jedno pored drugog na md+, jedno ispod drugog na mobitelu */}
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="email" className="mb-3">
                                        <Form.Label className="fw-bold">email</Form.Label>
                                        <Form.Control
                                           type="text"
                                            name="email"
                                            placeholder="Unesite email gosta"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                
                            </Row>

                            <Row className="align-items-center">
                                

                                {/* Aktivan - Switch umjesto checkboxa za moderniji izgled */}
                                <Col md={6}>
                                    <Form.Group controlId="aktivan" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Gost je aktivan"
                                            name="aktivan"
                                            className="fs-5"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi za akciju - RWD pozicioniranje */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.GOSTI} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novi gost
                                </Button>
                            </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Container>

            
        </>
    )
}