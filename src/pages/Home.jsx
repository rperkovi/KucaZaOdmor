import { IME_APLIKACIJE } from "../constants";
import mojaSlika from '../assets/slika.jpg'

export default function Home(){
    return(
    <>
    <h1>Dobrodošli na {IME_APLIKACIJE}</h1>
    <div>
        <img src={mojaSlika} alt="Opis slike" />
 
    </div>
    </>
    )

}