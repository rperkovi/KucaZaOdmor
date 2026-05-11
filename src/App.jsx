import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Home from './pages/Home'
import GostPregled from './pages/gosti/GostPregled'
import GostNovi from './pages/gosti/GostNovi'
import GostPromjena from './pages/gosti/GostPromjena'
import RezervacijaPregled from './pages/rezervacije/RezervacijaPregled'
import RezervacijaNovi from './pages/rezervacije/RezervacijaNovi'
import CijenaPregled from './pages/cijene/CijenaPregled'
import CijenaNovi from './pages/cijene/CijenaNovi'
import CijenaPromjena from './pages/cijene/CijenaPromjena'
import RezervacijePromjena from './pages/rezervacije/RezervacijaPromjena'
import GeneriranjePodataka from './pages/GeneriranjePodataka'
import OperaterPregled from './pages/operateri/OperaterPregled'
import OperaterNovi from './pages/operateri/OperaterNovi'
import OperaterPromjena from './pages/operateri/OperaterPromjena'
import OperaterPromjenaLozinke from './pages/operateri/OperaterPromjenaLozinke'
import useAuth from './hooks/useAuth'
import Login from './pages/login/Login'
import Registracija from './pages/registracija/Registracija'
import NadzornaPloca from './pages/NadzornaPloca'

function App() {

  const { isLoggedIn, authUser } = useAuth()

  return (
    <>
      <Container>
        <Izbornik />
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />

          {isLoggedIn ? (<>
          
          <Route path={RouteNames.GOSTI} element={<GostPregled />} />
          <Route path={RouteNames.GOSTI_NOVI} element={<GostNovi />} />
          <Route path={RouteNames.GOSTI_PROMJENA} element={<GostPromjena />} />

          <Route path={RouteNames.REZERVACIJE} element={<RezervacijaPregled />} />
          <Route path={RouteNames.REZERVACIJE_NOVI} element={<RezervacijaNovi />} />
          <Route path={RouteNames.REZERVACIJE_PROMJENA} element={<RezervacijePromjena />} />

          <Route path={RouteNames.CIJENE} element={<CijenaPregled />} />
          <Route path={RouteNames.CIJENE_NOVI} element={<CijenaNovi />} />
          <Route path={RouteNames.CIJENE_PROMJENA} element={<CijenaPromjena />} />

          <Route path={RouteNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />


             {authUser.uloga === 'admin' && (
                  <>
                    <Route path={RouteNames.OPERATERI} element={<OperaterPregled />} />
                    <Route path={RouteNames.OPERATERI_NOVI} element={<OperaterNovi />} />
                    <Route path={RouteNames.OPERATERI_PROMJENA} element={<OperaterPromjena />} />
                    <Route path={RouteNames.OPERATERI_PROMJENA_LOZINKE} element={<OperaterPromjenaLozinke />} />
                    <Route path={RouteNames.GENERIRANJE_PODATAKA} element={<GeneriranjePodataka />} />
                  </>
                )}

          </>) : (
              <>
                <Route path={RouteNames.LOGIN} element={<Login />} />
                <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
              </>)}
        </Routes>
        <hr />
        &copy; Roberto
      </Container>
    </>
  )
}

export default App
