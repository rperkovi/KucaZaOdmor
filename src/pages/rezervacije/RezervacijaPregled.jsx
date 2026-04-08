import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostService.js"
import { Button, Table } from "react-bootstrap"
import { GrValidate } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants.js"
import RezervacijaService from "../../services/rezervacije/RezervacijaService.js"

export default function RezervacijaPregled(){
    
    const navigate = useNavigate()
    const[rezervacije, setRezervacije] = useState([])


    useEffect(()=>{
        ucitajRezervacije()
    },[])   
    
    async function ucitajRezervacije() {
        await RezervacijaService.get().then((odgovor)=>{

             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            setRezervacije(odgovor.data)
        })
    }


        async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await RezervacijaService.obrisi(sifra)
        ucitajRezervacije()
    }

    function brojDana(odDatuma, doDatuma){
        const d1 = new Date(odDatuma);
        const d2 = new Date(doDatuma);
        const razlikaUMilisekundama = Math.abs(d1 - d2);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu);
    }
    
    
    return(
        <>
        <Link to={RouteNames.REZERVACIJE_NOVI}
        className="btn btn-success w-100 mb-3 mt-3">
            Unos nove rezervacije
        </Link>
        <Table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Email</th>
                        <th>Aktivan</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {rezervacije && rezervacije.map((rezervacija)=>(
                    <tr key={rezervacija.sifra}>
                            <td>{rezervacija.ime}</td>
                            <td>{rezervacija.prezime}</td>
                           <td>{rezervacija.email}</td>
                           
                            <td>
                                <GrValidate
                                size={25}
                                color={rezervacija.aktivan ? 'green' : 'red'}
                                />
                                </td>
                           
                            <td>
                                <Button onClick={()=>{navigate(`/rezervacije/${rezervacija.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(rezervacija.sifra)}}>
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