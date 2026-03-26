import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostService.js"
import { Button, Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import FormatDatuma from "../../components/FormatDatuma.jsx"
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
            setGosti(odgovor.data)
        })
    }
    
    
    return(
        <>
        <Link to={RouteNames.GOSTI_NOVI}
        className="btn btn-success w-100 mb-3 mt-3">
            Unos novg gosta
        </Link>
        <Table>
                <thead>
                    <tr>
                        <th>Ime</th>
                        <th>Prezime</th>
                        <th>Trajanje (Dana)</th>
                        <th>Cijena</th>
                        <th>Datumi</th>
                        <th>Aktivan</th>
                        <th>Platio</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {gosti && gosti.map((gost)=>(
                    <tr key={gost.sifra}>
                            <td>{gost.ime}</td>
                            <td>{gost.prezime}</td>
                            <td>{gost.trajanjeDana}</td>
                            <td>
                                <NumericFormat 
                                value={gost.cijena}
                                displayType={'text'}
                                thousandSeparator='.'
                                decimalSeparator=','
                                suffix={'€'}
                                decimalScale={2}
                                fixedDecimalScale
                                />
                            </td>
                            <td>Rezervirano <FormatDatuma datum={gost.datumRezervacije} /> <br />  za
                                razdoblje <br /> <FormatDatuma datum={gost.datumPocetka} /> - <FormatDatuma datum={gost.datumKraja} />
                            </td>
        

                            <td>
                                <GrValidate
                                size={25}
                                color={gost.aktivan ? 'green' : 'red'}
                                />
                                </td>
                            <td>
                                 <GrValidate
                                size={25}
                                color={gost.platio ? 'green' : 'red'}
                                />
                            </td>
                            <td>
                                <Button onClick={()=>{navigate(`/gosti/${gost.sifra}`)}}>
                                    Promjena
                                </Button>
                            </td>
                        </tr>
            ))}
                </tbody>
            </Table>
        </>
    )
}