import { Button, Card, Form } from 'react-bootstrap'
import { DATA_SOURCE } from '../constants'
import { useState } from 'react'
import { prebaciPodatke } from '../services/PrebaciPodatke'

export default function NadzornaPloca() {
    const [izvorPodataka, setIzvorPodataka] = useState(DATA_SOURCE)
    const [odredistePodataka, setOdredistePodataka] = useState('localStorage')
    const [prebacivanje, setPrebacivanje] = useState(false)

    async function pokreniPrebacivanje() {
        if (izvorPodataka === odredistePodataka) {
            alert('Izvor i odredište moraju biti različiti.')
            return
        }

        if (!confirm(`Prebaciti sve podatke iz ${izvorPodataka} u ${odredistePodataka}?`)) {
            return
        }

        setPrebacivanje(true)
        try {
            await prebaciPodatke(izvorPodataka, odredistePodataka)
            localStorage.setItem('dataSource', odredistePodataka)
            window.location.reload()
        } catch (error) {
            alert(`Prijenos nije uspio: ${error.message}`)
        } finally {
            setPrebacivanje(false)
        }
    }

    return (
        <Card className="mt-4">
            <Card.Body>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title>
                            Trenutni izvor podataka: <strong>{izvorPodataka}</strong>
                        </Card.Title>
                    </Card.Body>
                </Card>
                <div className="row g-3 align-items-end mt-1">
                    <div className="col-md-5 border-start border-2 ps-md-4">
                        <Form.Label htmlFor="izvorPodatakaNadzornaPloca" className="fw-bold">
                            Prebaci sa
                        </Form.Label>
                        <Form.Select
                            id="izvorPodatakaNadzornaPloca"
                            value={izvorPodataka}
                            onChange={(event) => setIzvorPodataka(event.target.value)}
                        >
                            <option value="memorija">memorija</option>
                            <option value="localStorage">localStorage</option>
                            <option value="firebase">firebase</option>
                        </Form.Select>
                    </div>
                    <div className="col-md-2">
                        <Button
                            variant="outline-secondary"
                            className="w-100"
                            onClick={pokreniPrebacivanje}
                            disabled={prebacivanje}
                        >
                            {prebacivanje ? 'Prebacivanje...' : 'Prebaci podatke'}
                        </Button>
                    </div>
                    <div className="col-md-5">
                        <Form.Label htmlFor="odredistePodatakaNadzornaPloca" className="fw-bold">
                            Odredište podataka
                        </Form.Label>
                        <Form.Select
                            id="odredistePodatakaNadzornaPloca"
                            value={odredistePodataka}
                            onChange={(event) => setOdredistePodataka(event.target.value)}
                        >
                            <option value="localStorage">localStorage</option>
                            <option value="memorija">memorija</option>
                            <option value="firebase">firebase</option>
                        </Form.Select>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}
