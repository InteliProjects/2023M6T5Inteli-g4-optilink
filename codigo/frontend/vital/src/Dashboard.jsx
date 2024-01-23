// Importação dos componentes necessários e folha de estilo
import Sidebar from "./components/Sidebar";
import "./App.css";
import Tab from "./components/Tab";

// Definição do componente funcional Dashboard
function Dashboard() {
  // Renderização do componente
  return (
    // Estrutura principal do componente Dashboard
    <div className="text-white">
      {/* Incorporação do componente Sidebar */}
      <Sidebar>
        {/* Conteúdo principal do Dashboard */}
        <div className="p-4 sm:ml-64 h-[100vh] flex flex-col">
          {/* Incorporação do componente Tab */}
          <Tab></Tab>
        </div>
      </Sidebar>
    </div>
  );
}

// Exportação do componente Dashboard
export default Dashboard;