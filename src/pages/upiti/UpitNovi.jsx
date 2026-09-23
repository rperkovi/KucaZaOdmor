import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import hr from 'date-fns/locale/hr'
import { Link } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'
import { RouteNames } from '../../constants'

export default function UpitNovi() {
    registerLocale('hr', hr)

    const [dateRange, setDateRange] = useState([null, null])
    const [gost, setGost] = useState('')
    const [brojLjubimaca, setBrojLjubimaca] = useState(0)
    const [napomena, setNapomena] = useState('')
    const [startDate, endDate] = dateRange

    function brojDana() {
        if (!startDate || !endDate) {
            return ''
        }

        const razlikaUMilisekundama = Math.abs(endDate - startDate)
        const milisekundiUDanu = 1000 * 60 * 60 * 24
        return Math.round(razlikaUMilisekundama / milisekundiUDanu) + ' dana'
    }

    function izracunajProcijenjeniIznos() {
        if (!startDate || !endDate) {
            return 0
        }

        const dani = Math.max(Math.round(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)), 1)
        const osnovica = dani * 60
        const dodatakZaLjubimce = brojLjubimaca * 12 * dani
        return osnovica + dodatakZaLjubimce
    }

    function odradiSubmit(e) {
        e.preventDefault()

        if (!gost.trim()) {
            alert('Unesite ime gosta.')
            return
        }

        if (!startDate || !endDate) {
            alert('Odaberite datum dolaska i odlaska.')
            return
        }

        alert(`Upit za gosta ${gost.trim()} je zaprimljen za period ${startDate.toLocaleDateString('hr-HR')} - ${endDate.toLocaleDateString('hr-HR')}.`)
        setGost('')
        setNapomena('')
        setDateRange([null, null])
        setBrojLjubimaca(0)
    }

    return (
        <>
            <h3>Novi upit</h3>
            <Container className="mt-4">
                <Card className="shadow-sm">
                    <Card.Body>
                        <Card.Title className="mb-4">Podaci o upitu</Card.Title>
                        <Form onSubmit={odradiSubmit}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-bold">Gost</Form.Label>
                                        <Form.Control
                                            type="text"
                                                value={gost}
                                                onChange={(event) => setGost(event.target.value)}
                                                placeholder="Unesite ime gosta"
                                                autoComplete="off"
                                            />
                                    </Form.Group>
                                </Col>
                                <Col md={12}>
                                    <p className="fw-bold form-label mb-2">
                                        Razdoblje rezervacije
                                    </p>
                                    <DatePicker
                                        name="razdoblje"
                                        id="razdoblje"
                                        selectsRange={true}
                                        startDate={startDate}
                                        endDate={endDate}
                                        onChange={setDateRange}
                                        locale="hr"
                                        dateFormat="dd.MM.yyyy."
                                        isClearable={true}
                                        className="form-control odabirDatuma"
                                        placeholderText="Klikni za odabir..."
                                        autoComplete="off"
                                    />
                                    {startDate && endDate && (
                                        <div className="mt-2 fw-semibold text-muted">
                                            {brojDana()}
                                        </div>
                                    )}
                                </Col>
                            </Row>

                            <Row className="align-items-center mt-3">
                                <Col md={6}>
                                    <Form.Group className="mb-2 text-start">
                                        <Form.Label className="fw-bold fs-6">Kućni ljubimci</Form.Label>
                                        <Form.Control
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={brojLjubimaca}
                                            onChange={(event) => setBrojLjubimaca(Number(event.target.value || 0))}
                                            style={{ maxWidth: '180px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start">
                                        <Form.Label className="fw-bold">Procijenjeni iznos</Form.Label>
                                        <div className="form-control-plaintext fw-bold text-success">
                                            {startDate && endDate ? (
                                                <NumericFormat
                                                    value={izracunajProcijenjeniIznos()}
                                                    displayType="text"
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    decimalScale={2}
                                                    fixedDecimalScale
                                                    suffix=" €"
                                                />
                                            ) : '-'}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3 text-start">
                                <Form.Label className="fw-bold">Napomena</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={napomena}
                                    onChange={(event) => setNapomena(event.target.value)}
                                    placeholder="Dodajte dodatne informacije o zahtjevu..."
                                />
                            </Form.Group>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                <Link to={RouteNames.KALENDAR} className="btn btn-danger px-4">
                                    Odustani
                                </Link>
                                <Button type="submit" variant="success">
                                    Pošalji upit
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
