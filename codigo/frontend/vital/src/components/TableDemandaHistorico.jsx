import { useEffect, useState } from "react";

// Componente TableTecnicos para mostrar uma tabela de técnicos
// eslint-disable-next-line react/prop-types
export default function TableDemandaHistorico({selectedAlocDate} ) {
  // Estado para armazenar e atualizar os dados da tabela
  const [tableData, setTableData] = useState([]);

  // useEffect para buscar dados quando o componente é montado ou quando selectedDate e selectedUF são atualizados
useEffect(() => {
  const fetchData = async () => {
    try {
      // Requisição GET para obter dados da tabela de alocação
      const response = await fetch(`http://localhost:3000/api/historicoInstalacao?data_gerado=${selectedAlocDate}&municipio=CURITIBA`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      const formattedData = data.map(item => ({
        ba: item.ba,
        uf: item.uf,
        id_venda: item.id_venda,
        setor: item.setor,
        dt_abertura_ba: item.dt_abertura_ba,
        dt_inicio_execucao: item.dt_inicio_execucao,
        dt_fim_execucao: item.dt_fim_execucao,
        instalado: item.instalado,
        logradouro: item.logradouro,
        numero: item.numero,
        bairro: item.bairro,
        cep: item.cep,
        latitude: item.latitude,
        longitude: item.longitude,

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
                BA
              </th>
              <th scope="col" className="px-6 py-3">
                UF
              </th>
              <th scope="col" className="px-6 py-3">
                ID_Venda
              </th>
              <th scope="col" className="px-6 py-3">
                Setor
              </th>
              <th scope="col" className="px-6 py-3">
                DT_Abertura_BA
              </th>
              <th scope="col" className="px-6 py-3">
                DT_Inicio_Execução
              </th>
              <th scope="col" className="px-6 py-3">
                DT_Fim_Execução
              </th>
              <th scope="col" className="px-6 py-3">
                Instalado
              </th>
              <th scope="col" className="px-6 py-3">
                Logradouro
              </th>
              <th scope="col" className="px-6 py-3">
                Número
              </th>
              <th scope="col" className="px-6 py-3">
                Bairro
              </th>
              <th scope="col" className="px-6 py-3">
                CEP
              </th>
              <th scope="col" className="px-6 py-3">
                Latitude
              </th>
              <th scope="col" className="px-6 py-3">
                Longitude
              </th>
            </tr>
          </thead>
          <tbody className="h-[35rem]">
            {atualItems.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item.ba}</td>
                <td className="px-6 py-4">{item.uf}</td>
                <td className="px-6 py-4">{item.id_venda}</td>
                <td className="px-6 py-4">{item.setor}</td>
                <td className="px-6 py-4">{item.dt_abertura_ba}</td>
                <td className="px-6 py-4">{item.dt_inicio_execucao}</td>
                <td className="px-6 py-4">{item.dt_fim_execucao}</td>
                <td className="px-6 py-4">{item.instalado}</td>
                <td className="px-6 py-4">{item.logradouro}</td>
                <td className="px-6 py-4">{item.numero}</td>
                <td className="px-6 py-4">{item.bairro}</td>
                <td className="px-6 py-4">{item.cep}</td>
                <td className="px-6 py-4">{item.latitude}</td>
                <td className="px-6 py-4">{item.longitude}</td>
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
