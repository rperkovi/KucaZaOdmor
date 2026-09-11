import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostService.js"
import { Button, Table } from "react-bootstrap"
import { GrValidate } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants.js"
import RezervacijaService from "../../services/rezervacije/RezervacijaService.js"
import CijenaService from "../../services/cijene/CijenaService"
import { izracunajUkupnuCijenu } from "../../utils"
import FormatDatuma from "../../components/FormatDatuma.jsx"
import { NumericFormat } from "react-number-format"
import RezervacijaPDFGenerator from "../../components/RezervacijaPDFGenerator.jsx"

export default function RezervacijaPregled() {

    const navigate = useNavigate()
    const [rezervacije, setRezervacije] = useState([])
    const [gosti, setGosti] = useState([])
    const [cijene, setCijene] = useState([])

    useEffect(() => {
        ucitajGoste()
        ucitajRezervacije()
        ucitajCijene()
    }, [])

    async function ucitajRezervacije() {
        await RezervacijaService.get().then((odgovor) => {

            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }

            setRezervacije(odgovor.data)
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



    async function obrisi(sifra) {
        if (!confirm('Sigurno obrisati')) {
            return
        }
        await RezervacijaService.obrisi(sifra)
        ucitajRezervacije()
    }

    async function ucitajCijene() {
        await CijenaService.get().then((odgovor) => {
            if (!odgovor.success) {
                setCijene([])
                return
            }
            setCijene(odgovor.data)
        })
    }

    function brojDana(odDatuma, doDatuma) {
        const d1 = new Date(odDatuma);
        const d2 = new Date(doDatuma);
        const razlikaUMilisekundama = Math.abs(d1 - d2);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu);
    }

    function dohvatiPodatkeGosta(sifraGosta) {
        const gost = gosti.find(s => s.sifra === sifraGosta)
        return gost ? gost.ime + ' ' + gost.prezime + '<' + gost.email + '>' : 'Nepoznat gost'
    }

    function jePotvrdena(rezervacija) {
        return Boolean(rezervacija?.potvrdio ?? rezervacija?.platio ?? false)
    }

    function izracunajUgovorenuCijenu(rezervacija) {
        // Ugovorena cijena se sada čita iz samog objekta rezervacije (unos na stranici Promjena)
        return rezervacija?.cijena != null ? Number(rezervacija.cijena) : null
    }

    function izracunajUplaceno(rezervacija) {
        // Uplaćeno se sada čita iz rezervacija.uplaceno; vraća broj (0 kada nije postavljeno)
        return Number(rezervacija?.uplaceno ?? 0)
    }

    function izracunajZaPlatiti(rezervacija) {
        // Za platiti = cijena - uplaceno; ne smije biti negativno
        const cijena = Number(rezervacija?.cijena ?? 0)
        const uplaceno = izracunajUplaceno(rezervacija)
        const razlika = cijena - uplaceno
        return razlika > 0 ? razlika : 0
    }
    
    // PDF

    async function generirajPDFZaRezervacija(rezervacija, language = 'hr') {
       

        // Dohvati sve polaznike
        const odgovorGosti = await GostService.get()
        if (!odgovorGosti.success) {
            alert('Nije moguće dohvatiti goste')
            return
        }

        // Filtriraj polaznike koji pripadaju ovoj grupi
        const gostRezervacije = odgovorGosti.data.find(p => rezervacija.gost === p.sifra)
        console.log(gostRezervacije)
        // Generiraj PDF
        const generiraj = RezervacijaPDFGenerator({ 
            rezervacija, 
            gost: gostRezervacije,
            language
        })
        await generiraj()
    }


    return (
        <>
            <Link to={RouteNames.REZERVACIJE_NOVI}
                className="btn btn-success w-100 mb-3 mt-3">
                Unos nove rezervacije
            </Link>
            <Table>
                <thead>
                    <tr>
                        <th>Gost</th>
                        <th>Datum rezerviranja</th>
                        <th>Razdoblje rezervacije</th>
                        <th>Ukupno (izračunato)</th>
                        <th>Potvrdio</th>
                        <th>Ugovorena cijena</th>
                        <th>Uplaćeno</th>
                        <th>Za platiti</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {rezervacije && rezervacije.map((rezervacija) => (
                        <tr key={rezervacija.sifra}>
                            <td>{dohvatiPodatkeGosta(rezervacija.gost)}</td>
                            <td>
                                <FormatDatuma datum={rezervacija.datumRezervacije} />
                            </td>
                            <td>
                                <FormatDatuma datum={rezervacija.datumPocetka} /> - <FormatDatuma datum={rezervacija.datumKraja} />
                                &nbsp;({brojDana(rezervacija.datumPocetka, rezervacija.datumKraja)})
                            </td>
                            <td>
                                {cijene && cijene.length > 0 ? (
                                    <NumericFormat
                                        value={Number(izracunajUkupnuCijenu(rezervacija.datumPocetka, rezervacija.datumKraja, cijene))}
                                        displayType={'text'}
                                        thousandSeparator='.'
                                        decimalSeparator=','
                                        suffix=' €'
                                        prefix='='
                                        decimalScale={2}
                                        fixedDecimalScale
                                    />
                                ) : '-'}
                            </td>

                            <td>
                                <GrValidate
                                    size={25}
                                    color={jePotvrdena(rezervacija) ? 'green' : 'red'}
                                />
                            </td>

                            <td className="fw-bold">
                                {izracunajUgovorenuCijenu(rezervacija) == null ? '-' : (
                                    <NumericFormat
                                        value={izracunajUgovorenuCijenu(rezervacija)}
                                        displayType={'text'}
                                        thousandSeparator='.'
                                        decimalSeparator=','
                                        suffix=' €'
                                        prefix='='
                                        decimalScale={2}
                                        fixedDecimalScale
                                    />
                                )}
                            </td>

                            <td>
                                <NumericFormat
                                    value={izracunajUplaceno(rezervacija)}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    suffix=' €'
                                    prefix='='
                                    decimalScale={2}
                                    fixedDecimalScale
                                />
                            </td>

                            <td className="text-danger fw-bold">
                                <NumericFormat
                                    value={izracunajZaPlatiti(rezervacija)}
                                    displayType={'text'}
                                    thousandSeparator='.'
                                    decimalSeparator=','
                                    suffix=' €'
                                    prefix='='
                                    decimalScale={2}
                                    fixedDecimalScale
                                />
                            </td>

                            <td>
                                <Button onClick={() => { navigate(`/rezervacije/${rezervacija.sifra}`) }}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                <Button variant="danger" onClick={() => { obrisi(rezervacija.sifra) }}>
                                    Obriši
                                </Button>
                                                            &nbsp;&nbsp;
                            <Button variant="info" onClick={() => generirajPDFZaRezervacija(rezervacija)}>
                                PDF
                            </Button>
                            &nbsp;&nbsp;
                            <Button variant="secondary" onClick={() => generirajPDFZaRezervacija(rezervacija, 'de')}>
                                PDF DE
                            </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}