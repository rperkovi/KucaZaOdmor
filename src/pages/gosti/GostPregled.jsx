import { useEffect, useState } from "react"
import GostService from "../../services/gosti/GostiService"

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
        <ul>
            {gosti && gosti.map((gost)=>(
                <li>{gost.ime}</li>
            ))}
        </ul>
        
        </>
    )
}