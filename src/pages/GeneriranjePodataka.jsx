import { IME_APLIKACIJE } from "../constants";
import mojaSlika from '../assets/slika.jpg'
import { Faker, hr } from "@faker-js/faker";
import { useEffect, useState } from "react";
import GostService from "../services/gosti/GostService";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";
import RezervacijaService from "../services/rezervacije/RezervacijaService";
import { cijene } from "../services/cijene/CijenaPodaci";
import { gosti } from "../services/gosti/GostPodaci";
import { rezervacije } from "../services/rezervacije/RezervacijaPodaci";

export default function GeneriranejPodataka() {

    const [brojGostiju, setBrojGostiju] = useState(5);
    const [brojRezervacija, setBrojRezervacija] = useState(10);



    const [poruka, setPoruka] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { document.title = 'Generiranje podataka, ' + IME_APLIKACIJE })

    // Postavi faker na hrvatski jezik
    const faker = new Faker({
        locale: [hr]
    });

    const generirajGoste = async (broj) => {
        const gosti = [];
        for (let i = 0; i < broj; i++) {
            const rezultat = await GostService.dodaj({
                ime: faker.person.firstName(),
                prezime: faker.person.lastName(),
                email: faker.internet.email(),
                aktivan: faker.datatype.boolean()
            });
            gosti.push(rezultat.data);
        }
        return gosti;
    };

    const handleGenerirajGoste = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            const gosti = await generirajGoste(brojGostiju);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojGostiju} gostiju!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju gosti: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };



    const handleObrisiGoste = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve goste?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await GostService.get();
            const gosti = rezultat.data;

            for (const gost of gosti) {
                await GostService.obrisi(gost.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${gosti.length} gostiju!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju gostiju: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };







    const generirajRezervacije = async (broj) => {

        const gosti = await GostService.get()
        const gostiData = gosti.data

        const rezervacije = [];
        for (let i = 0; i < broj; i++) {
            // 1. Generiraj nasumičan datum početka (npr. u idućih 30 dana)
            const pocetak = faker.date.soon({ days: 30 });

            // 2. Definiraj trajanje (između 2 i 5 dana)
            const trajanjeUDanima = faker.number.int({ min: 2, max: 5 });

            // 3. Izračunaj datum kraja dodavanjem dana na početni datum
            const kraj = new Date(pocetak);
            kraj.setDate(pocetak.getDate() + trajanjeUDanima);

            const rezultat = await RezervacijaService.dodaj({
                gost: gostiData[faker.number.int({ min: 0, max: gostiData.length - 1 })].sifra,
                datumRezervacije: faker.date.past().toISOString().split('T')[0],
                // Slanje u ISO formatu (ili samo datum ovisno o tvom backendu)
                datumPocetka: pocetak.toISOString(),
                datumKraja: kraj.toISOString(),
                cijena: 100 // prvo napraviti generiranje cjenika
            });

            rezervacije.push(rezultat.data);
        }
        return rezervacije;
    };

    const handleGenerirajRezervacije = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPoruka(null);

        try {
            const gosti = await generirajRezervacije(brojRezervacija);

            setPoruka({
                tip: 'success',
                tekst: `Uspješno generirano ${brojRezervacija} rez.!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri generiranju rez.: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };


    const handleObrisiRezervacije = async () => {
        if (!window.confirm('Jeste li sigurni da želite obrisati sve rezervacije?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {
            const rezultat = await RezervacijaService.get();
            const rezervacije = rezultat.data;

            for (const rezervacija of rezervacije) {
                await RezervacijaService.obrisi(rezervacija.sifra);
            }

            setPoruka({
                tip: 'success',
                tekst: `Uspješno obrisano ${rezervacije.length} rezervacije!`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri brisanju rezervacije: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    };

    function handlePresipavanjePodatakaMemorijaULocalStorage(){
         if (!window.confirm('Jeste li sigurni da želite pretočiti iz memorije u localStorage?')) {
            return;
        }

        setLoading(true);
        setPoruka(null);

        try {

            localStorage.setItem('cijene', JSON.stringify(cijene));
            localStorage.setItem('gosti', JSON.stringify(gosti));
            localStorage.setItem('rezervacije', JSON.stringify(rezervacije));

            setPoruka({
                tip: 'success',
                tekst: `Uspješno presipano`
            });
        } catch (error) {
            setPoruka({
                tip: 'danger',
                tekst: 'Greška pri presipavanju memorija - localStorage: ' + error.message
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container className="mt-4">
            <h1>Generiranje podataka</h1>
            <p className="text-muted">
                Koristite ovaj alat za generiranje testnih podataka s lažnim (fake) podacima na hrvatskom jeziku.
            </p>

            {poruka && (
                <Alert variant={poruka.tip} dismissible onClose={() => setPoruka(null)}>
                    {poruka.tekst}
                </Alert>
            )}

            <Row>
                {/* Ovdje prije gostiju staviti sučelje za generiranje cijena */}
                {/*<Col md={4}>
                    <Form onSubmit={handleGenerirajCijene}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj razlicitih cijena</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="5"
                                value={brojCijena}
                                onChange={(e) => setBrojCijena(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj razlicitih cijena u cjenku
                            </Form.Text>
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj cijene'}
                        </Button>
                    </Form>
                </Col>*/}
                <Col md={4}>
                    <Form onSubmit={handleGenerirajGoste}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj gostiju</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojGostiju}
                                onChange={(e) => setBrojGostiju(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj gostiju
                            </Form.Text>
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj goste'}
                        </Button>
                    </Form>
                </Col>
                <Col md={4}>
                    <Form onSubmit={handleGenerirajRezervacije}>
                        <Form.Group className="mb-3">
                            <Form.Label>Broj rezervacija</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max="50"
                                value={brojRezervacija}
                                onChange={(e) => setBrojRezervacija(parseInt(e.target.value))}
                                disabled={loading}
                            />
                            <Form.Text className="text-muted">
                                Unesite broj rezervacija
                            </Form.Text>
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-100"
                        >
                            {loading ? 'Generiranje...' : 'Generiraj rezervacije'}
                        </Button>
                    </Form>
                </Col>

                <Col md={4}>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            className="w-100"
                            onClick={handlePresipavanjePodatakaMemorijaULocalStorage}
                        >
                            {loading ? 'Presipavanje...' : 'Presipaj iz memorije u localStorage'}
                        </Button>
                </Col>


            </Row>
            <Alert variant="warning" className="mt-3">
                <strong>Upozorenje:</strong> Ove akcije će dodati nove podatke u postojeće.
                Ako želite početi ispočetka, prvo obrišite postojeće podatke.
            </Alert>

            <hr className="my-4" />

            <h3>Brisanje podataka</h3>
            <p className="text-muted">
                Koristite ove opcije za brisanje svih podataka iz baze.
            </p>

            <Row className="mt-3">
                <Col md={4}>
                    <Button
                        variant="danger"
                        onClick={handleObrisiGoste}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši goste'}
                    </Button>
                </Col>

                <Col md={4}>
                    <Button
                        variant="danger"
                        onClick={handleObrisiRezervacije}
                        disabled={loading}
                        className="w-100 mb-2"
                    >
                        {loading ? 'Brisanje...' : 'Obriši rezervacije'}
                    </Button>
                </Col>


            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>


        </Container>
    )
}

