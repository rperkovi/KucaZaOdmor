import { Button, Col, Form, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RouteNames } from "../../constants";
import GostService from "../../services/gosti/GostService";
import { useEffect, useState } from "react";

export default function GostPromjena(){

    const navigate = useNavigate()
    const params = useParams()
    const [gost,setGost] = useState({})
    const [aktivan,setAktivan] = useState(false)
    const [platio,setPlatio] = useState(false)

    async function ucitajGost() {
        await GostService.getBySifra(params.sifra).then((odgovor)=>{
            
            const s = odgovor.data
            // po potrebi prilagođavam podatke
            
          //  s.datumPokretanja = s.datumPokretanja.substring(0,10)
            
            setGost(s)

            setAktivan(s.aktivan)
            setPlatio(s.platio)
        })
    }

    useEffect(()=>{
        ucitajGost()
    },[])

    async function promjeni(gost){
        //console.table(gost) // ovo je za kontrolu da li je sve OK
        await GostService.promjeni(params.sifra,gost).then(()=>{
            navigate(RouteNames.GOSTI)
        })
    }


    function odradiSubmit(e){ //e je event
        e.preventDefault() // nemoj odraditi submit
        const podaci = new FormData(e.target)
        promjeni({
            ime: podaci.get('ime'),
            prezime: podaci.get('prezime'),
            datumRezervacije: new Date().toISOString(),
            datumPocetka: new Date(podaci.get('datumPocetka')).toISOString(),
            datumKraja: new Date(podaci.get('datumKraja')).toISOString(),
            cijena: parseFloat(podaci.get('cijena')),
            aktivan: aktivan,
            platio: platio
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
                <Form.Control type="text" name="ime" required 
                defaultValue={gost.ime} />
            </Form.Group>

            <Form.Group controlId="prezime">
                <Form.Label>Prezime</Form.Label>
                <Form.Control type="text" name="prezime" step={1} 
                defaultValue={gost.prezime}/>
            </Form.Group>



            <Form.Group controlId="datumPokretanja">
                <Form.Label>Datum</Form.Label>
                <Form.Control type="date" name="datumPokretanja" 
                defaultValue={gost.datumPokretanja}/>
            </Form.Group>

            <Form.Group controlId="cijena">
                <Form.Label>Cijena</Form.Label>
                <Form.Control type="number" name="cijena" step={0.01} 
                defaultValue={gost.cijena}/>

            <Form.Group controlId="aktivan">
                <Form.Check label="Aktivan" name="aktivan" 
                checked={aktivan}
                onChange={(e)=>{setAktivan(e.target.checked)}}
                />
            </Form.Group>

             <Form.Group controlId="platio">
                <Form.Check label="Platio" name="platio" 
                checked={platio}
                onChange={(e)=>{setPlatio(e.target.checked)}}
                />
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
                       Promjeni gost
                    </Button>
                </Col>
            </Row>

        </Form>
        </>
    )
}