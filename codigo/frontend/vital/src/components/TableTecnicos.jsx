import { useEffect, useState } from "react";
import axios from "axios";

// Componente TableTecnicos para mostrar uma tabela de técnicos
// eslint-disable-next-line react/prop-types
export default function TableTecnicos({ refreshTecnicos }) {
  // Estado para armazenar os dados dos técnicos
  const [data, setData] = useState([]);

  // useEffect para buscar dados dos técnicos na montagem do componente
  useEffect(() => {
    // Chamada de API para obter dados dos técnicos
    axios
      .get("http://localhost:3000/api/tecnicos")
      .then((res) => setData(res.data)) // Atualiza o estado com os dados recebidos
      .catch((err) => console.log(err)); // Loga erros no console

    // Chamada da função passada como prop para atualizar dados dos técnicos
    refreshTecnicos();
  }, [refreshTecnicos]);

  // Paginação: estado e lógica para controlar a página atual e a quantidade de itens por página
  const [atualPag, setAtualPag] = useState(1);
  const itemsPag = 9; // Itens por página
  const totalPag = Math.ceil(data.length / itemsPag); // Cálculo do total de páginas

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
  const atualItems = data.slice(indexPrimeiroItem, indexUltimoItem);

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
                Matrícula WFM
              </th>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Ativo
              </th>
              <th scope="col" className="px-6 py-3">
                Latitude
              </th>
              <th scope="col" className="px-6 py-3">
                Longitude
              </th>
              <th scope="col" className="px-6 py-3">
                Território de serviço: Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Cidade
              </th>
            </tr>
          </thead>
          <tbody className="h-[35rem]">
            {atualItems.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item.UF}</td>
                <td className="px-6 py-4">{item.Matricula}</td>
                <td className="px-6 py-4">{item.Nome}</td>
                <td className="px-6 py-4">{item.Ativo}</td>
                <td className="px-6 py-4">{item.Latitude}</td>
                <td className="px-6 py-4">{item.Longitude}</td>
                <td className="px-6 py-4">{item.Territorio_Servico_Nome}</td>
                <td className="px-6 py-4">{item.Cidade}</td>
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
