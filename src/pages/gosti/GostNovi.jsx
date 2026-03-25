import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../constants";
import GostService from "../../services/gosti/GostService";

export default function GostiNovi(){

    const navigate = useNavigate()

    async function dodaj(gost){
        //console.table(smjer) // ovo je za kontrolu da li je sve OK
        await GostService.dodaj(gost).then(()=>{
            navigate(RouteNames.GOSTI)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        dodaj({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            cijena: parseFloat(podaci.get('cijena')),
            datumRezervacije: new Date().toISOString(),
            datumPocetka: new Date(podaci.get('datumPocetka')).toISOString(),
            datumKraja: new Date(podaci.get('datumKraja')).toISOString(),
            aktivan: podaci.get('aktivan') === 'on',
            platio: podaci.get('platio') === 'on'
        })
    }

    return(
        <>
        <h3>
            Unos novog gosta
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="ime">
                <Form.Label>Ime</Form.Label>
                <Form.Control type="text" name="ime" required />
            </Form.Group>

            <Form.Group controlId="prezime">
                <Form.Label>Prezime</Form.Label>
                <Form.Control type="text" name="prezime" required />
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" step={0.01} />
            </Form.Group>

            <Form.Group controlId="datumPocetka">
                <Form.Label>Rezervirano od</Form.Label>
                <Form.Control type="date" name="datumPocetka" />
            </Form.Group>

            <Form.Group controlId="datumKraja">
                <Form.Label>Rezervirano do</Form.Label>
                <Form.Control type="date" name="datumKraja" />
            </Form.Group>

            <Form.Group controlId="aktivan">
                <Form.Check label="Aktivan" name="aktivan" />
            </Form.Group>

             <Form.Group controlId="platio">
                <Form.Check label="Platio" name="platio" />
            </Form.Group>


            <hr style={{marginTop: '50px', border: '0'}} />

            <Row>
                <Col>
                    <Link to={RouteNames.GOSTI} className="btn btn-danger">
                    Odustani
                    </Link>
                </Col>
                <Col>
                    <Button type="submit" variant="success">
                        Dodaj novog gosta
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}