import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from "../constants";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { FaHome } from "react-icons/fa";


export default function Izbornik() {

    const navigate = useNavigate()
    const location = useLocation()
    const { isLoggedIn, logout, authUser } = useAuth()
    const [izvorPodataka, setIzvorPodataka] = useState(DATA_SOURCE)
    const trenutnaLokacija = location.pathname === RouteNames.HOME
        ? 'Početna'
        : location.pathname.startsWith('/rezervacije')
            ? 'Rezervacije'
            : location.pathname.startsWith('/gosti')
                ? 'Gosti'
                : location.pathname.startsWith('/cijene')
                    ? 'Cjenik'
                    : location.pathname.startsWith('/operateri')
                        ? 'Operateri'
                        : location.pathname.startsWith('/nadzorna-ploca')
                            ? 'Nadzorna ploča'
                            : ''

    function promijeniIzvorPodataka(event) {
        const noviIzvor = event.target.value
        localStorage.setItem('dataSource', noviIzvor)
        setIzvorPodataka(noviIzvor)
        window.location.reload()
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">{IME_APLIKACIJE}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => navigate(RouteNames.HOME)}
                        >Početna</Nav.Link>

                        {isLoggedIn && (
                            <>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.NADZORNA_PLOCA)}
                                >Nadzorna ploča</Nav.Link>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.HOME)}
                                    title={`Trenutno se nalazimo: ${trenutnaLokacija}`}
                                    aria-label={`Trenutno se nalazimo: ${trenutnaLokacija}`}
                                >
                                    <FaHome />
                                </Nav.Link>
                                <NavDropdown title="Programi" id="basic-nav-dropdown">

                                    {authUser.uloga === 'admin' && (<>
                                        <NavDropdown.Item
                                            onClick={() => navigate(RouteNames.CIJENE)}
                                        >Cjenik</NavDropdown.Item>
                                        <NavDropdown.Item
                                            onClick={() => navigate(RouteNames.GOSTI)}
                                        >Gosti</NavDropdown.Item>

                                    </>)}






                                    <NavDropdown.Item
                                        onClick={() => navigate(RouteNames.REZERVACIJE)}
                                    >Rezervacije</NavDropdown.Item>
                                    <NavDropdown.Item as="div">
                                        <label htmlFor="izvorPodatakaIzbornik" className="form-label mb-1">
                                            Trenutni izvor podataka
                                        </label>
                                        <select
                                            id="izvorPodatakaIzbornik"
                                            className="form-select"
                                            value={izvorPodataka}
                                            onChange={promijeniIzvorPodataka}
                                        >
                                            <option value="memorija">memorija</option>
                                            <option value="localStorage">localStorage</option>
                                            <option value="firebase">firebase</option>
                                        </select>
                                    </NavDropdown.Item>


                                    <NavDropdown.Divider />

                                    {authUser.uloga === 'admin' && (<>
                                        <NavDropdown.Item
                                            onClick={() => navigate(RouteNames.OPERATERI)}
                                        >Operateri</NavDropdown.Item>

                                    </>)}


                                </NavDropdown>
                            </>)}
                    </Nav>
                    <Nav className="ms-auto">
                        <div className="btn-group">

                            {isLoggedIn ? (
                                <Button
                                    className="me-2"
                                    onClick={() => logout()}
                                >Logout {authUser.email}</Button>
                            ) : (
                                <>
                                    <Button
                                        className="me-2"
                                        onClick={() => navigate(RouteNames.REGISTRACIJA)}
                                    >Registracija</Button>
                                    <Button
                                        onClick={() => navigate(RouteNames.LOGIN)}
                                    >Login</Button>
                                </>)}
                        </div>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}