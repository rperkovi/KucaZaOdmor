import { cijene as zadaneCijene } from './CijenaPodaci';

const STORAGE_KEY = 'cijene';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);

    if (!podaci) {
        const inicijalneCijene = [...zadaneCijene];
        spremiUStorage(inicijalneCijene);
        return inicijalneCijene;
    }

    try {
        const parsed = JSON.parse(podaci);

        if (!Array.isArray(parsed) || parsed.length === 0) {
            const inicijalneCijene = [...zadaneCijene];
            spremiUStorage(inicijalneCijene);
            return inicijalneCijene;
        }

        const ima2027 = parsed.some(item => item.datumPocetka && item.datumPocetka.startsWith('2027'));

        if (!ima2027) {
            const spojeneCijene = [
                ...zadaneCijene,
                ...parsed.filter(item => !zadaneCijene.some(zadana => zadana.sifra === item.sifra))
            ];
            spremiUStorage(spojeneCijene);
            return spojeneCijene;
        }

        return parsed;
    } catch (error) {
        const inicijalneCijene = [...zadaneCijene];
        spremiUStorage(inicijalneCijene);
        return inicijalneCijene;
    }
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const cijene = dohvatiSveIzStorage();
    return {success: true,  data: [...cijene] };
}

async function getBySifra(sifra) {
    const cijene = dohvatiSveIzStorage();
    const cijena = cijene.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: cijena };
}

async function dodaj(cijena) {
    const cijene = dohvatiSveIzStorage();
    
    if (cijene.length === 0) {
        cijena.sifra = 1;
    } else {
        const maxSifra = Math.max(...cijene.map(s => s.sifra));
        cijena.sifra = maxSifra + 1;
    }
    
    cijene.push(cijena);
    spremiUStorage(cijene);
    return { data: cijena };
}

async function promjeni(sifra, cijena) {
    const cijene = dohvatiSveIzStorage();
    const index = cijene.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        cijene[index] = { ...cijene[index], ...cijena};
        spremiUStorage(cijene);
    }
    return { data: cijene[index] };
}

async function obrisi(sifra) {
    let cijene = dohvatiSveIzStorage();
    cijene = cijene.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(cijene);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
