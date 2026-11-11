import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames } from '../constants';
import OperaterServiceMemorija from '../services/operateri/OperaterServiceMemorija';
import OperaterService from '../services/operateri/OperaterService';
import { AuthContext } from '../context/AuthContext';

function readStoredOperater() {
  const operater = localStorage.getItem('operater');

  if (!operater) {
    return {};
  }

  try {
    return JSON.parse(operater);
  } catch {
    localStorage.removeItem('operater');
    return {};
  }
}

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('operater')));
  const [authUser, setAuthUser] = useState(readStoredOperater);

  const navigate = useNavigate();

  async function login(email, lozinka) {
    let operateriLS = [];
    const operateriRaw = localStorage.getItem('operateri');

    if (operateriRaw) {
      try {
        const parsed = JSON.parse(operateriRaw);
        operateriLS = Array.isArray(parsed) ? parsed : [];
      } catch {
        operateriLS = [];
      }
    }

    const odgovor =
      operateriLS.length === 0
        ? await OperaterServiceMemorija.prijava(email, lozinka)
        : await OperaterService.prijava(email, lozinka);

    if (odgovor.success) {
      localStorage.setItem('operater', JSON.stringify(odgovor.data));
      setAuthUser(odgovor.data);
      setIsLoggedIn(true);
      navigate(RouteNames.HOME);
    } else {
      alert(odgovor.message);
      localStorage.setItem('operater', '');
      setAuthUser({});
      setIsLoggedIn(false);
    }
  }

  function logout() {
    localStorage.removeItem('operater');
    setAuthUser({});
    setIsLoggedIn(false);
    navigate(RouteNames.HOME);
  }

  const value = {
    isLoggedIn,
    authUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}