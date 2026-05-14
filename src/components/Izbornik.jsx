import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { DATA_SOURCE, IME_APLIKACIJE, RouteNames } from "../constants";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";


export default function Izbornik() {

    const navigate = useNavigate()
    const { isLoggedIn, logout, authUser } = useAuth()


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


                                    <NavDropdown.Divider />

                                    {authUser.uloga === 'admin' && (<>
                                        <NavDropdown.Item
                                            onClick={() => navigate(RouteNames.OPERATERI)}
                                        >Operateri</NavDropdown.Item>
                                        <NavDropdown.Item
                                            onClick={() => navigate(RouteNames.GENERIRANJE_PODATAKA)}
                                        >Generiranje podataka</NavDropdown.Item>

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