/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

// Este componente é utilizado para filtrar e selecionar opções como UF, município e data.
export default function Filter({
  isOpen,
  onClose,
  setSelectedMun,
  setSelectedUF,
  setSelectedDate,
  selectedMun,
  selectedUF,
  selectedDate,
}) {
  // Estados para armazenar as listas de filtros de UF, município e data.
  const [filterUF, setUF] = useState([]);
  const [filterMun, setCidade] = useState([]);
  const [filterData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Funções para manipular a seleção de município, UF e data.
  const handleSelectMun = (event) => {
    setSelectedMun(event.target.value);
    console.log(selectedMun);
  };

  const handleSelectUF = (event) => {
    setSelectedUF(event.target.value);
    console.log(selectedUF);
  };

  const handleSelectDate = (event) => {
    setSelectedDate(event.target.value);
    console.log(selectedDate);
  };

  // Efeito para buscar e definir a lista de UFs.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/uf");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const ufData = data.map((item) => ({
          UF: item.uf,
        }));

        setUF(ufData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };

    fetchData();
  }, []);

  // Efeito para buscar e definir a lista de municípios.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/municipios");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const cidadeData = data.map((item) => ({
          Cidade: item.municipio,
        }));

        console.log(cidadeData);
        setCidade(cidadeData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };

    fetchData();
  }, []);

  // Efeito para buscar e definir a lista de datas baseadas no município selecionado.
  useEffect(() => {
    const fetchData = async () => {
      if (selectedMun) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/datas?municipio=${selectedMun}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          console.log(data);

          const dateData = data.map((item) => ({
            Data: item.dt_inicio_execucao,
          }));

          setData(dateData);
        } catch (error) {
          console.error("Fetching data failed", error);
        }
      }
    };

    fetchData();
  }, [selectedMun]);

  // Função para lidar com o clique no botão de calcular alocação.
  const handleCalculateClick = async () => {
    setIsLoading(true);
    try {
      const apiUrl = "http://localhost:3000/api/algoritmo/send-to-flask";
      const requestData = {
        estado: selectedUF,
        cidade: selectedMun,
        data: selectedDate,
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log(selectedUF, selectedMun, selectedDate);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);

      onClose();
    } catch (error) {
      console.error("Erro ao executar o algoritmo", error);
    }
    setIsLoading(false); // Desativar o spinner após a conclusão da operação
    onClose();
  };

  // Classes CSS para controlar a visibilidade e o estilo do modal.
  const modalContainerClasses = isOpen
    ? "fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden"
    : "hidden";

  const modalBackdropClasses = "fixed inset-0 bg-black bg-opacity-50";

  // Renderização do componente com seleções e botão para calcular.
  return (
    <div className={modalContainerClasses}>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div>
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      )}
      <div className={modalBackdropClasses} onClick={onClose}></div>
      <div className="relative p-4 w-full max-w-lg max-h-full">
        <div id="select-modal" tabIndex="-1" aria-hidden="true">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Selecione as opções abaixo para rodar o algoritmo:
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="select-modal"
                  onClick={onClose}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4 md:p-5">
                <ul className="space-y-4 mb-4">
                  <li>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      UF:
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={selectedUF}
                      onChange={handleSelectUF}
                    >
                      <option value="" selected>
                        Selecione uma UF
                      </option>
                      {filterUF.map((item, index) => (
                        <option key={index} value={item.UF}>
                          {item.UF}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Cidade:
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={selectedMun}
                      onChange={handleSelectMun}
                    >
                      <option value="" selected>
                        Selecione uma Cidade
                      </option>
                      {filterMun.map((item, index) => (
                        <option key={index} value={item.Cidade}>
                          {item.Cidade}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Data de execução:
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={selectedDate}
                      onChange={handleSelectDate}
                    >
                      <option value="" selected>
                        Selecione uma Data de Execução
                      </option>
                      {filterData.map((item, index) => (
                        <option key={index} value={item.Data}>
                          {item.Data}
                        </option>
                      ))}
                    </select>
                  </li>
                </ul>
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="w-50 text-white focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={handleCalculateClick}
                  >
                    Calcular Alocação
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
