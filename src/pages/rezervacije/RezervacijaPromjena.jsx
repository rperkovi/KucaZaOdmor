import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import DatePicker from "react-datepicker";
import GostService from "../../services/gosti/GostService";
import CijenaService from "../../services/cijene/CijenaService";
import { datumJeRezerviran, izracunajUkupnuCijenu, rezervacijaPreklapaRaspon } from "../../utils";
import { NumericFormat } from 'react-number-format';

export default function RezervacijePromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [gosti, setGosti] = useState([])
    const [rezervacija,setRezervacija] = useState({})
    const [platio,setPlatio] = useState(false)
    const[cijene, setCijene] = useState([])
    const [rezervacije, setRezervacije] = useState([])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;


    useEffect(()=>{
        ucitajCijene()
         ucitajGoste()
        ucitajRezervacija()
        ucitajRezervacije()
    },[])

    async function ucitajCijene() {
                await CijenaService.get().then((odgovor)=>{
        
                     if(!odgovor.success){
                        alert('Nije implementiran servis')
                        return
                    }

                    setCijene(odgovor.data)
                })
            }

    async function ucitajRezervacije() {
        const odgovor = await RezervacijaService.get()
        if (!odgovor.success) {
            alert('Nije moguće dohvatiti postojeće rezervacije')
            return
        }
        setRezervacije(odgovor.data)
    }
    

    async function ucitajRezervacija() {
        await RezervacijaService.getBySifra(params.sifra).then((odgovor)=>{
             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
            setRezervacija(s)
            setDateRange([new Date(s.datumPocetka), new Date(s.datumKraja)])

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
        if (!startDate || !endDate) {
            alert('Odaberite početak i kraj rezervacije')
            return
        }
        if (rezervacijaPreklapaRaspon(rezervacije, startDate, endDate, params.sifra)) {
            alert('Odabrani termin je već rezerviran')
            return
        }
        const podaci = new FormData(e.target)
        
        promjeni({
            gost: parseInt(podaci.get('gost')),
        cijena: (podaci.get('cijena') !== null && podaci.get('cijena') !== '') ? Number(podaci.get('cijena')) : izracunajUkupnuCijenu(startDate, endDate, cijene),
            datumRezervacije: new Date().toISOString(),
            datumPocetka: startDate.toISOString(),
            datumKraja: endDate.toISOString(),
            platio: podaci.get('platio') === 'on',
        uplaceno: (podaci.get('uplaceno') !== null && podaci.get('uplaceno') !== '') ? Number(podaci.get('uplaceno')) : 0
        })
    }


    function brojDana() {
        if (endDate == null) {
            return ''
        }
        const razlikaUMilisekundama = Math.abs(endDate - startDate);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu) + ' dana';
    }

    function izracunajZaPlatiti() {
        const cijena = Number(rezervacija.cijena ?? 0)
        const uplaceno = Number(rezervacija.uplaceno ?? 0)
        return Math.max(cijena - uplaceno, 0)
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
                                                if (update[0] && update[1] && rezervacijaPreklapaRaspon(rezervacije, update[0], update[1], params.sifra)) {
                                                    alert('Odabrani termin je već rezerviran')
                                                    setDateRange([null, null])
                                                    return
                                                }
                                                setDateRange(update);
                                            }}
                                            filterDate={(date) => !datumJeRezerviran(rezervacije, date, params.sifra)}
                                            dayClassName={(date) => datumJeRezerviran(rezervacije, date, params.sifra) ? 'rezervirani-dan' : undefined}
                                            isClearable={true}
                                            // Dodavanje Bootstrap klase input polju
                                            className="form-control odabirDatuma"
                                            placeholderText="Klikni za odabir..."
                                        />
                                        

                                </Col>

                            </Row>

                            <Row className="align-items-center" style={{marginBottom: '10px'}}>


                                {/* Uplaćeno - uređivo numeričko polje (sada lijevo) */}
                                <Col md={6}>
                                    <Form.Group controlId="izracunatoUkupno" className="mb-2 mt-md-3 text-start">
                                        <Form.Label className="fw-bold">Ukupno (izračunato)</Form.Label>
                                        <div className="form-control-plaintext">
                                            {startDate && endDate ? (
                                                <NumericFormat
                                                    value={Number(izracunajUkupnuCijenu(startDate, endDate, cijene))}
                                                    displayType={'text'}
                                                    thousandSeparator='.'
                                                    decimalSeparator=','
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    suffix=' €'
                                                    prefix='='
                                                />
                                            ) : '-'}
                                        </div>
                                    </Form.Group>

                                    <Form.Group controlId="ugovorenaCijena" className="mb-2 mt-md-1 text-start">
                                        <Form.Label className="fw-bold">Ugovorena cijena</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="cijena"
                                            step="any"
                                            min="0"
                                            value={rezervacija.cijena ?? ''}
                                            onChange={(e) => setRezervacija({...rezervacija, cijena: e.target.value})}
                                            placeholder="Unesite iznos (npr. 100.00)"
                                        />
                                    </Form.Group>

                                    <Form.Group controlId="uplaceno" className="mb-3 mt-md-2 text-start">
                                        <Form.Label className="fw-bold">Uplaćeno</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="uplaceno"
                                            step="any"
                                            min="0"
                                            value={rezervacija.uplaceno ?? ''}
                                            onChange={(e) => setRezervacija({...rezervacija, uplaceno: e.target.value})}
                                            placeholder="Unesite iznos (npr. 100.50)"
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Aktivan - Switch umjesto checkboxa za moderniji izgled */}
                                <Col md={6}>
                                    <Form.Group controlId="platio" className="mb-3 mt-md-3 text-start">
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

                            <Form.Group controlId="zaPlatiti" className="mb-3 mt-2 text-start">
                                <Form.Label className="fw-bold text-danger">Za Platiti</Form.Label>
                                <div className="form-control-plaintext text-danger fw-bold">
                                    <NumericFormat
                                        value={izracunajZaPlatiti()}
                                        displayType={'text'}
                                        thousandSeparator='.'
                                        decimalSeparator=','
                                        decimalScale={2}
                                        fixedDecimalScale
                                        prefix='='
                                        suffix=' €'
                                    />
                                </div>
                            </Form.Group>

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