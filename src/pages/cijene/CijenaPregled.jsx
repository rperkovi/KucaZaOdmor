import { useEffect, useState } from "react"
import CijenaService from "../../services/cijene/CijenaService.js"
import { Button, Table } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants.js"

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

    
    return(
        <>
        <Link to={RouteNames.CIJENE_NOVI}
        className="btn btn-success w-100 mb-3 mt-3">
            Unos novog cijene
        </Link>
        <Table>
                <thead>
                    <tr>
                        <th>Datum od</th>
                        <th>Datum do</th>
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