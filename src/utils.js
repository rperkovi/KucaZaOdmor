export function izracunajUkupnuCijenu(start, end, priceList) {
    let ukupno = 0;
    const trenutni = new Date(start);
    trenutni.setHours(0, 0, 0, 0);
    const krajnji = new Date(end);
    krajnji.setHours(0, 0, 0, 0);

    while (trenutni < krajnji) {
        const odgovarajucaCijena = priceList.find((p) => {
            const od = new Date(p.datumPocetka);
            const doo = new Date(p.datumKraja);
            return trenutni >= od && trenutni <= doo;
        });

        if (odgovarajucaCijena) {
            if (odgovarajucaCijena.popust > 0) {
                ukupno += odgovarajucaCijena.cijena * (odgovarajucaCijena.popust / 100);
            } else {
                ukupno += odgovarajucaCijena.cijena;
            }
        }

        trenutni.setDate(trenutni.getDate() + 1);
    }

    return ukupno;
}

function pocetakDana(datum) {
    const rezultat = new Date(datum);
    rezultat.setHours(0, 0, 0, 0);
    return rezultat;
}

export function rezervacijaPreklapaRaspon(rezervacije, start, end, izuzmiSifru) {
    if (!start || !end) {
        return false;
    }

    const pocetak = pocetakDana(start);
    const kraj = pocetakDana(end);

    return rezervacije.some((rezervacija) => {
        if (izuzmiSifru != null && String(rezervacija.sifra) === String(izuzmiSifru)) {
            return false;
        }

        const postojeciPocetak = pocetakDana(rezervacija.datumPocetka);
        const postojeciKraj = pocetakDana(rezervacija.datumKraja);
        return pocetak < postojeciKraj && kraj > postojeciPocetak;
    });
}

export function datumJeRezerviran(rezervacije, datum, izuzmiSifru) {
    const dan = pocetakDana(datum);
    return rezervacije.some((rezervacija) => {
        if (izuzmiSifru != null && String(rezervacija.sifra) === String(izuzmiSifru)) {
            return false;
        }

        return dan >= pocetakDana(rezervacija.datumPocetka)
            && dan < pocetakDana(rezervacija.datumKraja);
    });
}

export function izracunajCijenuLjubimaca(brojLjubimaca, start, end) {
    if (!brojLjubimaca || !start || !end) {
        return 0;
    }

    const brojDana = Math.round(
        Math.abs(new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
    );
    return Number(brojLjubimaca) * 10 * brojDana;
}
