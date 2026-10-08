import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Button, Card, Form, ListGroup } from 'react-bootstrap'
import { RouteNames } from '../constants'
import RezervacijaService from '../services/rezervacije/RezervacijaService'
import CijenaService from '../services/cijene/CijenaService'
import FormatDatuma from '../components/FormatDatuma.jsx'
import {
    datumJeProslost,
    datumJeRezerviran,
    izracunajCijenuLjubimaca,
    izracunajUkupnuCijenu,
    MIN_BROJ_NOCENJA,
    rezervacijaTrajeMinimalnoNocenja
} from '../utils'
import { Link } from 'react-router-dom'
import { NumericFormat } from 'react-number-format'

const kontakti = [
    { ime: 'Roberto', telefon: '+385955620929', prikazTelefona: '+385 955620929' },
    { ime: 'Branislava', telefon: '+385919010767', prikazTelefona: '+385 919010767' }
]
const robertoEmail = 'roberto.perkovic01@gmail.com'
const branislavaEmail = 'branislava.bertosa@gmail.com'

export default function Kalendar() {
    const [rezervacije, setRezervacije] = useState([])
    const [cijene, setCijene] = useState([])
    const [dateRange, setDateRange] = useState([null, null])
    const [gost, setGost] = useState('')
    const [brojLjubimaca, setBrojLjubimaca] = useState(0)
    const [porukaDatuma, setPorukaDatuma] = useState('')
    const [startDate, endDate] = dateRange

    function promijeniRasponDatuma(raspon) {
        const [noviStartDate, noviEndDate] = raspon
        if (noviStartDate && noviEndDate && !rezervacijaTrajeMinimalnoNocenja(noviStartDate, noviEndDate)) {
            setDateRange([noviStartDate, null])
            setPorukaDatuma(`Rezervacija mora trajati najmanje ${MIN_BROJ_NOCENJA} noćenja.`)
            return
        }

        setDateRange(raspon)
        setPorukaDatuma('')
    }

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

    const mozePoslatiPoruku = Boolean(gost.trim() && rezervacijaTrajeMinimalnoNocenja(startDate, endDate))
    const tekstPoruke = mozePoslatiPoruku
        ? [
            `Gost: ${gost.trim()}`,
            `Razdoblje: ${startDate.toLocaleDateString('hr-HR')} - ${endDate.toLocaleDateString('hr-HR')}`,
            `Kućni ljubimci: ${Number(brojLjubimaca) || 0}`,
            `Ukupno (izračunato): ${izracunajUkupno().toLocaleString('hr-HR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })} €`
        ].join('\n')
        : ''

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
            <Form.Group className="mb-3 mt-3 text-start">
                <Form.Label className="fw-bold">Gost</Form.Label>
                <Form.Control
                    type="text"
                    value={gost}
                    onChange={(event) => setGost(event.target.value)}
                    placeholder="Unesite ime gosta"
                    autoComplete="off"
                />
            </Form.Group>
            <Card className="mt-4">
                <Card.Body>
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={promijeniRasponDatuma}
                        inline
                        dateFormat="dd.MM.yyyy."
                        filterDate={(date) => !datumJeProslost(date)
                            && !datumJeRezerviran(rezervacije, date)
                            && imaCijenu(date)}
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
                    {porukaDatuma && <p className="text-danger" role="alert">{porukaDatuma}</p>}
                    <Form.Group controlId="kucniLjubimci" className="mb-3 text-start calendar-pet-count">
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
                    <div className="mb-3 text-start">
                        <p className="fw-bold mb-1">Kontakt</p>
                        {kontakti.map(({ ime, telefon, prikazTelefona }) => (
                            <div key={telefon} className="mb-2">
                                <div className="d-flex align-items-center gap-2">
                                    <a href={`tel:${telefon}`}>{ime}: {prikazTelefona}</a>
                                    {mozePoslatiPoruku ? (
                                        <Button
                                            as="a"
                                            href={`sms:${telefon}?body=${encodeURIComponent(tekstPoruke)}`}
                                            variant="outline-success"
                                            size="sm"
                                            aria-label={`Pošalji SMS kontaktu ${ime}`}
                                        >
                                            SMS
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline-success"
                                            size="sm"
                                            disabled
                                            aria-label={`SMS kontaktu ${ime} (prvo unesite gosta i datume)`}
                                        >
                                            SMS
                                        </Button>
                                    )}
                                </div>
                                {(ime === 'Roberto' || ime === 'Branislava') && (
                                    <div className="d-flex align-items-center gap-2 ms-3 mt-1">
                                        <a href={`mailto:${ime === 'Roberto' ? robertoEmail : branislavaEmail}`}>
                                            {ime === 'Roberto' ? robertoEmail : branislavaEmail}
                                        </a>
                                        {mozePoslatiPoruku ? (
                                            <Button
                                                as="a"
                                                href={`mailto:${ime === 'Roberto' ? robertoEmail : branislavaEmail}?subject=${encodeURIComponent('Upit za rezervaciju')}&body=${encodeURIComponent(tekstPoruke)}`}
                                                variant="outline-primary"
                                                size="sm"
                                                aria-label={`Pošalji email ${ime}`}
                                            >
                                                Email
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                variant="outline-primary"
                                                size="sm"
                                                disabled
                                                aria-label={`Email ${ime} (prvo unesite gosta i datume)`}
                                            >
                                                Email
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-3">
                        {rezervacijaTrajeMinimalnoNocenja(startDate, endDate) ? (
                            <Link
                                to={RouteNames.UPITI_NOVI}
                                state={{
                                    dateRange: [startDate, endDate],
                                    gost,
                                    brojLjubimaca,
                                    iznos: izracunajUkupno()
                                }}
                                className="btn btn-success"
                            >
                                Novi upit
                            </Link>
                        ) : (
                            <button type="button" className="btn btn-success" disabled>
                                Novi upit
                            </button>
                        )}
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
