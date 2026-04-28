import { IME_APLIKACIJE } from "../constants";
import mojaSlika from '../assets/slika.jpg'
import { Faker, hr } from "@faker-js/faker";
import { useEffect, useState } from "react";
import GostService from "../services/gosti/GostService";
import { Alert, Button, Col, Container, Form, Row } from "react-bootstrap";

export default function GeneriranejPodataka() {

    const [brojGostiju, setBrojGostiju] = useState(5);


    
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
            const smjerovi = await generirajGoste(brojGostiju);

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
                        {loading ? 'Brisanje...' : 'Obriši svih gostiju'}
                    </Button>
                </Col>
                
                
            </Row>

            <Alert variant="danger" className="mt-3">
                <strong>Oprez!</strong> Brisanje podataka je trajna akcija i ne može se poništiti.
            </Alert>

            
        </Container>
    )
}

