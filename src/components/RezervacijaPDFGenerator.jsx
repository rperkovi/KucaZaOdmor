import { jsPDF } from 'jspdf';
import countryList from 'react-select-country-list'
import { izracunajCijenuLjubimaca } from '../utils'

export default function RezervacijaPDFGenerator({ rezervacija, gost, language = 'hr' }) {
    const isGerman = language === 'de';
    const locale = isGerman ? 'de-DE' : 'hr-HR';
    const text = isGerman ? {
        subtitle: 'RESERVIERUNGS- UND GÄSTEVERZEICHNIS',
        title: 'RESERVIERUNGSÜBERSICHT',
        initialData: 'Grunddaten der Reservierung:',
        reservationData: 'Reservierungsdaten:',
        guestData: 'Gästedaten:',
        reservationDate: 'Reservierungsdatum',
        guest: 'Gast',
        email: 'E-Mail',
        phone: 'Telefonnummer',
        startDate: 'Beginn der Reservierung',
        endDate: 'Ende der Reservierung',
        totalDays: 'Gesamtdauer',
        total: 'Gesamtbetrag',
        pets: 'Haustiere',
        petsTotal: 'Haustiergebühr gesamt',
        confirmed: 'Bestätigt',
        country: 'Wohnsitzland',
        yes: 'JA',
        no: 'NEIN',
        page: 'Seite',
        of: 'von',
        generated: 'Erstellt'
    } : {
        subtitle: 'EVIDENCIJA REZERVACIJA I GOSTA',
        title: 'POPIS REZERVACIJE',
        initialData: 'Početni podaci rezervacije:',
        reservationData: 'Podaci o rezervaciji:',
        guestData: 'Podaci o gostu:',
        reservationDate: 'Datum rezervacije',
        guest: 'Gost',
        email: 'E-mail',
        phone: 'Broj telefona',
        startDate: 'Datum početka rezervacije',
        endDate: 'Datum završetka rezervacije',
        totalDays: 'Ukupno dana',
        total: 'Ukupno',
        pets: 'Kućni ljubimci',
        petsTotal: 'Ukupna naknada za ljubimce',
        confirmed: 'Potvrdio',
        country: 'Država prebivališta',
        yes: 'DA',
        no: 'NE',
        page: 'Stranica',
        of: 'od',
        generated: 'Generirano'
    };

    const fetchFontAsBase64 = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
        });
    };

     function brojDana(odDatuma, doDatuma) {
        const d1 = new Date(odDatuma);
        const d2 = new Date(doDatuma);
        const razlikaUMilisekundama = Math.abs(d1 - d2);
        const milisekundiUDanu = 1000 * 60 * 60 * 24;
        return Math.round(razlikaUMilisekundama / milisekundiUDanu);
    }

    const generirajPDF = async () => {
        const [regBase64, boldBase64] = await Promise.all([
            fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
            fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
        ]);

        const doc = new jsPDF();

        // 2. Registracija REGULAR verzije
        doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');

        // 3. Registracija BOLD verzije
        // Ključno: isto ime 'Roboto', ali stil 'bold'
        doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
        doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

        // 4. Postavi defaultni font
        doc.setFont('Roboto', 'normal');
        // Dodaj logo - konvertiraj SVG u tekst (jednostavna verzija)
        doc.setFontSize(20);
        doc.setTextColor(46, 125, 50); // Zelena boja iz loga
        doc.text('KUĆA ZA ODMOR', 20, 20);

        doc.setFontSize(10);
        doc.setTextColor(102, 102, 102);
        doc.text(text.subtitle, 20, 27);

        // Naslov dokumenta
        doc.setFont('Roboto', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(text.title, 20, 45);

        // Linija ispod naslova
        doc.setDrawColor(46, 125, 50);
        doc.setLineWidth(0.5);
        doc.line(20, 48, 190, 48);

        let yPosition = 60;

        // Podaci o grupi
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(text.initialData, 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`${text.reservationDate}: ${new Date(rezervacija.datumRezervacije).toLocaleDateString(locale)}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.guest}: ${gost.ime} ${gost.prezime}`, 25, yPosition);
        yPosition += 15;

        // Podaci o smjeru
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(text.reservationData, 20, yPosition);
        yPosition += 10;

        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`${text.startDate}: ${new Date(rezervacija.datumPocetka).toLocaleDateString(locale)}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.endDate}: ${new Date(rezervacija.datumKraja).toLocaleDateString(locale)}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.totalDays}: ${brojDana(rezervacija.datumPocetka,rezervacija.datumKraja)}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.total}: ${rezervacija.cijena} EUR`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.pets}: ${Number(rezervacija.kucniLjubimci || 0)}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.petsTotal}: ${izracunajCijenuLjubimaca(rezervacija.kucniLjubimci, rezervacija.datumPocetka, rezervacija.datumKraja)} EUR`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.confirmed}: ${rezervacija.platio ? text.yes : text.no}`, 25, yPosition);
        yPosition += 15;

        // Popis gosta
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(text.guestData, 20, yPosition);
        yPosition += 10;
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`${text.guest}: ${gost.ime} ${gost.prezime}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.email}: ${gost.email || '-'}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.phone}: ${gost.telefon || '-'}`, 25, yPosition);
        yPosition += 7;
        doc.text(`${text.country}: ${countryList().getData().find(e=>e.value==gost.drzava).label}`, 25, yPosition);
        yPosition += 7;
        

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `${text.page} ${i} ${text.of} ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                `${text.generated}: ${new Date().toLocaleString(locale)}`,
                20,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // Otvori PDF u novom prozoru
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    return generirajPDF;
}
