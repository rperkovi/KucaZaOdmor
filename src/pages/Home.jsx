import { IME_APLIKACIJE } from "../constants";
import mojaSlika from '../assets/slika.jpg'

export default function Home(){
    return(
    <>
    <h1>Dobrodošli na {IME_APLIKACIJE}</h1>
    <div className="container">
  <div className="row">
 
    <div className="col-6">
      <img src={mojaSlika} alt="Opis slike" className="slika" />
    </div>
    <div className="col-6">
      kasnije
    </div>
  </div>
    </div>
    
    </>
    )
}