import { useEffect, useState } from "react"
import CijenaService from "../../services/cijene/CijenaService.js"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants.js"
import FormatDatuma from "../../components/FormatDatuma.jsx"

export default function CijenaPregled(){
    
    const navigate = useNavigate()
    const[cijene, setCijene] = useState([])


    useEffect(()=>{
        ucitajCijene()
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


        async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await CijenaService.obrisi(sifra)
        ucitajCijene()
    }

    function brojDana(odDatuma, doDatuma) {
        const d1 = new Date(odDatuma);
        const d2 = new Date(doDatuma);
        const razlikaUMilisekundama = Math.abs(d1 - d2);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu);
    }

    
    return(
        <>
        <Link to={RouteNames.CIJENE_NOVI}
        className="btn btn-success w-100 mb-3 mt-3">
            Unos novog cijene
        </Link>
        <Table>
                <thead>
                    <tr>
                        <th>Razdoblje</th>
                        <th>Cijena</th>
                        <th>Popust</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {cijene && cijene.map((cijena)=>(
                    <tr key={cijena.sifra}>

                            <td>
                                <FormatDatuma datum={cijena.datumPocetka} /> - <FormatDatuma datum={cijena.datumKraja} />
                                &nbsp;({brojDana(cijena.datumPocetka, cijena.datumKraja)})
                            </td>
                           <td>{cijena.cijena}</td>
                           
                            <td>
                               {cijena.popust } %
                                </td>
                           
                            <td>
                                <Button onClick={()=>{navigate(`/cijene/${cijena.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(cijena.sifra)}}>
                                    Obriši
                                </Button>
                            </td>
                        </tr>
            ))}
                </tbody>
            </Table>
        </>
    )
}