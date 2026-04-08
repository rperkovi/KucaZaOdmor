const STORAGE_KEY = 'rezervacije';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const rezervacije = dohvatiSveIzStorage();
    return {success: true,  data: [...rezervacije] };
}

async function getBySifra(sifra) {
    const rezervacije = dohvatiSveIzStorage();
    const rezervacija = rezervacije.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: rezervacija };
}

async function dodaj(rezervacija) {
    const rezervacije = dohvatiSveIzStorage();
    
    if (rezervacije.length === 0) {
        rezervacija.sifra = 1;
    } else {
        const maxSifra = Math.max(...rezervacije.map(s => s.sifra));
        rezervacija.sifra = maxSifra + 1;
    }
    
    rezervacije.push(rezervacija);
    spremiUStorage(rezervacije);
    return { data: rezervacija };
}

async function promjeni(sifra, rezervacija) {
    const rezervacije = dohvatiSveIzStorage();
    const index = rezervacije.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        rezervacije[index] = { ...rezervacije[index], ...rezervacija};
        spremiUStorage(rezervacije);
    }
    return { data: rezervacije[index] };
}

async function obrisi(sifra) {
    let rezervacije = dohvatiSveIzStorage();
    rezervacije = rezervacije.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(rezervacije);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
