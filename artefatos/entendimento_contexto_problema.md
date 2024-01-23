# Entendimento do contexto do problema: modelagem e representação

## Expressões Matemáticas

A) Qual o contexto do problema a ser resolvido?

A empresa V.tal possui uma grande rede de técnicos especializados espalhados pelo Brasil para prestar os serviços que a empresa disponibiliza. Porém, a alocação desses técnicos nas distintas regiões de uma cidade se dá de forma predominantemente manual. Esse processo tem potencial para ser otimizado, visando aumentar os SLAs (Acordo de Nível de Serviço) e resultar em uma possível redução de custos operacionais.

B) Quais os dados disponíveis?

Os dados disponibilizados pela V.tal incluem: 
- quantidade total de técnicos;
- distribuição de técnicos por estado (UF);
- tempo médio para completar uma instalação ou reparo;
- a data do agendamento do cliente;
- data do início da execução do serviço;
- data do fim da execução do serviço; 
- entre o agendamento do cliente e a finalização do serviço solicitado;
- os setores e o município e UF a que pertence;
- endereço do chamado (como bairro, cep, logradouro);
- coordenadas dos polígonos (setores);
- matrículas dos técnicos;
- nome dos técnicos;
- setor dos técnicos;
- coordenada de partida dos técnicos.
	
C) Qual o objetivo do problema?	

O objetivo do problema é desenvolver um algoritmo capaz de otimizar a distribuição e alocação dos técnicos disponíveis, levando em consideração a possibilidade de reajustar os setores de atuação de cada técnico conforme a demanda.

D) Identifique pelo menos dois recursos que representam limitações neste problema?
	
Três principais limitações que surgem neste cenário são:
1. Disponibilidade de Técnicos para Realocação: A possibilidade de realocar técnicos de um setor para outro é limitada pela disponibilidade de técnicos que podem ser realocados sem afetar negativamente o serviço no setor de origem. A realocação não é apenas uma questão de número, mas também de habilidade e experiência dos técnicos, bem como da necessidade de manter uma força de trabalho estável em cada setor para garantir a continuidade do serviço.
2. Restrições Geográficas e de Proximidade: A realocação de técnicos está sujeita a restrições geográficas, onde técnicos só podem ser realocados para setores próximos. Isso limita a flexibilidade do sistema de otimização e pode impedir a realocação ideal de recursos em resposta a flutuações na demanda.

E) Quais são as expressões matemáticas que representam a função objetivo e as restrições/limitações do problema?
### Análise do custo do deslocamento de um técnico de um setor i para um setor j

**Custo do tempo de deslocamento:**

$TD_{ij}: \text{Tempo de deslocamento de um técnico do setor i para o setor j.}$

$Vm_{ij} = \text{Velocidade média do veículo durante o deslocamento do setor i para o setor j.}$

$d_{ij}: \text{Distância do trajeto do setor i para o setor j.}$

$Vm_{ij}=\dfrac{d_{ij}}{TD_{ij}}$

$TD_{ij}=\dfrac{d_{ij}}{Vm_{ij}}$


Dessa forma, o tempo necessário para ir de um setor a outro é igual à distância entre as cidades dividido pela velocidade média que o técnico levaria em condições normais, considerando as características entre os dois setores (zona rural ou metropolitana).

**Custo monetário considerando o preço da gasolina:**


$C_{ij}: \text{Custo monetário da viagem}.$

$d_{ij}: \text{Distância do trajeto do setor i para o setor j.}$

$Cv: \text{Consumo do veículo (quantidade de gasolina que o carro consome por quilômetro).}$

$Pg_i = \text{Preço da gasolina no setor i.}$


$C_{ij}= d_{ij} \cdot Cv \cdot Pg_i$ 

Dessa forma, o custo de uma viagem entre dois setores é a distância entre esses dois setores multiplicada pelo consumo do veículo (quantidade de gasolina que o carro consome por quilômetro) e pelo preço da gasolina no setor i.

### Modelagem matemática considerando o custo do deslocamento de um técnico de um setor i para um setor j

**Variáveis usadas na modelagem:**

$TD_{ij}: \text{Tempo de deslocamento de um técnico do setor i para o setor j.}$


$TI_j= \text{Tempo médio de instalação do setor j}$

$TR_j= \text{Tempo médio de reparo do setor j}$

$C_{ij}: \text{Custo monetário da viagem}.$

$N_{j}= \text{Número de técnicos no setor j}$

$R_j = \text{Número de reparos do setor j}$

$I_j = \text{Número de instalações do setor j}$

**Variável de Decisão:**

$X_{ij}= \text{Nú𝑚𝑒𝑟𝑜 𝑑𝑒 𝑡é𝑐𝑛𝑖𝑐𝑜𝑠 𝑎𝑙𝑜𝑐𝑎𝑑𝑜𝑠 do setor i para o setor j.}$

**Função Objetivo:**

$Min \ Z= \sum_{i=j=1}^{k} \ (TD_{ij}+TI_j+TR_j)\cdot C_{ij}\cdot X_{ij} \ ; \ \forall i \neq j$


**Restrições:**

$(I) \ \ \ \ \ \ \ \ I_j \cdot TI_j + R_j \cdot TR_j + TD_{ij} \cdot X_{ij} \leq 8 \cdot (N_j+X_{ij}- X_{ji}) \ ;$

$(II) \ \ \ \ \ \ R_j + I_j \leq 2 \cdot (N_j + X_{ij} - X_{ji}) \ ;$

$(III) \ \ \ \ X_{ij}, X_{ji} \geq 0 \ ;$

$(IV) \ \ \ \ TD_{ij}\geq 0 \ ;$

$(V) \ \ \ \ \ \ TR_j \geq 0 \ ;$

$(VI) \ \ \ \ \ TI_j \geq 0 \ ;$

$(VII) \ \ \ TD_{ij}+TR_j\leq 4 \ ;$

$(VIII) \ \ TD_{ij}+TI_j \leq 4 \ ;$

$(IX) \ \ \ C_{ij} \leq 0 \ ;$

$(X) \ \ \ \ N_{j} \leq 0 \ ;$

$\text{onde k = número total de setores e }N_t=\text{número total de técnicos disponíveis}$

**Explicação da Função Objetivo:**

$(TD_{ij}+TI_j+TR_j)\cdot C_{ij}\cdot X_{ij}$ : minimizar o produto do custo de tempo pelo custo monetário, pela quantidade de técnicos realocados do setor i para o setor j.

$\sum_{i=j=1}^{k} \ (TD_{ij}+TI_j+TR_j)\cdot C_{ij}\cdot X_{ij} \ ; \ \forall i \neq j$ : Somatório do produto mencionado anteriormente, indo de 1 até a quantidade total de setores. Como não pode haver realocação para o mesmo setor, então i deve ser diferente de j.

**Explicação das restrições:**

$(I):$ A quantidade de ordens de serviço (número de instalações mais o número de reparos) no setor de destino (setor j), multiplicada pelo seu respectivo custo de tempo, mais o tempo de deslocamento vezes a quantidade de técnicos realocados de um setor para outro, deve ser menor ou igual à jornada diária de trabalho (8 horas) vezes a quantidade de técnicos no setor de destino após a realocação final (os que entraram menos os que saíram mais os que permaneceram lá)

$(II):$ A quantidade de ordens de serviço (número de instalações mais o número de reparos) no setor de destino (setor j), deve ser menor ou igual ao dobro da quantidade de técnicos naquele setor de destino após a realocação final (os que entraram menos os que saíram mais os que permaneceram lá), pois cada funcionário deve ter até duas ordens de serviço no setor de destino, considerando que ele tem um slot de até 4 horas para cada tarefa.

$(III):$ A quantidade de técnicos que são realocados de um setor para outro sempre é maior ou igual a zero.

$(IV):$ O tempo de deslocamento de um setor para outro sempre é maior ou igual a zero.

$(V):$ O tempo de reparo no setor de destino sempre é maior ou igual a zero.

$(VI):$ O tempo de instalação no setor de destino sempre é maior ou igual a zero.

$(VII):$ O tempo de deslocamento de um setor para outro mais o tempo de reparo no setor de destino sempre é menor ou igual a 4, considerando que o técnico tem um slot de até 4 horas para cada ordem de serviço.

$(VIII):$ O tempo de deslocamento de um setor para outro mais o tempo de instalação no setor de destino sempre é menor ou igual a 4, considerando que o técnico tem um slot de até 4 horas para cada ordem de serviço.

$(IX):$ O custo monetário do deslocamento de um setor para outro sempre é maior ou igual a zero.

$(X):$ O Número de técnicos no setor j sempre é maior ou igual a zero.

F) Identificação dos gargalos do problema.

Para identificar os gargalos do problema, precisamos analisar as restrições matemáticas e identificar onde as igualdades são alcançadas, pois essas situações representam limites que não podem ser ultrapassados e que restringem a otimização do problema. Vamos analisar cada restrição:

- Restrição (I): Esta restrição indica que o tempo total dedicado a instalações e reparos, somado ao tempo de deslocamento dos técnicos realocados, não pode exceder a jornada de trabalho de 8 horas dos técnicos no setor j. O gargalo ocorre quando o tempo total de trabalho e deslocamento atinge exatamente 8 horas, pois isso significa que os técnicos estão operando na capacidade máxima, não podendo assumir mais trabalhos ou deslocamentos sem ultrapassar a jornada de trabalho.

- Restrição (II): Estabelece que o número total de serviços (instalações e reparos) em um setor não pode ser mais do que o dobro do número de técnicos disponíveis após a realocação. O gargalo é atingido quando cada técnico está alocado para exatamente duas ordens de serviço, o que indica que não há capacidade para serviços adicionais.

- Restrição (VII) e (VIII): Essas restrições estabelecem que o tempo de deslocamento mais o tempo gasto em uma tarefa (instalação ou reparo) não deve exceder 4 horas. O gargalo é alcançado quando um técnico tem seu tempo totalmente ocupado por um deslocamento e uma tarefa, indicando que não há margem para tarefas adicionais ou deslocamentos mais longos dentro do mesmo turno.

- Restrição (IX) e (X): Estas restrições indicam que o custo monetário de deslocamento e o número de técnicos em cada setor devem ser maiores ou iguais a zero. Embora sejam restrições válidas para a viabilidade da solução, elas não representam gargalos operacionais, mas sim limitações físicas ou lógicas (não se pode ter custo negativo ou número negativo de técnicos).

Os principais gargalos são, portanto, associados às restrições de tempo (I, VII, VIII) e capacidade de trabalho dos técnicos (II). Para resolver o problema de otimização, é necessário que o algoritmo desenvolvido considere essas restrições para maximizar a eficiência dentro dos limites estabelecidos.


## Análise levando em consideração diferentes cenários de mudanças de variáveis.

G) Como a alteração na quantidade de ordens de serviço por setor e a variação nos custos de deslocamento dos técnicos entre diferentes setores influenciam a eficiência e o custo do modelo de alocação de técnicos? Analise considerando diferentes cenários de demanda e custos de transporte (pelo menos 2 cenários).

Após montar ambos os cenários utilizando o OpenSolver do GoogleSheets e ajustando ele para a nossa modelagem, temos os dois casos a seguir:

**Primeiro, abordando o Cenário 1:**
![Screenshot 2023-11-09 165202](https://github.com/2023M6T5Inteli/grupo4/assets/110630356/49490d4f-c666-4795-883b-65ba738d3417)
![Screenshot 2023-11-09 165427](https://github.com/2023M6T5Inteli/grupo4/assets/110630356/16dc8a65-3ff7-4906-9225-cf54e1aea8e3)

1.  Como podemos ver nesse primeiro cenário, é possível analisar o ‘’Sombra preço’’, nos mostrando que para cada aumento na ordem de serviço do setor 2, ou seja, a demanda deste setor, o custo da função objetivo sobe em 10, já que serão considerados não só o custo monetário do deslocamento, mas também o tempo médio que os serviços tomam. É importante ressaltar que não é permitido aumentar a demanda neste cenário sem alterar a solução. 
2. Além disso, também podemos analisar que a mudança no custo de deslocamento afeta a solução ótima até um certo ponto, já que temos uma certa margem em que é permitido aumentar e reduzir a demanda sem alterar o resultado do algoritmo. Neste caso, podemos reduzir X12 até 10 e X21 até 25 sem causar grandes alterações

**Agora abordando o cenário 2:**

![Screenshot 2023-11-09 175714](https://github.com/2023M6T5Inteli/grupo4/assets/110630356/cb9f2f29-6e2d-4070-b0af-49e978d3cfb1)
![Screenshot 2023-11-09 173723](https://github.com/2023M6T5Inteli/grupo4/assets/110630356/ab78c837-3378-4e3c-a04b-87c7abcb68fb)

Neste segundo cenário, vemos que a solução foi a alocação de 17 funcionários do setor 2 para o setor 1.
1. Avaliando a variação de ordem de serviços, vemos no ''Sombra Preço'' que para cada aumento da demanda, o custo da função aumenta em 378. Para o caso reverso, o custo diminui em 378.
2. Já a variação do custo de deslocamento, assim como no primeiro cenário, tem até certo ponto para afetar a solução ótima, visto que podemos aumentar e reduzir os valores sem que o algoritmo seja afetado. Neste cenário, é possível reduzir X12 até 657 e X21 até 378 e aumentar ambos infinitamente sem mudar a solução ótima.

Após avaliar ambos os cenários, podemos notar que eles possuem uma diferença revelante entre si:
- No cenário 2 é possível aumentar a demanda(ordem de serviços) em ate 3 unidades sem alterar a solução ótima, enquanto no cenário 1 não é possível aumentar nada. Isso ocorre pois o cenário 1 é mais justo que o cenário 2, permitindo menos maleabilidade.

H) Como um aumento ou diminuição de 10% nos custos de deslocamento dos técnicos impacta no custo total do processo de alocação de técnicos? 

Levando em consideração a função objetivo: $Min \ Z= \sum_{i=j=1}^{k} \ (TD_{ij}+TI_j+TR_j)\cdot C_{ij}\cdot X_{ij} \ ; \ \forall i \neq j$ e o cenário analisado (Cenário 1) 

![Screenshot 2023-11-09 165427](https://github.com/2023M6T5Inteli/grupo4/assets/110630356/96d79a4a-fe9e-40c6-aa38-325cccd90564)

Podemos perceber que um aumento ou diminuição em 10% no custo de deslocamento não afetaria em nada, já que 10% de 10 seria a redução ou aumento em uma unidade e 10% de 25 seria 2.5. E como mostrado pela análise de sensibilidade, é possível reduzir até 10 para x12 e 25 para x21 o custo ou aumentar infinitamente sem afetar a solução ótima. Claro que a função objetivo seria alterada caso seja dado algum aumento significativo. Mas não a solução ótima.
