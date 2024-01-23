import { useState } from "react";
import MapHistorico from "./MapHistorico";
import FilterHistorico from "./FilterHistorico";
import TableTecnicosHistorico from "./TableTecnicosHistorico";
import TableDemandaHistorico from "./TableDemandaHistorico";
import TableHistorico from "./TableHistorico";

const TabHistorico = () => {
  const [activeTab, setActiveTab] = useState("Algorithm");
  const [selectedAlocDate, setSelectedAlocDate] = useState("");

  const AlgorithmContent = () => (
    <>
    <MapHistorico selectedAlocDate={selectedAlocDate}/>
    </>
  );
  
  const TableContent = () => <TableHistorico selectedAlocDate={selectedAlocDate}/>;
  const TableTecContent = () => <TableTecnicosHistorico selectedAlocDate={selectedAlocDate}/>;
  const TableDemContent = () => <TableDemandaHistorico selectedAlocDate={selectedAlocDate}/>;  

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <>
      <div className="flex ml-[22rem] flex-row absolute mt-[2.3rem]">
        <ul className="flex flex-wrap -mb-px text-sm font-medium  text-gray-500 dark:text-gray-400">
          {/* Algorithm Tab */}
          <li className="mr-2">
            <button
              onClick={() => handleTabClick("Algorithm")}
              className={`inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
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

          {/* Table Tab */}
          <li className="mr-2">
            <button
              onClick={() => handleTabClick("Table")}
              className={`inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
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
              Alocação
            </button>
          </li>

          <li className="mr-2">
            <button
              onClick={() => handleTabClick("TableDem")}
              className={`inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                activeTab === "TableDem"
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
              Demanda
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => handleTabClick("TableTec")}
              className={`inline-flex items-center justify-center p-4 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group ${
                activeTab === "TableTec"
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
              Técnicos
            </button>
          </li>
        </ul>
      </div>
      <FilterHistorico  selectedAlocDate={selectedAlocDate} setSelectedAlocDate={setSelectedAlocDate}/>
      <div className="p-4 border-2 border-gray-200 h-screen border-dashed rounded-lg dark:border-gray-700 mt-[4rem]">
        {activeTab === "Algorithm" && <AlgorithmContent />}
        {activeTab === "Table" && <TableContent />}
        {activeTab === "TableTec" && <TableTecContent />}
        {activeTab === "TableDem" && <TableDemContent />}
        
      </div>
    </>
  );
};

export default TabHistorico;