import { gosti } from "./GostPodaci";


async function get() {
    return {data: gosti}
}

async function dodaj(gost){
    if(gosti.length>0){
        gost.sifra = gosti[gosti.length - 1].sifra + 1
    }else{
        gost.sifra = 1
    }
    
    gosti.push(gost);
}


export default{
    get,
    dodaj
}