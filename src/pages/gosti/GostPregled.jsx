import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostService.js"
import { Button, Table } from "react-bootstrap"
import { GrValidate } from "react-icons/gr"
import { Link, useNavigate } from "react-router-dom"
import { RouteNames } from "../../constants.js"

export default function GostPregled(){
    
    const navigate = useNavigate()
    const[gosti, setGosti] = useState([])


    useEffect(()=>{
        ucitajGoste()
    },[])   
    
    async function ucitajGoste() {
        await GostService.get().then((odgovor)=>{

             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            setGosti(odgovor.data)
        })
    }


        async function obrisi(sifra) {
        if(!confirm('Sigurno obrisati')){
            return
        }
        await GostService.obrisi(sifra)
        ucitajGoste()
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
        <Link to={RouteNames.GOSTI_NOVI}
        className="btn btn-success w-100 mb-3 mt-3">
            Unos novog gosta
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
                    {gosti && gosti.map((gost)=>(
                    <tr key={gost.sifra}>
                            <td>{gost.ime}</td>
                            <td>{gost.prezime}</td>
                           <td>{gost.email}</td>
                           
                            <td>
                                <GrValidate
                                size={25}
                                color={gost.aktivan ? 'green' : 'red'}
                                />
                                </td>
                           
                            <td>
                                <Button onClick={()=>{navigate(`/gosti/${gost.sifra}`)}}>
                                    Promjena
                                </Button>
                                &nbsp;&nbsp;
                                 <Button variant="danger" onClick={()=>{obrisi(gost.sifra)}}>
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