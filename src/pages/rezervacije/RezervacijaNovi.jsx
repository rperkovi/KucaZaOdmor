import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import { useEffect, useState } from "react";
import GostService from "../../services/gosti/GostService";

export default function RezervacijaNovi(){

    const navigate = useNavigate()
    const [gosti, setGosti] = useState([])

     useEffect(()=>{
            ucitajGoste()
        },[])   
        
        async function ucitajGoste() {
            await GostService.get().then((odgovor)=>{
    
                 if(!odgovor.success){
                    alert('Nije implementiran servis')
                    return
                }
    
                setGosti(odgovor.data)
            })
        }

    async function dodaj(rezervacija){
        //console.table(smjer) // ovo je za kontrolu da li je sve OK
        await RezervacijaService.dodaj(rezervacija).then(()=>{
            navigate(RouteNames.REZERVACIJE)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        
        
        
        
        dodaj({
            gost: parseInt(podaci.get('gost')),
            cijena:parseFloat(podaci.get('cijena')),
            datumRezervacije: new Date().toISOString(),
            datumPocetka: new Date(podaci.get('datumPocetka')).toISOString(),
            datumKraja: new Date(podaci.get('datumKraja')).toISOString(),
            platio: podaci.get('platio') === 'on'
        })
    }






    return(
        <>
        <h3>
            Unos nove rezervacije
        </h3>
         <Container className="mt-4">
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title className="mb-4">Podaci o rezervaciji</Card.Title>
                            <Form onSubmit={odradiSubmit}>
                           
                            <Row>
                                <Col md={6}>
                                   <Form.Group controlId="gost" className="mb-3">
                                        <Form.Label className="fw-bold">Gost</Form.Label>
                                        <Form.Select name="gost" required>
                                            <option value="">Odaberite gosta</option>
                                            {gosti && gosti.map((gost) => (
                                                <option key={gost.sifra} value={gost.sifra}>
                                                    {gost.ime + ' ' + gost.prezime}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                
                            </Row>

                            <Row className="align-items-center">
                                

                                {/* Aktivan - Switch umjesto checkboxa za moderniji izgled */}
                                <Col md={6}>
                                    <Form.Group controlId="platio" className="mb-3 mt-md-3">
                                        <Form.Check
                                            type="switch"
                                            label="Rezervacija je plaćena"
                                            name="platio"
                                            className="fs-5"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <hr />

                            {/* Gumbi za akciju - RWD pozicioniranje */}
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.REZERVACIJE} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Dodaj novu rezervaciju
                                </Button>
                            </div>

                            </Form>
                        </Card.Body>
                    </Card>
                </Container>

            
        </>
    )
}