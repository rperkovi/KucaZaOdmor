import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostService.js"
import { Button, Table } from "react-bootstrap"
import { GrValidate } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants.js"
import RezervacijaService from "../../services/rezervacije/RezervacijaService.js"
import FormatDatuma from "../../components/FormatDatuma.jsx"
import { NumericFormat } from "react-number-format"
import RezervacijaPDFGenerator from "../../components/RezervacijaPDFGenerator.jsx"

export default function RezervacijaPregled() {

    const navigate = useNavigate()
    const [rezervacije, setRezervacije] = useState([])
    const [gosti, setGosti] = useState([])

    useEffect(() => {
        ucitajGoste()
        ucitajRezervacije()
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
    
    // PDF

    async function generirajPDFZaRezervacija(rezervacija) {
       

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
            gost: gostRezervacije 
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
                        <th>Cijena</th>
                        <th>Platio</th>
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
                                <NumericFormat
                                    value={rezervacija.cijena}
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
                                <GrValidate
                                    size={25}
                                    color={rezervacija.platio ? 'green' : 'red'}
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

                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}