// Importações necessárias para o componente
import { useRef } from "react";
import Sidebar from "../components/Sidebar";
import TableDemanda from "../components/TableDemanda";

// Definição do componente Demanda
function Demanda() {

  // useRef é utilizado para criar uma referência ao input de arquivo
  const fileInputRef = useRef();

  // Função para manipular o upload do arquivo
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Cria um objeto FormData e adiciona o arquivo a ele
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Realiza uma requisição POST para enviar o arquivo
      const response = await fetch('http://localhost:3000/api/uploadInstalacoes', {
        method: 'POST',
        body: formData,
      });

      // Verifica se a resposta é bem-sucedida
      if (response.ok) {
        const result = await response.text();
        console.log(result);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      // Trata erros no upload do arquivo
      console.error("Uploading file failed", error);
    }
  };

  // Função para disparar o evento de clique no input de arquivo
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Renderização do componente
  return (
    <div className="text-white">
      {/* Input de arquivo escondido */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <Sidebar>
        <div className="p-4 sm:ml-64 h-[100vh] flex flex-col mt-[5rem]">
          <div className=" border-b border-gray-200 dark:border-gray-700">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="/"
                    className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
                  >
                    <svg
                      className="w-3 h-3 me-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                    </svg>
                    Alocação
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="w-3 h-3 text-gray-400 mx-1 rtl:rotate-180"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <a
                      href="#"
                      className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white"
                    >
                      Demanda
                    </a>
                  </div>
                </li>
              </ol>
            </nav>
            <h2 className="mb-4 text-3xl font-bold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">
              Demanda
            </h2>
          </div>
          <div className=" mt-[2.55rem] absolute right-10">
            <button
              type="button"
              className="text-white  focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleImportClick}
            >
              Importar
            </button>
          </div>
          <div className="mt-[3rem]">
            <TableDemanda></TableDemanda>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}

export default Demanda;
