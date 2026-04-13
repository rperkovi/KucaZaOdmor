
import { DATA_SOURCE } from "../../constants";
import CijenaServiceLocalStorage from "./CijenaServiceLocalStorage";
import CijenaServiceMemorija from "./CijenaServiceMemorija";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = CijenaServiceMemorija;
        break;
    case 'localStorage':
        Servis = CijenaServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (Cijena) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, Cijena) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (Cijena) => AktivniServis.dodaj(Cijena),
    promjeni: (sifra, Cijena) => AktivniServis.promjeni(sifra, Cijena),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};