import { IME_APLIKACIJE } from "../constants";
import mojaSlika from '../assets/slika.jpg'

export default function Home(){
    return(
    <>
    <h1>Dobrodošli na {IME_APLIKACIJE}</h1>
    <div class="container">
  <div class="row">
 
    <div class="col-7">
      <img src={mojaSlika} alt="Opis slike" className="slika" />
    </div>
  </div>
    </div>
    
    </>
    )
}