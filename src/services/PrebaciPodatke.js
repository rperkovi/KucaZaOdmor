import { deleteDoc, doc, getDocs, collection, setDoc } from "firebase/firestore"
import getFirebaseDB from "./Firebase"
import { cijene as memorijskeCijene } from "./cijene/CijenaPodaci"
import { gosti as memorijskiGosti } from "./gosti/GostPodaci"
import { operateri as memorijskiOperateri } from "./operateri/OperaterPodaci"
import { rezervacije as memorijskeRezervacije } from "./rezervacije/RezervacijaPodaci"

const kolekcije = {
    gosti: memorijskiGosti,
    rezervacije: memorijskeRezervacije,
    cijene: memorijskeCijene,
    operateri: memorijskiOperateri
}

async function procitajIzvor(izvor, naziv) {
    if (izvor === 'memorija') {
        return [...kolekcije[naziv]]
    }

    if (izvor === 'localStorage') {
        const zapis = localStorage.getItem(naziv)
        return zapis ? JSON.parse(zapis) : []
    }

    const snapshot = await getDocs(collection(getFirebaseDB(), naziv))
    return snapshot.docs.map((zapis) => ({ sifra: zapis.data().sifra ?? zapis.id, ...zapis.data() }))
}

async function upisiUOdrediste(odrediste, naziv, podaci) {
    if (odrediste === 'memorija') {
        kolekcije[naziv].splice(0, kolekcije[naziv].length, ...podaci)
        return
    }

    if (odrediste === 'localStorage') {
        localStorage.setItem(naziv, JSON.stringify(podaci))
        return
    }

    const db = getFirebaseDB()
    const referenca = collection(db, naziv)
    const postojece = await getDocs(referenca)
    await Promise.all(postojece.docs.map((zapis) => deleteDoc(doc(db, naziv, zapis.id))))
    await Promise.all(podaci.map((podatak) => {
        const id = String(podatak.sifra)
        return setDoc(doc(db, naziv, id), podatak)
    }))
}

export async function prebaciPodatke(izvor, odrediste) {
    if (izvor === odrediste) {
        throw new Error('Izvor i odredište moraju biti različiti.')
    }

    for (const naziv of Object.keys(kolekcije)) {
        const podaci = await procitajIzvor(izvor, naziv)
        await upisiUOdrediste(odrediste, naziv, podaci)
    }
}
