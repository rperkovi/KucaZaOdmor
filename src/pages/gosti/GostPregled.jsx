import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostiService"
import { Table } from "react-bootstrap"
import { NumericFormat } from "react-number-format"
import FormatDatuma from "../../components/FormatDatuma.jsx"
import { GrValidate } from "react-icons/gr"

export default function GostPregled(){
    
    
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
        <Table>
                <thead>
                    <tr>
                        <th>Ime i Prezime</th>
                        <th>Trajanje</th>
                        <th>Cijena</th>
                        <th>Datum Pokretanja</th>
                        <th>Aktivan</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    {gosti && gosti.map((gost)=>(
                    <tr>
                            <td>{gost.ime}</td>
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
                            <td>
                                <FormatDatuma datum={gost.datumPokretanja} />
                            </td>
        

                            <td>
                                <GrValidate
                                size={25}
                                color={gost.aktivan ? 'green' : 'red'}
                                />
                                </td>
                            <td></td>
                        </tr>
            ))}
                </tbody>
            </Table>
        </>
    )
}