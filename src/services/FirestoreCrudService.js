import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import getFirebaseDB from "./Firebase";

export function createFirestoreCrudService(collectionName) {
    async function get() {
        const snapshot = await getDocs(collection(getFirebaseDB(), collectionName));
        return {
            success: true,
            data: snapshot.docs.map(document => ({ sifra: document.data().sifra ?? document.id, ...document.data() }))
        };
    }

    async function getBySifra(sifra) {
        const numericSifra = Number(sifra);
        const collectionRef = collection(getFirebaseDB(), collectionName);
        const snapshot = await getDocs(query(collectionRef, where("sifra", "==", Number.isNaN(numericSifra) ? sifra : numericSifra)));
        const document = snapshot.docs[0];

        if (!document) {
            return { success: false, data: null, message: "Zapis nije pronađen" };
        }

        return { success: true, data: { sifra: document.data().sifra ?? document.id, ...document.data() } };
    }

    async function dodaj(data) {
        const snapshot = await getDocs(collection(getFirebaseDB(), collectionName));
        const sifre = snapshot.docs
            .map(document => Number(document.data().sifra))
            .filter(Number.isFinite);
        const noviZapis = { ...data, sifra: sifre.length > 0 ? Math.max(...sifre) + 1 : 1 };
        const document = await addDoc(collection(getFirebaseDB(), collectionName), noviZapis);
        return { success: true, data: { ...noviZapis, firebaseId: document.id } };
    }

    async function promjeni(sifra, data) {
        const numericSifra = Number(sifra);
        const collectionRef = collection(getFirebaseDB(), collectionName);
        const snapshot = await getDocs(query(collectionRef, where("sifra", "==", Number.isNaN(numericSifra) ? sifra : numericSifra)));
        const document = snapshot.docs[0];

        if (!document) {
            return { success: false, message: "Zapis nije pronađen" };
        }

        await updateDoc(doc(getFirebaseDB(), collectionName, document.id), data);
        return { success: true, data: { sifra: document.data().sifra ?? document.id, ...document.data(), ...data } };
    }

    async function obrisi(sifra) {
        const numericSifra = Number(sifra);
        const collectionRef = collection(getFirebaseDB(), collectionName);
        const snapshot = await getDocs(query(collectionRef, where("sifra", "==", Number.isNaN(numericSifra) ? sifra : numericSifra)));
        const document = snapshot.docs[0];

        if (!document) {
            return { success: false, message: "Zapis nije pronađen" };
        }

        await deleteDoc(doc(getFirebaseDB(), collectionName, document.id));
        return { success: true, message: "Zapis obrisan" };
    }

    return { get, getBySifra, dodaj, promjeni, obrisi };
}
