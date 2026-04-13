import { cijene } from "./CijenaPodaci";


async function get() {
    return {success: true,data: [...cijene]}
}

async function getBySifra(sifra) {
   return {success: true,data: cijene.find(s => s.sifra === parseInt(sifra))} 
}

async function dodaj(cijena){
    if(cijene.length>0){
        cijena.sifra = cijene[cijene.length - 1].sifra + 1
    }else{
        cijena.sifra = 1
    }
    
    cijene.push(gost);
}



async function promjeni(sifra,cijena) {
    const index = nadiIndex(sifra)
    cijene[index] = {...cijene[index], ...cijena}
}

function nadiIndex(sifra){
    return cijene.findIndex(s => s.sifra === parseInt(sifra))
}


async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    cijene.splice(index,1)
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}