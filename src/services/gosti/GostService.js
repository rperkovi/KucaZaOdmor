import { gosti } from "./GostPodaci";


async function get() {
    return {data: [...gosti]}
}

async function getBySifra(sifra) {
   return {data: gosti.find(s => s.sifra === parseInt(sifra))} 
}

async function dodaj(gost){
    if(gosti.length>0){
        gost.sifra = gosti[gosti.length - 1].sifra + 1
    }else{
        gost.sifra = 1
    }
    
    gosti.push(gost);
}



async function promjeni(sifra,gost) {
    const index = nadiIndex(sifra)
    gosti[index] = {...gosti[index], ...gost}
}

function nadiIndex(sifra){
    return gosti.findIndex(s => s.sifra === parseInt(sifra))
}


async function obrisi(sifra) {
    const index = nadiIndex(sifra)
    gosti.splice(index,1)
}


export default{
    get,
    dodaj,
    getBySifra,
    promjeni,
    obrisi
}