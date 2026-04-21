import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import DatePicker from "react-datepicker";
import GostService from "../../services/gosti/GostService";

export default function RezervacijePromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [gosti, setGosti] = useState([])
    const [rezervacija,setRezervacija] = useState({})
    const [platio,setPlatio] = useState(false)

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;


    useEffect(()=>{
         ucitajGoste()
        ucitajRezervacija()
    },[])

    async function ucitajRezervacija() {
        await RezervacijaService.getBySifra(params.sifra).then((odgovor)=>{
             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
            setRezervacija(s)
            setDateRange([s.datumPocetka, s.datumKraja])

            setPlatio(s.platio)
        })
    }

     async function ucitajGoste() {
            await GostService.get().then((odgovor) => {
    
                if (!odgovor.success) {
                    alert('Nije implementiran servis')
                    return
                }
    
                setGosti(odgovor.data)
            })
        }

    

    async function promjeni(rezervacija){
        //console.table(gost) // ovo je za kontrolu da li je sve OK
        await RezervacijaService.promjeni(params.sifra,rezervacija).then(()=>{
            navigate(RouteNames.REZERVACIJE)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        
        promjeni({
            gost: parseInt(podaci.get('gost')),
            cijena: 100, //parseFloat(podaci.get('cijena')), -- Ovdje će se dovući cijena iz cjenika za to razdoblje
            datumRezervacije: new Date().toISOString(),
            datumPocetka: startDate.toISOString(),
            datumKraja: endDate.toISOString(),
            platio: podaci.get('platio') === 'on'
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


    return(
        <>
       <h3>
                Promjena rezervacije
            </h3>
            <Container className="mt-4">
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="mb-4">Podaci o rezervaciji</Card.Title>
                        <Form onSubmit={odradiSubmit}>

                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="gost" className="mb-3">
                                        <Form.Label className="fw-bold">Gost</Form.Label>
                                        <Form.Select name="gost" required value={rezervacija.gost} onChange={(e)=>{ setRezervacija({...rezervacija, gost: parseInt(e.target.value)})}}>
                                            <option value="">Odaberite gosta</option>
                                            {gosti && gosti.map((gost) => (
                                                <option key={gost.sifra} value={gost.sifra}>
                                                    {gost.ime + ' ' + gost.prezime}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                           <p className="fw-bold form-label">
                                             Razdoblje rezervacije {brojDana()}
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
                                            label="Rezervacija je potvrđena"
                                            name="platio"
                                            className="fs-5"
                                            checked={platio}
                                            onChange={(e) => setPlatio(e.target.checked)}
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
                                    Promjeni rezervaciju
                                </Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}