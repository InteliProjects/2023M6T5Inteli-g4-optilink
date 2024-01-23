import { useState, useEffect, useRef } from "react";

// Componente de tabela para exibir dados de demanda
export default function TableDemanda() {
  // useState para armazenar e atualizar os dados da tabela
  const [tableData, setTableData] = useState([]);
  // useRef para referenciar o input de arquivo
  const fileInputRef = useRef();

  // useEffect para buscar dados assim que o componente é montado
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requisição GET para obter dados de cidadeEstado
        const response = await fetch("http://localhost:3000/api/cidadeEstado");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        // Formatar os dados recebidos para uso na tabela
        const formattedData = data.map((item) => ({
          UF: item.uf,
          Cidade: item.municipio,
          data_inserida: item.data_inserido,
        }));

        // Atualizar o estado com os dados formatados
        setTableData(formattedData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };

    fetchData();
  }, []);

  // useState para controle de paginação da tabela
  const [atualPag, setAtualPag] = useState(1);
  // Número de itens por página
  const itemsPag = 10;
  // Calcular o total de páginas
  const totalPag = Math.ceil(tableData.length / itemsPag);

  // Função para lidar com o upload de arquivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Preparar os dados do arquivo para envio
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Requisição POST para enviar o arquivo
      const response = await fetch(
        "http://localhost:3000/api/uploadInstalacoes",
        {
          method: "POST",
          body: formData,
        }
      );

      // Log do resultado do upload
      if (response.ok) {
        const result = await response.text();
        console.log(result);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Uploading file failed", error);
    }
  };

  // Função para acionar o clique no input de arquivo
  const handleEditClick = () => {
    fileInputRef.current.click();
  };

 // Componente para renderizar o botão de editar
  const Editar = () => (
    <div>
      <button type="button" className="text-white" onClick={handleEditClick}>
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
        >
          <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
          <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
        </svg>
      </button>
    </div>
  );

  // Função para ir para a próxima página
  const proxPag = () => {
    setAtualPag((ultima) => (ultima < totalPag ? ultima + 1 : ultima));
  };

  // Função para voltar para a página anterior
  const ultimaPag = () => {
    setAtualPag((ultima) => (ultima > 1 ? ultima - 1 : ultima));
  };

  // Calcula o índice do último e do primeiro item da página atual
  const indexUltimoItem = atualPag * itemsPag;
  const indexPrimeiroItem = indexUltimoItem - itemsPag;
  // Seleciona os itens da página atual para exibição
  const atualItems = tableData.slice(indexPrimeiroItem, indexUltimoItem);

  // Renderiza a tabela e os controles de paginação
  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      <div className="relative overflow-x-auto sm:rounded-lg">
        <table className="w-full shadow-md text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-s text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                UF
              </th>
              <th scope="col" className="px-6 py-3">
                Cidade
              </th>
              <th scope="col" className="px-6 py-3">
                Última importação
              </th>
              <th scope="col" className="justify-end">
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {atualItems.map((item, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{item.UF}</td>
                <td className="px-6 py-4">{item.Cidade}</td>
                <td className="px-6 py-4">{item.data_inserida}</td>
                <td className="justify-end">{Editar()}</td>
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
