import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import CijenaService from "../../services/cijene/CijenaService";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function CijenaPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [cijena,setCijena] = useState({})
    const [popust,setPopust] = useState(false)

       const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    async function ucitajCijena() {
        await CijenaService.getBySifra(params.sifra).then((odgovor)=>{
             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
            setCijena(s)

            setAktivan(s.aktivan)
        })
    }

    useEffect(()=>{
        ucitajCijena()
    },[])

    async function promjeni(cijena){
        //console.table(gost) // ovo je za kontrolu da li je sve OK
        await CijenaService.promjeni(params.sifra,cijena).then(()=>{
            navigate(RouteNames.CIJENE)
        })
    }

    function odradiSubmit(e) { //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)

            // --- KONTROLA 4: Upisnina (Negativne vrijednosti) ---
        if (podaci.get('cijena') < 0) {
            alert("Cijena ne može biti negativan broj!")
            return // Prekid
        }


        promjeni({
            cijena: parseFloat(podaci.get('cijena')), //parseFloat(podaci.get('cijena')), -- Ovdje će se dovući cijena iz cjenika za to razdoblje
            datumPromjena: new Date().toISOString(),
            datumPocetka: startDate.toISOString(),
            datumKraja: endDate.toISOString(),
            popust: parseFloat(podaci.get('popust')),
            platio: podaci.get('platio') === 'on',
            
        })
    }



    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
       
    
       
       
       
        promjeni({
            cijena: parseFloat(podaci.get('cijena')), //parseFloat(podaci.get('cijena')), -- Ovdje će se dovući cijena iz cjenika za to razdoblje
            datumPocetka: startDate.toISOString(),
            datumKraja: endDate.toISOString(),
            popust: parseFloat(podaci.get('popust')),
            platio: podaci.get('platio') === 'on',
        })
    }

    return (
        <>
            <h3>
                Promjena Cijenika
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
                                            defaultValue={cijena.cijena}
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
                                            defaultValue={cijena.razdoblje}
                                        />
                                        
                                </Col>

                                <Col md={6}>
                                    <Form.Group controlId="popust" className="mb-3">
                                        <Form.Label className="fw-bold">Popust (%)</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="popust"
                                            step={1}
                                            placeholder="0"
                                            defaultValue={cijena.popust}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className="align-items-center" style={{marginBottom: '10px'}}>


                                {/* Aktivan - Switch umjesto checkboxa za moderniji izgled */}
                                <Col md={6}>
                                    <Form.Group controlId="potvrda" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Cjenik je potvrđen"
                                            name="potvrda"
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