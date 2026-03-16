import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { Route, Routes } from 'react-router-dom'
import { RouteNames } from './constants'
import Home from './pages/Home'
import SmjerPregled from './pages/smjerovi/SmjerPregled'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
          <Container>
      <Izbornik />
      <Routes>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SMJEROVI} element={<SmjerPregled />} />
      </Routes>
      <hr />
      &copy; Edunova
    </Container>
    </>
  )
}

export default App
