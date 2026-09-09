import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import getFirebaseDB from "../Firebase";

const COLLECTION = "operateri";

function bezLozinke(id, data) {
    return { sifra: id, email: data.email, uloga: data.uloga };
}

async function get() {
    const snapshot = await getDocs(collection(getFirebaseDB(), COLLECTION));
    return { success: true, data: snapshot.docs.map(document => bezLozinke(document.id, document.data())) };
}

async function getBySifra(sifra) {
    const snapshot = await getDoc(doc(getFirebaseDB(), COLLECTION, String(sifra)));
    return snapshot.exists()
        ? { success: true, data: bezLozinke(snapshot.id, snapshot.data()) }
        : { success: false, data: null, message: "Operater nije pronađen" };
}

async function dodaj(operater) {
    const document = await addDoc(collection(getFirebaseDB(), COLLECTION), {
        email: operater.email,
        uloga: operater.uloga,
        lozinka: bcrypt.hashSync(operater.lozinka, 10)
    });
    return { success: true, data: { sifra: document.id, email: operater.email, uloga: operater.uloga } };
}

async function promjeni(sifra, operater) {
    await updateDoc(doc(getFirebaseDB(), COLLECTION, String(sifra)), {
        email: operater.email,
        uloga: operater.uloga
    });
    return { success: true };
}

async function promjeniLozinku(sifra, novaLozinka) {
    await updateDoc(doc(getFirebaseDB(), COLLECTION, String(sifra)), {
        lozinka: bcrypt.hashSync(novaLozinka, 10)
    });
    return { success: true, message: "Lozinka uspješno promijenjena" };
}

async function obrisi(sifra) {
    await deleteDoc(doc(getFirebaseDB(), COLLECTION, String(sifra)));
    return { success: true, message: "Operater obrisan" };
}

async function prijava(email, lozinka) {
    const snapshot = await getDocs(query(
        collection(getFirebaseDB(), COLLECTION),
        where("email", "==", email),
        limit(1)
    ));
    const document = snapshot.docs[0];

    if (!document || !bcrypt.compareSync(lozinka, document.data().lozinka)) {
        return { success: false, message: "Email i lozinka ne odgovaraju" };
    }

    return { success: true, data: bezLozinke(document.id, document.data()) };
}

export default {
    get,
    getBySifra,
    dodaj,
    promjeni,
    promjeniLozinku,
    obrisi,
    prijava
};
