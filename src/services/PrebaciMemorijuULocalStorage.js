import { cijene } from "./cijene/CijenaPodaci"
import { gosti } from "./gosti/GostPodaci"
import { operateri } from "./operateri/OperaterPodaci"
import { rezervacije } from "./rezervacije/RezervacijaPodaci"

const podaciZaPohranu = {
    gosti,
    rezervacije,
    cijene,
    operateri
}

export function prebaciMemorijuULocalStorage() {
    Object.entries(podaciZaPohranu).forEach(([kljuc, podaci]) => {
        localStorage.setItem(kljuc, JSON.stringify(podaci))
    })

    localStorage.setItem('dataSource', 'localStorage')
}
