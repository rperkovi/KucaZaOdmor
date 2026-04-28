import { IME_APLIKACIJE } from "../constants";
import mojaSlika from '../assets/slika.jpg'

export default function GeneriranejPodataka(){
    return(
    <>
      Ovdje dođe generiranje
    </>
    )
}


export const dohvatiRezervacijeSPlatiteljem = (rezervacije, gosti) => {
    return rezervacije.map(rezervacija => {
        // Pronađi gosta čija šifra odgovara onoj u rezervaciji
        const gostPodaci = gosti.find(gost => gost.sifra === rezervacija.gost);
        
        return {
            ...rezervacija,
            gostDetalji: gostPodaci ? `${gostPodaci.ime} ${gostPodaci.prezime}` : 'Nepoznat gost',
            emailGosta: gostPodaci?.email || 'Nema emaila'
        };
    });
};

// Primjena u komponenti:
const prošireneRezervacije = dohvatiRezervacijeSPlatiteljem(rezervacije, gosti);
console.log(prošireneRezervacije);