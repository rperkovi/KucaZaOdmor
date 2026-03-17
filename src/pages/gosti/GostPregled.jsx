import { useEffect, useState } from "react"


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
                <li>{gost.naziv}</li>
            ))}
        </ul>
        
        </>
    )
}