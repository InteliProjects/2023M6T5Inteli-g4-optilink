// Importação dos componentes necessários do react-router-dom e das páginas da aplicação
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Demanda from './pages/Demanda.jsx';
import Dashboard from './Dashboard.jsx';
import Tecnicos from './pages/Tecnicos.jsx';
import Historico from './pages/Historico.jsx';

// Definição do componente funcional App
function App() {
  // Renderização do componente
  return (
    // Utilização do Router para envolver as rotas da aplicação
    <Router>
      {/* Definição das rotas da aplicação */}
      <Routes>
        {/* Rota para a página principal (Dashboard) */}
        <Route path="/" element={<Dashboard />} />
        {/* Rota para a página de Demanda */}
        <Route path="/demanda" element={<Demanda />} />
        {/* Rota para a página de Técnicos */}
        <Route path="/tecnicos" element={<Tecnicos />} />
        {/* Rota para a página de Histórico */}
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </Router>
  );
}

// Exportação do componente App
export default App;
