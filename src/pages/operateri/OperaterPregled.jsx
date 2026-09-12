import { useEffect, useState } from "react"
import OperaterService from "../../services/operateri/OperaterService"
import { Table, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { IME_APLIKACIJE, RouteNames } from "../../constants"
import { FaEdit, FaTrash, FaKey } from "react-icons/fa"
import { prebaciPodatke } from "../../services/PrebaciPodatke"
import { DATA_SOURCE } from "../../constants"

export default function OperaterPregled() {

    const navigate = useNavigate()
    const [operateri, setOperateri] = useState([])
    const [izvorPodataka, setIzvorPodataka] = useState(DATA_SOURCE)
    const [odredistePodataka, setOdredistePodataka] = useState('localStorage')
    const [prebacivanje, setPrebacivanje] = useState(false)

    useEffect(()=>{document.title='Operateri, ' + IME_APLIKACIJE})

    useEffect(() => {
        ucitajOperatere()
    }, [])

    async function ucitajOperatere() {
        await OperaterService.get().then((odgovor) => {
            if (!odgovor.success) {
                alert('Nije implementiran servis')
                return
            }
            setOperateri(odgovor.data)
        })
    }

    async function brisanje(sifra) {
        if (!confirm('Sigurno obrisati operatera?')) return
        
        const rezultat = await OperaterService.obrisi(sifra)
        if (rezultat.success) {
            ucitajOperatere()
        } else {
            alert(rezultat.message || 'Greška pri brisanju')
        }

    }

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

    function promijeniIzvorPodataka(e) {
        const noviIzvor = e.target.value
        setIzvorPodataka(noviIzvor)
    }

    return (
        <>
            <Link to={RouteNames.OPERATERI_NOVI}
                className="btn btn-success w-100 my-3">
                Dodavanje novog operatera
            </Link>
            <div className="row g-3 align-items-end mb-3">
                <div className="col-md-5">
                    <label htmlFor="izvorPodataka" className="form-label fw-bold">Trenutni izvor podataka</label>
                    <select id="izvorPodataka" className="form-select" value={izvorPodataka} onChange={promijeniIzvorPodataka}>
                        <option value="memorija">Memorija</option>
                        <option value="localStorage">Local Storage</option>
                        <option value="firebase">Firebase</option>
                    </select>
                </div>
                <div className="col-md-2 text-center">
                    <Button variant="outline-secondary" className="w-100" onClick={pokreniPrebacivanje} disabled={prebacivanje}>
                        {prebacivanje ? 'Prebacivanje...' : 'Prebaci podatke'}
                    </Button>
                </div>
                <div className="col-md-5">
                    <label htmlFor="odredistePodataka" className="form-label fw-bold">Odredište podataka</label>
                    <select id="odredistePodataka" className="form-select" value={odredistePodataka} onChange={(e) => setOdredistePodataka(e.target.value)}>
                        <option value="memorija">Memorija</option>
                        <option value="localStorage">Local Storage</option>
                        <option value="firebase">Firebase</option>
                    </select>
                </div>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Uloga</th>
                        <th className="text-center" style={{width: '200px'}}>Akcije</th>
                    </tr>
                </thead>
                <tbody>
                    {operateri && operateri.map((operater) => (
                        <tr key={operater.sifra}>
                            <td>{operater.email}</td>
                            <td>
                                <span className={`badge ${operater.uloga === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                    {operater.uloga}
                                </span>
                            </td>
                            <td className="text-center">
                                <div className="d-flex gap-2 justify-content-center">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => navigate(`/operateri/${operater.sifra}`)}
                                        title="Promjeni email"
                                    >
                                        <FaEdit />
                                    </Button>
                                    <Button
                                        variant="outline-warning"
                                        size="sm"
                                        onClick={() => navigate(`/operateri/${operater.sifra}/lozinka`)}
                                        title="Promjeni lozinku"
                                    >
                                        <FaKey />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => brisanje(operater.sifra)}
                                        title="Obriši"
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
