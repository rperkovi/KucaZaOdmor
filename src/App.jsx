import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Home from './pages/Home'
import GostPregled from './pages/gosti/GostPregled'
import GostNovi from './pages/gosti/GostNovi'

function App() {

  return (
    <>
      <Container>
        <Izbornik />
        <Routes>
          <Route path={RouteNames.HOME} element={<Home />} />
          <Route path={RouteNames.GOSTI} element={<GostPregled />} />
           <Route path={RouteNames.GOSTI_NOVI} element={<GostNovi />} />
        </Routes>
        <hr />
        &copy; Roberto
      </Container>
    </>
  )
}

export default App
