import RezervacijaServiceLocalStorage from "./RezervacijaServiceLocalStorage";
import RezervacijaServiceMemorija from "./RezervacijaServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = RezervacijaServiceMemorija;
        break;
    case 'localStorage':
        Servis = RezervacijaServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (Rezervacija) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, Rezervacija) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (Rezervacija) => AktivniServis.dodaj(Rezervacija),
    promjeni: (sifra, Rezervacija) => AktivniServis.promjeni(sifra, Rezervacija),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};