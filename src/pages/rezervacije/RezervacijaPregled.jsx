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
import { izracunajCijenuLjubimaca } from "../../utils"

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
        return gost ? gost.ime + ' ' + gost.prezime : 'Nepoznat gost'
    }

    function jePotvrdena(rezervacija) {
        return Boolean(rezervacija?.potvrdio ?? rezervacija?.platio ?? false)
    }

    function izracunajUgovorenuCijenu(rezervacija) {
        if (rezervacija?.osnovnaCijena != null) {
            return Number(rezervacija.osnovnaCijena)
        }
        if (rezervacija?.cijena != null) {
            return Number(rezervacija.cijena)
        }
        return cijene.length > 0
            ? Number(izracunajUkupnuCijenu(rezervacija.datumPocetka, rezervacija.datumKraja, cijene))
            : null
    }

    function izracunajUplaceno(rezervacija) {
        // Uplaćeno se sada čita iz rezervacija.uplaceno; vraća broj (0 kada nije postavljeno)
        return Number(rezervacija?.uplaceno ?? 0)
    }

    function izracunajZaPlatiti(rezervacija) {
        // Za platiti = cijena - uplaceno; ne smije biti negativno
        const cijena = izracunajUgovorenuCijenu(rezervacija) ?? 0
        const dodatakZaLjubimce = izracunajCijenuLjubimaca(
            rezervacija?.kucniLjubimci,
            rezervacija?.datumPocetka,
            rezervacija?.datumKraja
        )
        const uplaceno = izracunajUplaceno(rezervacija)
        const razlika = cijena + dodatakZaLjubimce - uplaceno
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
                        <th className="razdoblje-rezervacije">Razdoblje rezervacije</th>
                        <th>Ukupno (izračunato)</th>
                        <th>Potvrdio</th>
                        <th>Ugovorena cijena (bez kućnih ljubimaca)</th>
                        <th>Kućni ljubimci (ukupno)</th>
                        <th>Uplaćeno</th>
                        <th>Za platiti</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {rezervacije && rezervacije.map((rezervacija) => (
                        <tr key={rezervacija.sifra}>
                            <td>{dohvatiPodatkeGosta(rezervacija.gost)}</td>
                            <td className="razdoblje-rezervacije">
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

                            <td className="fw-bold">
                                <NumericFormat
                                    value={izracunajCijenuLjubimaca(
                                        rezervacija.kucniLjubimci,
                                        rezervacija.datumPocetka,
                                        rezervacija.datumKraja
                                    )}
                                    displayType="text"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    decimalScale={2}
                                    fixedDecimalScale
                                    suffix=" €"
                                />
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
                                PDF GER
                            </Button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}