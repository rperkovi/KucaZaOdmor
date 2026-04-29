export function izracunajUkupnuCijenu(start, end, priceList) {
        let ukupno = 0;

        // Kopiramo početni datum kako ne bismo mijenjali originalni objekt
        let trenutni = new Date(start);
        // Postavljamo na ponoć radi precizne usporedbe
        trenutni.setHours(0, 0, 0, 0);

        const krajnji = new Date(end);
        krajnji.setHours(0, 0, 0, 0);

        // Iteriramo kroz svaki dan u rasponu (uključujući zadnji dan)
        while (trenutni < krajnji) {

            // Pronađi cjenik koji odgovara trenutnom datumu
            const odgovarajucaCijena = priceList.find(p => {
                const od = new Date(p.datumPocetka);
                const doo = new Date(p.datumKraja);
                return trenutni >= od && trenutni <= doo;
            });

            if (odgovarajucaCijena) {
                
                if(odgovarajucaCijena.popust>0){
                    ukupno += (odgovarajucaCijena.cijena *  (odgovarajucaCijena.popust/100));
                }else{
                    ukupno += odgovarajucaCijena.cijena;
                }
                
            }

            // Pomakni se na sljedeći dan
            trenutni.setDate(trenutni.getDate() + 1);
        }

        return ukupno;
    }
