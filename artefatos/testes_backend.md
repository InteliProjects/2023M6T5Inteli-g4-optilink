# Documentação de Testes do Backend

## Introdução
Esta documentação é destinada a orientar desenvolvedores e testadores sobre como executar e interpretar os testes do backend da nossa aplicação.

## Instruções para configuração ambientes
Entre no [Link](instrucoes_de_ambiente.md) para configurar sua máquina e rodar os testes

### Importando a Coleção de Testes para o Postman
1. Baixe a coleção do Postman JSON do seguinte link: [API OptiLink](</codigo/backend/json/API OPTILINK.postman_collection.json>).
2. Abra o Postman.
3. Clique em "Import".
4. Selecione a opção "File" e carregue o arquivo JSON baixado.

Ou acesse a coleção online:

1. Acesse a coleção no Postman da API OptiLink: [API OptiLink ONLINE](<https://bold-spaceship-16143.postman.co/workspace/M6~aabc6d1b-84fb-4b37-98f8-29cf9550da1a/folder/23795560-d7fa49be-0e2e-4d2e-ba60-531e1c8f8fd9?ctx=documentation>).

### Executando os Testes
1. Escolha a coleção de testes que você importou.
2. Acesse cada requisição e envie os testes para serem executados.

### Avaliando os Resultados dos Testes
Após a execução, avalie os resultados dos outputs para verificar se estão funcionando conforme o esperado. Abaixo estão disponibilizadas figuras de como os testes devem ser executados e qual comportamento é esperado.

#### Figuras de Testes

Algumas evidências de testes:

Obs.: Os arquivos que devem ser inseridos nos testes encontram-se na pasta "..\codigos\backend\arquivos" do repositório. Para upload de serviços use [esse arquivo](</codigo/backend/arquivos/servicos_setembro_pr_curitiba.txt>). Para upload de técnicos use [esse arquivo](</codigo/backend/arquivos/partida_tecnicos.csv>).

* Upload de Dados dos Serviços:
![Upload de Serviços](<img/upload_servicos.png>)
É uma requisição do tipo POST que recebe um arquivo .txt ou .csv contendo os serviços cadastrados para serem inseridos no banco de dados. A requisição deve retornar ``Status: 200 OK`` indicando sucesso.

* Upload de Dados dos Técnicos:
![Upload de Técnicos](<img/upload_tecnicos.png>)
É uma requisição do tipo POST que recebe um arquivo .txt ou .csv contendo os dados dos técnicos cadastrados para serem inseridos no banco de dados. A requisição deve retornar ``Status: 200 OK`` indicando sucesso.

* Salvar Dados de Resposta do Algoritmo no Banco de Dados:
![Salvar Dados de Resposta](<img/dados_algoritmo.png>)
Essa requisição é do tipo

 GET e deve ser enviada após a ativação do planejador. Ela deve retornar ``Status: 200 OK`` indicando sucesso.

* Atualizar Serviços ou Técnicos:
![Atualizar Serviços ou Técnicos](<img/update_servicos.png>)
São requisições do tipo PUT que atualizam um registro no banco de dados que tem `id_venda` (no caso de serviços) ou `matricula` (no caso de técnicos) especificados na URL da requisição. Elas devem retornar ``Status: 200 OK`` indicando sucesso.

* Deletar Serviços ou Técnicos:
![Deletar Serviços ou Técnicos](<img/delete_tecnicos.png>)
São requisições do tipo DELETE que removem um registro do banco de dados que tem `id_venda` (no caso de serviços) ou `matricula` (no caso de técnicos) especificados na URL da requisição. Elas devem retornar ``Status: 200 OK`` indicando sucesso.
