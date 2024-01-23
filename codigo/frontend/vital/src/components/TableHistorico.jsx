import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function TableHistorico({selectedAlocDate } ) {
  // Estado para armazenar e atualizar os dados da tabela
  const [tableData, setTableData] = useState([]);

  // useEffect para buscar dados quando o componente é montado ou quando selectedDate são atualizados
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requisição GET para obter dados da tabela de alocação
        const response = await fetch(`http://localhost:3000/api/historicoAlocacao?data_gerado=${selectedAlocDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const formattedData = data.map(item => ({
          uf: item.uf,
          matricula_wfm: item.matricula_wfm,
          nome: item.nome,
          latitude_tecnico: item.latitude_tecnico,
          longitude_tecnico: item.longitude_tecnico,
          dt_inicio_execucao: item.dt_inicio_execucao,
          setor: item.setor,
          instalado: item.instalado,
          cluster: item.cluster,
          latitude_demanda: item.latitude_demanda,
          longitude_demanda: item.longitude_demanda,
          distancia_tecnico_cluster: item.distancia_tecnico_cluster,
          ordem: item.ordem,
          distancia_total_tecnico_cluster: item.distancia_total_tecnico_cluster,
  
        }));
  
        setTableData(formattedData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };
  
    fetchData();
  });

  // Paginação: estado e lógica para controlar a página atual e a quantidade de itens por página
  const [atualPag, setAtualPag] = useState(1);
  const itemsPag = 9; // Itens por página
  const totalPag = Math.ceil(tableData.length / itemsPag); // Cálculo do total de páginas

  // Função para mudar para a próxima página
  const proxPag = () => {
    setAtualPag((ultima) => (ultima < totalPag ? ultima + 1 : ultima));
  };

  // Função para voltar à página anterior
  const ultimaPag = () => {
    setAtualPag((ultima) => (ultima > 1 ? ultima - 1 : ultima));
  };

  // Cálculo dos índices para os itens da página atual
  const indexUltimoItem = atualPag * itemsPag;
  const indexPrimeiroItem = indexUltimoItem - itemsPag;
  const atualItems = tableData.slice(indexPrimeiroItem, indexUltimoItem);

  // Renderização da tabela com os dados e botões de navegação da paginação
  return (
    <div>
      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className=" w-full shadow-md text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                UF
              </th>
              <th scope="col" className="px-6 py-3">
                Matrícula
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
                Data_Inicio_Execução
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
                Distância Técnicos do Cluster
              </th>
              <th scope="col" className="px-6 py-3">
                Ordem
              </th>
              <th scope="col" className="px-6 py-3">
                Distância Total do Tecnico ao Cluster
              </th>
            </tr>
          </thead>
          <tbody className="h-[35rem]">
            {atualItems.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item.uf}</td>
                <td className="px-6 py-4">{item.matricula_wfm}</td>
                <td className="px-6 py-4">{item.nome}</td>
                <td className="px-6 py-4">{item.latitude_tecnico}</td>
                <td className="px-6 py-4">{item.longitude_tecnico}</td>
                <td className="px-6 py-4">{item.dt_inicio_execucao}</td>
                <td className="px-6 py-4">{item.setor}</td>
                <td className="px-6 py-4">{item.instalado}</td>
                <td className="px-6 py-4">{item.cluster}</td>
                <td className="px-6 py-4">{item.latitude_demanda}</td>
                <td className="px-6 py-4">{item.longitude_demanda}</td>
                <td className="px-6 py-4">{item.distancia_tecnico_cluster}</td>
                <td className="px-6 py-4">{item.ordem}</td>
                <td className="px-6 py-4">{item.distancia_total_tecnico_cluster}</td>


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
