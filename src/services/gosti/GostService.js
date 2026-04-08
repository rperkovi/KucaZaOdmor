import GostServiceLocalStorage from "./GostServiceLocalStorage";
import GostServiceMemorija from "./GostServiceMemorija";
import { DATA_SOURCE } from "../../constants";

let Servis = null;


switch (DATA_SOURCE) {
    case 'memorija':
        Servis = GostServiceMemorija;
        break;
    case 'localStorage':
        Servis = GostServiceLocalStorage;
        break;
    default:
        Servis = null;
}


const PrazanServis = {
    get: async () => ({ success: false, data: []}),
    getBySifra: async (sifra) => ({ success: false, data: {} }),
    dodaj: async (Gost) => { console.error("Servis nije učitan"); },
    promjeni: async (sifra, Gost) => { console.error("Servis nije učitan"); },
    obrisi: async (sifra) => { console.error("Servis nije učitan"); }
};

// 3. Jedan jedini export na kraju
// Ako Servis postoji, koristi njega, inače koristi PrazanServis
const AktivniServis = Servis || PrazanServis;

export default {
    get: () => AktivniServis.get(),
    getBySifra: (sifra) => AktivniServis.getBySifra(sifra),
    dodaj: (Gost) => AktivniServis.dodaj(Gost),
    promjeni: (sifra, Gost) => AktivniServis.promjeni(sifra, Gost),
    obrisi: (sifra) => AktivniServis.obrisi(sifra)
};