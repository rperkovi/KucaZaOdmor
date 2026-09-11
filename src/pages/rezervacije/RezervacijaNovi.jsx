import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";
import { useEffect, useState } from "react";
import GostService from "../../services/gosti/GostService";
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import hr from 'date-fns/locale/hr';
import CijenaService from "../../services/cijene/CijenaService";
import { datumJeRezerviran, izracunajUkupnuCijenu, rezervacijaPreklapaRaspon } from "../../utils";
import { NumericFormat } from 'react-number-format';

export default function RezervacijaNovi() {

    const navigate = useNavigate()
    const [gosti, setGosti] = useState([])
    const[cijene, setCijene] = useState([])
    const [cijena, setCijena] = useState('')
    const [uplaceno, setUplaceno] = useState('')
    const [platio, setPlatio] = useState(false)
    const [rezervacije, setRezervacije] = useState([])

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    registerLocale('hr', hr);


    useEffect(() => {
        ucitajGoste()
        ucitajCijene()
        ucitajRezervacije()
    }, [])

    async function ucitajGoste() {
        await GostService.get().then((odgovor) => {

            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }

            setGosti(odgovor.data)
        })
    }

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

    async function dodaj(rezervacija) {
        //console.table(smjer) // ovo je za kontrolu da li je sve OK
        await RezervacijaService.dodaj(rezervacija).then(() => {
            navigate(RouteNames.REZERVACIJE)
        })
    }


    function odradiSubmit(e) { //e je event
        e.preventDefault() // nemoj odraditi submit
        if (!startDate || !endDate) {
            alert('Odaberite početak i kraj rezervacije')
            return
        }
        if (rezervacijaPreklapaRaspon(rezervacije, startDate, endDate)) {
            alert('Odabrani termin je već rezerviran')
            return
        }
        const podaci = new FormData(e.target)

        dodaj({
            gost: parseInt(podaci.get('gost')),
            cijena: podaci.get('cijena') !== '' ? Number(podaci.get('cijena')) : izracunajUkupnuCijenu(startDate, endDate, cijene),
            datumRezervacije: new Date().toISOString(),
            datumPocetka: startDate.toISOString(),
            datumKraja: endDate.toISOString(),
            platio: podaci.get('platio') === 'on',
            uplaceno: podaci.get('uplaceno') !== '' ? Number(podaci.get('uplaceno')) : 0
        })
    }

    

    function brojDana() {
        //console.log(endDate)
        if (endDate == null) {
            return ''
        }
        const razlikaUMilisekundama = Math.abs(endDate - startDate);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu) + ' dana';
    }

    function izracunajZaPlatiti() {
        const ukupnaCijena = cijena !== '' ? Number(cijena) : (startDate && endDate ? izracunajUkupnuCijenu(startDate, endDate, cijene) : 0)
        return Math.max(ukupnaCijena - Number(uplaceno || 0), 0)
    }


    return (
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
                                <Col md={12}>
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
                                            if (update[0] && update[1] && rezervacijaPreklapaRaspon(rezervacije, update[0], update[1])) {
                                                alert('Odabrani termin je već rezerviran')
                                                setDateRange([null, null])
                                                return
                                            }
                                            setDateRange(update);
                                        }}
                                        filterDate={(date) => !datumJeRezerviran(rezervacije, date)}
                                        dayClassName={(date) => datumJeRezerviran(rezervacije, date) ? 'rezervirani-dan' : undefined}
                                        isClearable={true}
                                        // Dodavanje Bootstrap klase input polju
                                        className="form-control odabirDatuma"
                                        placeholderText="Klikni za odabir..."
                                        autoComplete="off"
                                    />


                                </Col>

                            </Row>

                            <Row className="align-items-center" style={{ marginBottom: '10px' }}>
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
                                                    prefix='='
                                                    suffix=' €'
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
                                            value={cijena}
                                            onChange={(e) => setCijena(e.target.value)}
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
                                            value={uplaceno}
                                            onChange={(e) => setUplaceno(e.target.value)}
                                            placeholder="Unesite iznos (npr. 100.50)"
                                        />
                                    </Form.Group>
                                </Col>
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