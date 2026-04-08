import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import { useEffect, useState } from "react";
import RezervacijaService from "../../services/rezervacije/RezervacijaService";

export default function GostPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [rezervacija,setRezervacija] = useState({})
    const [aktivan,setAktivan] = useState(false)

    async function ucitajRezervacija() {
        await RezervacijaService.getBySifra(params.sifra).then((odgovor)=>{
             if(!odgovor.success){
                alert('Nije implementiran servis')
                return
            }

            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
            setRezervacija(s)

            setAktivan(s.aktivan)
        })
    }

    useEffect(()=>{
        ucitajRezervacija()
    },[])

    async function promjeni(rezervacija){
        //console.table(gost) // ovo je za kontrolu da li je sve OK
        await RezervacijaService.promjeni(params.sifra,rezervacija).then(()=>{
            navigate(RouteNames.REZERVACIJE)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
       
        // --- KONTROLA 1: Ime (Postojanje) ---
        if (!podaci.get('ime') || podaci.get('ime').trim().length === 0) {
            alert("Ime je obavezno i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 2: Ime (Minimalna duljina) ---
        if (podaci.get('ime').trim().length < 2) {
            alert("Ime mora imati najmanje 2 znaka!");
            return;
        }

        // --- KONTROLA 3: Prezime (Postojanje) ---
        if (!podaci.get('prezime') || podaci.get('prezime').trim().length === 0) {
            alert("Prezime je obavezno i ne smije sadržavati samo razmake!");
            return;
        }

        // --- KONTROLA 4: Prezime (Minimalna duljina) ---
        if (podaci.get('prezime').trim().length < 2) {
            alert("Prezime mora imati najmanje 2 znaka!");
            return;
        }

        // --- KONTROLA 5: Email (Postojanje) ---
        if (!podaci.get('email') || podaci.get('email').trim().length === 0) {
            alert("Email je obavezan!");
            return;
        }

        // --- KONTROLA 6: Email (Format) ---
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(podaci.get('email'))) {
            alert("Email nije u ispravnom formatu!");
            return;
        }
       
       
       
        promjeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            email: podaci.get('email'),
            aktivan: aktivan,
        })
    }

    return(
        <>
        <h3>
            Unos nove rezervacije
        </h3>
        <Form onSubmit={odradiSubmit}>
            <Form.Group controlId="ime">
                <Form.Label>Ime</Form.Label>
                <Form.Control type="text" name="ime" required 
                defaultValue={rezervacija.ime} />
            </Form.Group>

            <Form.Group controlId="prezime">
                <Form.Label>Prezime</Form.Label>
                <Form.Control type="text" name="prezime" step={1} 
                defaultValue={rezervacija.prezime}/>
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