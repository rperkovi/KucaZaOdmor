import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import { FaCalendarAlt, FaHome } from "react-icons/fa";


export default function Izbornik() {

    const navigate = useNavigate()
    const { isLoggedIn, logout, authUser } = useAuth()
    const [izvorPodataka, setIzvorPodataka] = useState(DATA_SOURCE)

    function promijeniIzvorPodataka(event) {
        const noviIzvor = event.target.value
        localStorage.setItem('dataSource', noviIzvor)
        setIzvorPodataka(noviIzvor)
        window.location.reload()
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand
                    onClick={() => navigate(RouteNames.HOME)}
                    role="button"
                    tabIndex={0}
                    aria-label="Početna"
                    style={{ cursor: 'pointer' }}
                >
                    {IME_APLIKACIJE}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => navigate(RouteNames.HOME)}
                            title="Početna"
                            aria-label="Početna"
                        >
                            <FaHome />
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => navigate(RouteNames.KALENDAR)}
                            title="Kalendar rezervacija"
                            aria-label="Otvori kalendar rezervacija"
                        >
                            <FaCalendarAlt />
                        </Nav.Link>

                        {isLoggedIn && (
                            <>
                                <Nav.Link
                                    onClick={() => navigate(RouteNames.NADZORNA_PLOCA)}
                                >Nadzorna ploča</Nav.Link>
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