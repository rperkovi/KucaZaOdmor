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

function App() {

  return (
    <>
      <Container>
        <Izbornik />
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.GOSTI} element={<GostPregled />} />
          <Route path={RouteNames.GOSTI_NOVI} element={<GostNovi />} />
          <Route path={RouteNames.GOSTI_PROMJENA} element={<GostPromjena />} />

          <Route path={RouteNames.REZERVACIJE} element={<RezervacijaPregled />} />
          <Route path={RouteNames.REZERVACIJE_NOVI} element={<RezervacijaNovi />} />


          <Route path={RouteNames.CIJENE} element={<CijenaPregled />} />
          <Route path={RouteNames.CIJENE_NOVI} element={<CijenaNovi />} />
          <Route path={RouteNames.CIJENE_PROMJENA} element={<CijenaPromjena />} />
          
        </Routes>
        <hr />
        &copy; Roberto
      </Container>
    </>
  )
}

export default App
