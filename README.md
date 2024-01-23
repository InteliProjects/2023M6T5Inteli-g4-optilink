<table>
<tr>
<td>
<a href= "https://vtal.com"><img src="https://upload.wikimedia.org/wikipedia/commons/0/09/Vtal_logo_2022.png" alt="V.tal" border="0" width="60%"></a>
</td>
<td><a href= "https://www.inteli.edu.br/"><img src="./inteli-logo.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0" width="50%"></a>
</td>
</tr>
</table>

# Introdução

Este é um dos repositórios do projeto de alunos do Inteli em parceria com a V.tal no 2º semestre de 2023. Este projeto está sendo desenvolvido por alunos do Módulo 6 do curso de Ciência da Computação.


# Projeto: *Algoritmo de otimização para alocação e distribuição de equipes de técnicos*

# Grupo: OptiLink

# Integrantes:

* <a href="https://www.linkedin.com/in/arthur-nisa-de-paula-932746252/"> Arthur Nisa De Paula Souza </a>
* <a href="https://www.linkedin.com/in/estherhikari/"> Esther Hikari Kimura Nunes </a>
* <a href="https://www.linkedin.com/in/henrique-burle/"> Henrique Burle </a>
* <a href="https://www.linkedin.com/in/mariana-gorresen/"> Mariana Brasil Görresen </a>
* <a href="https://www.linkedin.com/in/tonyjonas/"> Tony Jonas dos Santos Sousa </a>
* <a href="https://www.linkedin.com/in/thomaz-klifson-046490125/"> Thomaz Klifson Falcão Barboza </a>

# Descrição

O projeto realizado em parceria com o Inteli visa otimizar a alocação e o deslocamento de técnicos de TI entre diferentes estados, melhorando o processo conforme a necessidade. A automação deste processo tem o potencial de elevar os SLAs, aumentando a satisfação do cliente e reduzindo custos operacionais de forma significativa. A solução proposta incorporará algoritmos de otimização que levam em conta dados em tempo real e históricos, capacidades técnicas dos recursos, proximidade geográfica às áreas de serviço e a urgência das demandas. Com uma interface intuitiva e um backend robusto, a ferramenta facilitará uma tomada de decisão mais rápida e informada, promovendo uma gestão de recursos técnico-operacionais mais eficiente e dinâmica.

# Configuração para o ambiente de desenvolvimento

*Procedimento para baixar e executar o código deste projeto.*
### Requisitos
- Node.js versão 19.1.0 instalado.
- Python versão 3.6 ou superior instalado.

### Instalação de Dependências
No terminal do diretório "..\\..\codigo\backend", execute:
```bash
npm install 
```
No terminal do diretório "..\\..\codigo\planejador\src\main", execute:
```bash
pip install Flask pandas unidecode pyproj k-means-constrained scikit-learn openpyxl
```
No terminal do diretório "..\\..\codigo\frontend\vital", execute:
```bash
npm install 
```
### Execução das APIs

No terminal do diretório "..\\..\codigo\backend", execute:
```bash
node App.js # Isso executará a API em Node.js desenvolvida.
```

No terminal do diretório "..\\..\codigo\planejador\src\main", execute:
```bash
python main.py # Isso executará o planejador/algoritmo da solução.
```

### Execução do Frontend

No terminal do diretório "..\codigo\frontend\vital", execute:
```bash
npm run dev # Isso executará o Frontend da Aplicação
```
## Observações sobre os arquivos de upload

Na pasta "codigo/backend/arquivos", você encontrará os modelos de arquivos no formato .txt ou .csv destinados ao cadastro de técnicos e demandas. 

Os arquivos "servico_mensal_pr_curitiba.txt" e "servico_mensal_pr_maringa.txt" estão como exemplo para preparar os arquivos de demandas de serviços de cidades específicas, contendo as colunas essenciais para a importação na tela de Demandas da aplicação, embora atualmente estejam vazios.

O arquivo "partida_tecnicos.csv" está como exemplo para preparar os arquivos de técnicos que serão cadastrados para alocação das demandas das cidades, contendo as colunas essenciais para a importação na tela de Técnicos da aplicação, mas, assim como os outros, está vazio no momento.

Os outros arquivos na pasta garantem o correto funcionamento do algoritmo e do backend. Eles servem como referência e estrutura para que o sistema possa processar e importar as informações corretamente. Portanto, certifique-se de não remover ou modificar esses arquivos, mesmo que estejam vazios no momento. 

Link do Manual do Usuário da aplicação: [Manual do Usuário](</codigo/frontend/vital/public/Manual do Usuário.pdf>).

# Tags

- SPRINT 1:
  - Entendimento do contexto do problema: modelagem e representação;
  - Entendimento de Negócio;
  - Entendimento da Experiência do Usuário.
- SPRINT 2:
  - Entendimento do contexto do problema;
  - Resolução de uma versão simplificada do problema;
  - Artigo - versão inicial;
  - Repositório de código.
- SPRINT 3:
  - Planejador e back-end da aplicação;
  - Front-end da aplicação;
  - Repositório de código;
  - Artigo - 2a versão.
- SPRINT 4:
  - Complexidade e corretude do algoritmo;
  - Aplicação;
  - Repositório de código da aplicação;
  - Artigo.
- SPRINT 5:
  - Preparação para a entrega;
  - Artigo completo;
  - Apresentação Final;
  - Testes de usabilidade.

## 📋 Licença/License

<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/">

<a property="dct:title" rel="cc:attributionURL">Grupo</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName">Inteli, Arthur Nisa, Esther Hikari, Henrique Burle, Mariana Görresen, Thomaz Klifson, Tony Jonas</a> is licensed under <a href="https://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" rel="license noopener noreferrer" style="display:inline-block;">Application 4.0 International</a>.</p>
