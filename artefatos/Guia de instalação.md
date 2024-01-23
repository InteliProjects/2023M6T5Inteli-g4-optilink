# Instruções para rodar a Aplicação
## Pré-requisitos
- Node.js versão 19.1.0 instalado.
- Python versão 3.6 ou superior instalado.

## Configuração do Ambiente de Desenvolvimento
Para executar a aplicação, são necessárias algumas configurações básicas no ambiente local. Segue abaixo:

### Instalação de Dependências
No terminal do diretório "..\codigo\backend", execute:
```bash
npm i 
```
No terminal do diretório "..\codigo\planejador\src\main", execute:
```bash
pip install Flask pandas unidecode pyproj k-means-constrained scikit-learn openpyxl
```
No terminal do diretório "..\codigo\frontend\vital", execute:
```bash
npm i
```
### Execução das APIs

No terminal do diretório "..\codigo\backend", execute:
```bash
node App.js # Isso executará a API em Node.js desenvolvida.
```

No terminal do diretório "..\codigo\planejador\src\main", execute:
```bash
python main.py # Isso executará o planejador/algoritmo da solução.
```

### Execução do Frontend

No terminal do diretório "..\codigo\frontend\vital", execute:
```bash
npm run dev # Isso executará o Frontend da Aplicação
```


