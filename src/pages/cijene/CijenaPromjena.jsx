import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import CijenaService from "../../services/cijene/CijenaService";

export default function GostPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [cijena,setRezervacija] = useState({})
    const [aktivan,setAktivan] = useState(false)

    async function ucitajRezervacija() {
        await CijenaService.getBySifra(params.sifra).then((odgovor)=>{
             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
            setCijena(s)

            setAktivan(s.aktivan)
        })
    }

    useEffect(()=>{
        ucitajCijena()
    },[])

    async function promjeni(cijena){
        //console.table(gost) // ovo je za kontrolu da li je sve OK
        await CijenaService.promjeni(params.sifra,rezervacija).then(()=>{
            navigate(RouteNames.CIJENE)
        })
    }



       
       
       
        promjeni({
            Razdoblje: podaci.get('ime'),
            Cijena: podaci.get('prezime'),
            Popust:10%
            aktivan: aktivan,
        })
    }

    return(
        <>
        <h3>
            Unos nove Cijene
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="ime">
                <Form.Label>Ime</Form.Label>
                <Form.Control type="text" name="ime" required 
                defaultValue={rezervacija.ime} />
            </Form.Group>

            <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" required 
                    defaultValue={rezervacija.email}/>
                </Form.Group>



         

            <Form.Group controlId="aktivan">
                <Form.Check label="Aktivan" name="aktivan" 
                checked={aktivan}
                onChange={(e)=>{setAktivan(e.target.checked)}}
                />
            </Form.Group>

           
            <hr style={{marginTop: '50px', border: '0'}} />

            <Row className="mt-4">
                <Col>
                    <Link to={RouteNames.REZERVACIJE} className="btn btn-danger">
                    Odustani
                    </Link>
                </Col>
                <Col>
                    <Button type="submit" variant="success">
                       Promjeni rezervaciju
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}