const STORAGE_KEY = 'cijene';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const cijene = dohvatiSveIzStorage();
    return {success: true,  data: [...rezervacije] };
}

async function getBySifra(sifra) {
    const cijene = dohvatiSveIzStorage();
    const cijena = rezervacije.find(s => s.sifra === parseInt(sifra));
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
    
    rezervacije.push(cijene);
    spremiUStorage(cijene);
    return { data: cijena };
}

async function promjeni(sifra, cijena) {
    const rezervacije = dohvatiSveIzStorage();
    const index = rezervacije.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        cijene[index] = { ...rezervacije[index], ...cijena};
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
