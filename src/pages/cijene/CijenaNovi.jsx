import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import GostService from "../../services/gosti/GostService";
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import hr from 'date-fns/locale/hr';
import CijenaService from "../../services/cijene/CijenaService";

export default function CijenaNovi() {

    const navigate = useNavigate()
    const [cijena, setCijene] = useState([])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    registerLocale('hr', hr);


    useEffect(() => {
        ucitajCijene()
    }, [])

    async function ucitajCijene() {
        await GostService.get().then((odgovor) => {

            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }

            setCijene(odgovor.data)
        })
    }

    async function dodaj(cijena) {
        //console.table(smjer) // ovo je za kontrolu da li je sve OK
        await CijenaService.dodaj(cijena).then(() => {
            navigate(RouteNames.CIJENE)
        })
    }


    function odradiSubmit(e) { //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)




        dodaj({
            cijena: parseFloat(podaci.get('cijena')), //parseFloat(podaci.get('cijena')), -- Ovdje će se dovući cijena iz cjenika za to razdoblje
            datumPromjena: new Date().toISOString(),
            datumPocetka: startDate.toISOString(),
            datumKraja: endDate.toISOString(),
            platio: podaci.get('platio') === 'on',
            
        })
    }


    function brojDana() {
        console.log(endDate)
        if (endDate == null) {
            return ''
        }
        const razlikaUMilisekundama = Math.abs(endDate - startDate);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu) + ' dana';
    }



    return (
        <>
            <h3>
                Unos nove Cijene i Razdoblja
            </h3>
            <Container className="mt-4">
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="mb-4">

                        </Card.Title>
                        <Form onSubmit={odradiSubmit}>

                            <Row>
                                
                                <Col md={3}>
                                    <Form.Group controlId="cijena" className="mb-3">
                                        <Form.Label className="fw-bold">Cijena (€)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cijena"
                                            step={0.01}
                                            placeholder="0,00"
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                           <p className="fw-bold form-label">
                                             za Razdoblje
                                            </p>
                                        <DatePicker
                                            name="razdoblje"
                                            id="razdoblje"
                                            dateFormat="dd.MM.yyyy."
                                            locale="hr"
                                            selectsRange={true}
                                            startDate={startDate}
                                            endDate={endDate}
                                            onChange={(update) => {
                                                setDateRange(update);
                                            }}
                                            isClearable={true}
                                            // Dodavanje Bootstrap klase input polju
                                            className="form-control odabirDatuma"
                                            placeholderText="Klikni za odabir..."
                                        />
                                        

                                </Col>

                            </Row>

                            <Row className="align-items-center" style={{marginBottom: '10px'}}>


                                {/* Aktivan - Switch umjesto checkboxa za moderniji izgled */}
                                <Col md={6}>
                                    <Form.Group controlId="platio" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Cjenik je potvrđen"
                                            name="platio"
                                            className="fs-5"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi za akciju - RWD pozicioniranje */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.CIJENE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novu cijenu
                                </Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>


        </>
    )
}