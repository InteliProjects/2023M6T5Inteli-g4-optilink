import { useState } from "react";
import ComponenteMap from "./Map";
import Table from "./Table";
import Filter from "./Filter";

// Componente Tab para controlar a exibição de diferentes conteúdos
const Tab = () => {
  // Estados para controlar qual aba está ativa, se o modal está aberto, e os filtros selecionados
  const [activeTab, setActiveTab] = useState("Algorithm");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMun, setSelectedMun] = useState("");
  const [selectedUF, setSelectedUF] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Função para alternar a visibilidade do modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Conteúdo da aba Algoritmo
  const AlgorithmContent = () => (
    <>
      <div className="flex justify-end mb-3">
        <button
          type="button"
          className="text-white focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={toggleModal}
        >
          Rodar Algoritmo
        </button>
      </div>
      <ComponenteMap selectedDate={selectedDate} selectedUF={selectedUF} />
    </>
  );

  // Conteúdo da aba Tabela
  const TableContent = () => <Table selectedDate={selectedDate} selectedUF={selectedUF} />;

  // Função para mudar a aba ativa
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  // Renderização do componente com abas e conteúdo condicional

  return (
    <>
      <div className="flex flex-row border-b border-gray-200 dark:border-gray-700 mt-12">
        <ul className="flex flex-wrap -mb-px text-sm font-medium  text-gray-500 dark:text-gray-400">
          <li className="mr-2">
            <button
              onClick={() => handleTabClick("Algorithm")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                activeTab === "Algorithm"
                  ? "text-green-600 border-green-600"
                  : "border-transparent"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-2"
              >
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Algoritmo
            </button>
          </li>

          <li className="mr-2">
            <button
              onClick={() => handleTabClick("Table")}
              className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                activeTab === "Table"
                  ? "text-green-600 border-green-600"
                  : "border-transparent"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M21 12H3M12 3v18" />
              </svg>
              Tabela
            </button>
          </li>
        </ul>
      </div>

      <div className="p-4 border-2 border-gray-200 h-screen border-dashed rounded-lg dark:border-gray-700 mt-14">
        {activeTab === "Algorithm" && <AlgorithmContent />}
        {activeTab === "Table" && <TableContent />}
      </div>
      <Filter isOpen={isModalOpen} onClose={toggleModal} setSelectedDate={setSelectedDate} setSelectedMun={setSelectedMun} setSelectedUF={setSelectedUF} selectedDate={selectedDate} selectedMun={selectedMun} selectedUF={selectedUF} />
    </>
  );
};

export default Tab;
