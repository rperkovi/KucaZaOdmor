import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Card, Form, ListGroup } from 'react-bootstrap'
import { RouteNames } from '../constants'
import RezervacijaService from '../services/rezervacije/RezervacijaService'
import CijenaService from '../services/cijene/CijenaService'
import FormatDatuma from '../components/FormatDatuma.jsx'
import { datumJeRezerviran, izracunajCijenuLjubimaca, izracunajUkupnuCijenu } from '../utils'
import { Link } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'

export default function Kalendar() {
    const [rezervacije, setRezervacije] = useState([])
    const [cijene, setCijene] = useState([])
    const [dateRange, setDateRange] = useState([null, null])
    const [brojLjubimaca, setBrojLjubimaca] = useState(0)
    const [startDate, endDate] = dateRange

    useEffect(() => {
        async function ucitajPodatke() {
            const [odgovorRezervacije, odgovorCijene] = await Promise.all([
                RezervacijaService.get(),
                CijenaService.get()
            ])
            if (!odgovorRezervacije.success) {
                alert('Nije moguće dohvatiti rezervacije')
            } else {
                setRezervacije(odgovorRezervacije.data)
            }
            if (odgovorCijene.success) {
                setCijene(odgovorCijene.data)
            }
        }

        ucitajPodatke()
    }, [])

    function izracunajUkupno() {
        if (!startDate || !endDate) {
            return 0
        }
        return izracunajUkupnuCijenu(startDate, endDate, cijene)
            + izracunajCijenuLjubimaca(brojLjubimaca, startDate, endDate)
    }

    function imaCijenu(date) {
        const dan = new Date(date)
        dan.setHours(0, 0, 0, 0)

        return cijene.some((cijena) => {
            const od = new Date(cijena.datumPocetka)
            const doo = new Date(cijena.datumKraja)
            od.setHours(0, 0, 0, 0)
            doo.setHours(0, 0, 0, 0)
            return dan >= od && dan <= doo
        })
    }

    return (
        <>
            <h3>Kalendar rezervacija</h3>
            <Card className="mt-4">
                <Card.Body>
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={setDateRange}
                        inline
                        dateFormat="dd.MM.yyyy."
                        filterDate={(date) => !datumJeRezerviran(rezervacije, date) && imaCijenu(date)}
                        dayClassName={(date) => {
                            if (datumJeRezerviran(rezervacije, date)) {
                                return 'rezervirani-dan'
                            }
                            return imaCijenu(date) ? undefined : 'nema-cijene'
                        }}
                    />
                    <p className="fw-bold mt-3">
                        Razdoblje rezervacije
                        {startDate && endDate
                            ? `: ${startDate.toLocaleDateString('hr-HR')} - ${endDate.toLocaleDateString('hr-HR')}`
                            : ''}
                    </p>
                    <Form.Group controlId="kucniLjubimci" className="mb-3 text-start">
                        <Form.Label className="fw-bold">Kućni ljubimci (broj)</Form.Label>
                        <Form.Control
                            type="number"
                            min="0"
                            step="1"
                            value={brojLjubimaca}
                            onChange={(event) => setBrojLjubimaca(event.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="ukupnoIzracunato" className="mb-3 text-start">
                        <Form.Label className="fw-bold">Ukupno (izračunato)</Form.Label>
                        <div className="form-control-plaintext fs-4 fw-bold">
                            {startDate && endDate ? (
                                <NumericFormat
                                    value={izracunajUkupno()}
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
                    <div className="mt-3">
                        <Link to={RouteNames.REZERVACIJE_NOVI} className="btn btn-success">
                            Nova rezervacija
                        </Link>
                    </div>
                </Card.Body>
            </Card>

            <h4 className="mt-4">Rezervirana razdoblja</h4>
            <ListGroup>
                {rezervacije.map((rezervacija) => (
                    <ListGroup.Item key={rezervacija.sifra}>
                        <FormatDatuma datum={rezervacija.datumPocetka} /> - <FormatDatuma datum={rezervacija.datumKraja} />
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )
}
