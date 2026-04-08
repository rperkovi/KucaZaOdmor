const STORAGE_KEY = 'gosti';

function dohvatiSveIzStorage() {
    const podaci = localStorage.getItem(STORAGE_KEY);
    return podaci ? JSON.parse(podaci) : [];
}

function spremiUStorage(podaci) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(podaci));
}

async function get() {
    const gosti = dohvatiSveIzStorage();
    return {success: true,  data: [...gosti] };
}

async function getBySifra(sifra) {
    const gosti = dohvatiSveIzStorage();
    const gost = gosti.find(s => s.sifra === parseInt(sifra));
    return {success: true,  data: gost };
}

async function dodaj(gost) {
    const gosti = dohvatiSveIzStorage();
    
    if (gosti.length === 0) {
        gost.sifra = 1;
    } else {
        const maxSifra = Math.max(...gosti.map(s => s.sifra));
        gost.sifra = maxSifra + 1;
    }
    
    gosti.push(gost);
    spremiUStorage(gosti);
    return { data: gost };
}

async function promjeni(sifra, gost) {
    const gosti = dohvatiSveIzStorage();
    const index = gosti.findIndex(s => s.sifra === parseInt(sifra));
    
    if (index !== -1) {
        gosti[index] = { ...gosti[index], ...gost};
        spremiUStorage(gosti);
    }
    return { data: gosti[index] };
}

async function obrisi(sifra) {
    let gosti = dohvatiSveIzStorage();
    gosti = gosti.filter(s => s.sifra !== parseInt(sifra));
    spremiUStorage(gosti);
    return { message: 'Obrisano' };
}

export default {
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
};
