import { useState, useEffect } from "react";

/// Componente Table para exibir dados com base em selectedDate e selectedUF
// eslint-disable-next-line react/prop-types
export default function Table({selectedDate, selectedUF}) {
  // Estado para armazenar e atualizar os dados da tabela
  const [tableData, setTableData] = useState([]);
  // Estado para controle da paginação atual
  const [atualPag, setAtualPag] = useState(1);


  // useEffect para buscar dados quando o componente é montado ou quando selectedDate e selectedUF são atualizados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requisição GET para obter dados da tabela de alocação
        const response = await fetch(`http://localhost:3000/api/tabelaAlocacao?uf=${selectedUF}&dt_inicio_execucao=${selectedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const formattedData = data.map(item => ({
          UF: item.uf,
          WFM: item.matricula_wfm,
          Nome: item.nome,
          Latitude_tec: item.latitude_tecnico,
          Longitude_tec: item.longitude_tecnico,
          DT_inicio: item.dt_inicio_execucao,
          Setor: item.setor,
          Instalado: item.instalado,
          Cluster: item.cluster,
          Latitude_dem: item.latitude_demanda,
          Longitude_dem: item.longitude_demanda,
          Dist_Tec: item.distancia_tecnico_cluster,
          Ordem: item.ordem,
          Dist_Total_Tec: item.distancia_total_tecnico_cluster,
        }));

        setTableData(formattedData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };

    fetchData();
  }, []);

  const itemsPag = 5;
  const totalPag = Math.ceil(tableData.length / itemsPag);

  
  const proxPag = () => {
    setAtualPag((ultima) => (ultima < totalPag ? ultima + 1 : ultima));
  };

  const ultimaPag = () => {
    setAtualPag((ultima) => (ultima > 1 ? ultima - 1 : ultima));
  };

  const indexUltimoItem = atualPag * itemsPag;
  const indexPrimeiroItem = indexUltimoItem - itemsPag;
  const atualItems = tableData.slice(indexPrimeiroItem, indexUltimoItem);

  const convertToCSV = (objArray) => {
    const array =
      typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
    let str = "";

    for (let index in objArray[0]) {
      if (str !== "") str += ",";
      str += index;
    }
    str += "\r\n";

    for (let i = 0; i < array.length; i++) {
      let line = "";
      for (let index in array[i]) {
        if (line !== "") line += ",";
        line += array[i][index];
      }
      str += line + "\r\n";
    }

    return str;
  };

  const exportarDados = () => {
    const csvData = convertToCSV(tableData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", "alocacao.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Renderização da tabela e dos botões de navegação e exportação
  return (
    <div>
      <div className="flex justify-end p-2">
        <button
          onClick={exportarDados}
          className="flex justify-center px-4 h-5 text-sm font-medium text-white rounded"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-2"
          >
            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
          </svg>
          Exportar
        </button>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full h-[35rem] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                UF
              </th>
              <th scope="col" className="px-6 py-3">
                WFM
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Latitude Técnico
              </th>
              <th scope="col" className="px-6 py-3">
                Longitude Técnico
              </th>
              <th scope="col" className="px-6 py-3">
                DT Inicio Execução
              </th>
              <th scope="col" className="px-6 py-3">
                Setor
              </th>
              <th scope="col" className="px-6 py-3">
                Instalado
              </th>
              <th scope="col" className="px-6 py-3">
                Cluster
              </th>
              <th scope="col" className="px-6 py-3">
                Latitude Demanda
              </th>
              <th scope="col" className="px-6 py-3">
                Longitude Demanda
              </th>
              <th scope="col" className="px-6 py-3">
                Distancia Tecnico Cluster
              </th>
              <th scope="col" className="px-6 py-3">
                Ordem
              </th>
              <th scope="col" className="px-6 py-3">
                Distancia Total Tecnico Cluster
              </th>
            </tr>
          </thead>
          <tbody >
            {atualItems.map((item, index) => (
              <tr
                key={index}
                className="bg-white  border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item.UF}</td>
                <td className="px-6 py-4">{item.WFM}</td>
                <td className="px-6 py-4">{item.Nome}</td>
                <td className="px-6 py-4">{item.Latitude_tec}</td>
                <td className="px-6 py-4">{item.Longitude_tec}</td>
                <td className="px-6 py-4">{item.DT_inicio}</td>
                <td className="px-6 py-4">{item.Setor}</td>
                <td className="px-6 py-4">{item.Instalado}</td>
                <td className="px-6 py-4">{item.Cluster}</td>
                <td className="px-6 py-4">{item.Latitude_dem}</td>
                <td className="px-6 py-4">{item.Longitude_dem}</td>
                <td className="px-6 py-4">{item.Dist_Tec}</td>
                <td className="px-6 py-4">{item.Ordem}</td>
                <td className="px-6 py-4">{item.Dist_Total_Tec}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center mt-5">
        <div className="inline-flex mt-2 xs:mt-0">
          <button
            onClick={ultimaPag}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-s hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <svg
              className="w-3.5 h-3.5 me-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5H1m0 0 4 4M1 5l4-4"
              />
            </svg>
            Anterior
          </button>
          <button
            onClick={proxPag}
            className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-s border-gray-700 rounded-e hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Próximo
            <svg
              className="w-3.5 h-3.5 ms-2 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
