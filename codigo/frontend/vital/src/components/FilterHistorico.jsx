import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function FilterHistorico({ setSelectedAlocDate, selectedAlocDate }) {
    const [filterData, setData] = useState([]);

    // Função para lidar com a seleção de uma data de alocação
    const handleSelectAlocDate = (event) => {
        setSelectedAlocDate(event.target.value);
        console.log(setSelectedAlocDate);
    };

    // useEffect para buscar dados quando o componente é montado
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/datasDoHistorico");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Mapeando os dados recebidos para o formato esperado
                const Data = data.map((item) => ({
                    Data: item.Data,
                }));

                setData(Data); // Atualizando o estado com os dados mapeados
            } catch (error) {
                console.error("Fetching data failed", error);
            }
        };

        fetchData(); // Chamando a função para buscar os dados
    }, []);

    return (
        <div className="flex absolute ml-[59rem] mt-[2.5rem] w-[20rem]">
            {/* Outro select para município, não relacionado à lógica da data de alocação */}
            <select className="flex-shrink-0 z-10 inline-flex items-center py-2.5 text-sm font-medium text-center text-gray-500 bg-gray-100 border dark:border-gray-600 rounded-s-lg hover:bg-gray-200 focus:ring-1 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-green-500 dark:focus:border-green-500 dark:text-white">
                <option value="Curitiba">Curitiba</option>
                {/* Outras opções para município, se necessário */}
            </select>

            {/* Select para a data de alocação */}
            <select 
                className="bg-gray-50 border w-[12rem] border-gray-300 text-gray-900 text-sm rounded-e-lg border-s-gray-100 dark:border-s-gray-700 border-s-2 hover:bg-gray-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                value={selectedAlocDate}
                onChange={handleSelectAlocDate}
            >
                <option value="">Data de alocação</option>
                {filterData.map((item, index) => (
                    <option key={index} value={item.Data}>
                        {item.Data}
                    </option>
                ))}
            </select>
        </div>
    );
}
