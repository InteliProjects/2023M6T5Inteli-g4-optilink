
# Complexidade Computacional
- 1° laço: "calcular_rota_otima" (Complexidade total N!)

Complexidade do bloco: O(N!)
```
def calcular_rota_otima(df_cluster, localizacao_tecnico):
    # Calcula todas as permutações de chamadas no cluster
    permutacoes = itertools.permutations(df_cluster.index)
    distancia_minima = float('inf')
    rota_otima = None
```
A complexidade desta parte é O(N!) pois ela usa do recurso "intertools.permutations" que calcula todas as permutações possíveis de "df_cluster.idex". Sendo N o numero de chamadas no cluster.

Complexidade do bloco: O(N! * N)

```
    for permutacao in permutacoes:
        # Primeiro ponto da permutação
        ponto_inicial_chamada = df_cluster.loc[permutacao[0]][['latitude', 'longitude']]
        distancia_inicial = calcular_distancia(localizacao_tecnico, ponto_inicial_chamada)

        # Calcula a distância total incluindo a distância do técnico até o primeiro ponto
        distancia_total = distancia_inicial
        for i in range(len(permutacao) - 1):
            chamada_atual = df_cluster.loc[permutacao[i]]
            proxima_chamada = df_cluster.loc[permutacao[i + 1]]
            distancia = calcular_distancia((chamada_atual['latitude'], chamada_atual['longitude']),
                                           (proxima_chamada['latitude'], proxima_chamada['longitude']))
            distancia_total += distancia

        if distancia_total < distancia_minima:
            distancia_minima = distancia_total
            rota_otima = permutacao
```
Neste bloco, a complexidade é O(N!) para a primeira parte, pois ele itera sobre todas as permutações. Em seguida, temos um outro loop N-1 que para cada iteração calcula a distancia total. Portanto, tendo ambas as partes, a complexidade fica O(N!*N).

**Pior Caso:** O pior caso ocorre quando todas as permutações possíveis dos pontos no cluster precisam ser avaliadas para encontrar a rota com a menor distância total. Isso acontece quando a rota ótima é uma das últimas permutações a serem verificadas, ou quando as distâncias entre pontos são tais que muitas permutações têm distâncias totais semelhantes.

**Melhor Caso:** O melhor caso seria teoricamente encontrar a rota ótima na primeira permutação avaliada. No entanto, isso é extremamente improvável em um contexto real, a menos que as permutações sejam de alguma forma pré-ordenadas com base em algum critério de distância, o que não é indicado no código fornecido. Portanto, o melhor caso prático ocorre quando a rota ótima é uma das primeiras a serem verificadas.

- 2° laço: "clustering"
    K-Means constrained O(I * N * K * D)
``` 
    # Determina o número de clusters com base na produtividade
    k = len(df_servicos_cidade_clusters_specific) // produtividade

    # Aplica o algoritmo KMeans Constrained
    clf = KMeansConstrained(
        n_clusters=k,
        size_min=3,
        size_max=4,
        random_state=0
    )
    coordinates = df_servicos_cidade_clusters_specific[['utm_x', 'utm_y']].values
    df_servicos_cidade_clusters_specific['cluster'] = clf.fit_predict(coordinates)
    df_servicos_cidade_clusters_specific.sort_values(by=['cluster'], inplace=True)

    return df_servicos_cidade_clusters_specific
```
Este laço aplica o algoritmo do K-means porém com a possibilidade de colocar algumas restrições. O K-means é baseado no número de padrões, número de grupos e número de iterações.
Neste caso, I é o numero de iterações, K é o numero de clusters, N é o numero de data points e D é a dimensionalidade. 
- A Dimensionalidade se refere ao número de atributos usados para representar um Data Point. Por exemplo, em um plano 2D a dimensionalidade é 2, e um data point é representado por dois valores (X,Y)

3° Laço:
```
# Função para alocar técnicos aos clusters
def alocacao(df_clusters, df_tecnicos, cidade="Curitiba", max_distancia=7.0):
    # Valida as coordenadas dos técnicos
    if not validate_lat_long(df_tecnicos):
        df_tecnicos = df_tecnicos[
            (df_tecnicos['latitude'].between(-90, 90)) & 
            (df_tecnicos['longitude'].between(-180, 180))
        ]

    # Filtra técnicos ativos e da cidade especificada
    df_tecnicos = df_tecnicos[(df_tecnicos['ativo'] == True) & (df_tecnicos['cidade'] == cidade)]
  
    # Calculando o centro de cada cluster de serviços
    centros_clusters = df_clusters.groupby('cluster')[['latitude', 'longitude']].mean()

    # Calculando distâncias de todos os técnicos para todos os clusters
    X = df_tecnicos[['latitude', 'longitude']].values
    Y = centros_clusters.values
    distancias = pairwise_distances(X, Y, metric=calcular_distancia)

    # Atribuindo técnicos aos clusters
    tecnicos_disponiveis = set(df_tecnicos.index)
    df_tecnicos['assigned_cluster'] = None
    df_tecnicos['total_distance'] = None

    for cluster_id in centros_clusters.index:
        distancias_cluster = distancias[:, cluster_id]

        # Verificar se ainda existem técnicos disponíveis
        if not tecnicos_disponiveis:
            break

        # Encontrar o técnico mais próximo que ainda não foi atribuído e está dentro da distância máxima
        while tecnicos_disponiveis:
            indice_tecnico_mais_proximo = distancias_cluster.argmin()
            distancia_minima = distancias_cluster[indice_tecnico_mais_proximo]

            if indice_tecnico_mais_proximo in tecnicos_disponiveis and distancia_minima <= max_distancia:
                df_tecnicos.at[indice_tecnico_mais_proximo, 'assigned_cluster'] = cluster_id
                df_tecnicos.at[indice_tecnico_mais_proximo, 'total_distance'] = distancia_minima
                tecnicos_disponiveis.remove(indice_tecnico_mais_proximo)
                break

            # Marcar a distância atual como infinita para considerar o próximo técnico mais próximo
            distancias_cluster[indice_tecnico_mais_proximo] = float('inf')

            # Verificar se todos os técnicos restantes estão fora da distância máxima
            if all(distancias_cluster[tec] > max_distancia if tec < len(distancias_cluster) else True for tec in tecnicos_disponiveis):
                break

    # Loop por cada cluster para determinar a rota ótima
    for cluster_id, df_cluster in df_clusters.groupby('cluster'):
        # Encontrar o técnico atribuído a este cluster
        df_tecnico = df_tecnicos[df_tecnicos['assigned_cluster'] == cluster_id]

        if not df_tecnico.empty:
            tecnico_id = df_tecnico.index[0]  # Pegar o índice do primeiro técnico atribuído a este cluster
            localizacao_tecnico = (df_tecnico.at[tecnico_id, 'latitude'], df_tecnico.at[tecnico_id, 'longitude'])

            rota_otima, distancia_total = calcular_rota_otima(df_cluster, localizacao_tecnico)

            if rota_otima is not None:
                # Adiciona as novas colunas 'ordem' e 'distancia_total_tecnico_cluster'
                ordem = {id_chamada: ordem for ordem, id_chamada in enumerate(rota_otima)}
                df_clusters.loc[df_cluster.index, 'ordem'] = df_cluster.index.map(ordem)

    # Juntando os DataFrames
    df_final = pd.merge(df_clusters, df_tecnicos, left_on='cluster', right_on='assigned_cluster')

    tecnicos_sobrando = df_tecnicos[df_tecnicos['assigned_cluster'].isnull()]

    colunas_chamadas = ['id_venda', 'dt_inicio_execucao', 'setor', 'instalado', 'latitude', 'longitude', 'cluster']
    chamadas_sobrando = df_clusters[~df_clusters['cluster'].isin(df_tecnicos['assigned_cluster'].dropna().unique())][colunas_chamadas]
    
    tecnicos_sobrando.to_csv('codigo/arquivos/tecnicos_sobrando.csv', index=False)
    chamadas_sobrando.to_csv('codigo/arquivos/chamadas_sobrando.csv', index=False)

    # Renomeando e reorganizando as colunas
    df_final.rename(columns={'latitude_x': 'latitude_demanda', 'longitude_x': 'longitude_demanda',
                            'latitude_y': 'latitude_tecnico', 'longitude_y': 'longitude_tecnico'}, inplace=True)
        # Cria uma coluna com a distância total percorrida pelo técnico no cluster
    # Inicialize a coluna 'distancia_total_tecnico_cluster' com zeros
    df_final['distancia_total_tecnico_cluster'] = 0.0

    # Calcula a distância total percorrida por cada técnico
    for tecnico in df_final['matricula_wfm'].unique():
        # Filtra as linhas para o técnico atual
        df_tecnico = df_final[df_final['matricula_wfm'] == tecnico]
        
        # Ordena o DataFrame do técnico pela ordem das chamadas
        df_tecnico = df_tecnico.sort_values('ordem')
        
        # Calcula a distância total
        distancia_total = 0
        ponto_inicial = (df_tecnico.iloc[0]['latitude_tecnico'], df_tecnico.iloc[0]['longitude_tecnico'])
        ponto_inicial_chamada = (df_tecnico.iloc[0]['latitude_demanda'], df_tecnico.iloc[0]['longitude_demanda'])
        distancia_total += calcular_distancia(ponto_inicial, ponto_inicial_chamada)

        for i in range(0, len(df_tecnico)-1):
            ponto_anterior = (df_tecnico.iloc[i]['latitude_demanda'], df_tecnico.iloc[i]['longitude_demanda'])
            ponto_atual = (df_tecnico.iloc[i+1]['latitude_demanda'], df_tecnico.iloc[i+1]['longitude_demanda'])
            distancia_total += calcular_distancia(ponto_anterior, ponto_atual)
        
        # Atribui a distância total ao técnico no DataFrame final
        df_final.loc[df_tecnico.index, 'distancia_total_tecnico_cluster'] = distancia_total

    df_final = df_final[['uf', 'matricula_wfm', 'nome', 'latitude_tecnico', 'longitude_tecnico', 
                        'dt_inicio_execucao', 'setor', 'instalado', 'cluster', 
                        'latitude_demanda', 'longitude_demanda', 'total_distance', 'ordem', 'distancia_total_tecnico_cluster']]
    df_final.rename(columns={'total_distance': 'distancia_tecnico_cluster'}, inplace=True)

    return df_final


# Rota para upload de arquivos e processamento
@app.route('/upload', methods=['POST'])
def upload_file():
    # Verifica a presença dos arquivos no request
    if 'demanda' not in request.files or 'tecnicos' not in request.files:
        return jsonify({'error': 'No file part'})

    demanda = request.files['demanda']
    tecnicos = request.files['tecnicos']
    cidade = request.form['cidade']
    data_execucao = request.form['data'] # Formato: 2023-09-02
    try:
        produtividade = int(request.form['produtividade'])
    except:
        produtividade = 3
    try:
        max_distancia = float(request.form['max_distancia'])
    except:
        max_distancia = 7.0

    # Verifica se os arquivos foram selecionados
    if demanda.filename == '' or tecnicos.filename == '':
        return jsonify({'error': 'No selected file'})

    if demanda and tecnicos:
        # Processamento dos arquivos
        df_demanda = pd.read_csv(demanda, sep=',')
        try: 
            df_tecnicos = pd.read_excel(tecnicos, sheet_name='Tecnicos Universitarios')
        except:
            df_tecnicos = pd.read_csv(tecnicos, sep=',')

        # Tratamento das colunas e aplicação das funções
        df_demanda = tratar_colunas(df_demanda)
        df_tecnicos = tratar_colunas(df_tecnicos)
        df_clusters = clustering(df_demanda, produtividade, data_execucao)
        df_alocacao = alocacao(df_clusters, df_tecnicos, cidade, max_distancia)

        # Exporta os dados para CSV
        clusters_csv = df_clusters[['latitude', 'longitude', 'cluster']].to_csv('codigo/arquivos/clusters.csv', index=False)
        df_alocacao = df_alocacao.to_csv('codigo/arquivos/alocacao.csv', index=False)

        # Cria uma resposta com os arquivos CSV e a mensagem de sucesso
        response = jsonify({
            'message': 'O algoritmo foi executado com sucesso e os arquivos de resultado foram criados.'
        })
        response.headers["Content-Disposition"] = "attachment; filename=alocacao.csv"
        response.mimetype = 'text/csv'
        return response

```

Validação das Coordenadas dos Técnicos: A complexidade é O(n) onde n é o número de técnicos. Cada técnico é verificado uma vez.

Filtragem de Técnicos: Também O(n), pois cada técnico é verificado para atendimento dos critérios de filtragem.

Cálculo do Centro dos Clusters: O(c), onde c é o número de clusters. Cada cluster é processado uma vez para calcular a média das coordenadas.

Cálculo de Distâncias: Utiliza a função pairwise_distances, que tem uma complexidade de O(n*c), assumindo que o cálculo de distância entre dois pontos é O(1).

Atribuição de Técnicos aos Clusters: Este loop tem uma complexidade potencial de O(n*c), já que, no pior caso, cada técnico é comparado com cada cluster.

Determinação da Rota Ótima: A determinação da rota ótima é um processo intensivo, cuja complexidade é principalmente definida pela função calcular_rota_otima. Esta função calcula todas as permutações possíveis de chamadas dentro de um cluster (com complexidade O(N!)), onde N é o número de chamadas, e depois calcula a distância total para cada permutação (com complexidade adicional O(N)). Isso resulta em uma complexidade total de O(N! * N) para a função calcular_rota_otima.

Cálculo da Distância Total Percorrida por Técnico: O(n*d), onde d é o número médio de demandas por técnico.

# Complexidade Final:

**Notação Big O (Pior Caso):** A complexidade no pior caso é determinada pelo número de permutações que precisam ser avaliadas. Dado um conjunto de 
n pontos, o número de permutações possíveis é 
n! (fatorial de n). Portanto, a complexidade do pior caso é O(n!), o que é extremamente alta para valores grandes de n.

**Notação Ômega (Melhor Caso):** No melhor caso, a complexidade seria Ω(1), supondo que a rota ótima seja encontrada na primeira permutação. No entanto, como mencionado, isso é altamente improvável, então um melhor caso mais realista seria encontrar a rota ótima em um número relativamente pequeno de permutações, resultando em uma complexidade de Ω(n), onde n é o número de pontos.

**Notação Theta (Caso Médio):** O caso médio, que é muitas vezes o mais relevante, provavelmente se aproxima do pior caso devido à natureza da avaliação de todas as permutações. No entanto, na prática, o caso médio pode ser um pouco melhor do que o pior caso, dependendo da distribuição dos pontos e das distâncias entre eles. Ainda assim, a complexidade do caso médio fica em algum lugar entre O(n!) e Ω(n), inclinando-se mais para o lado do O(n!) para conjuntos de pontos maiores.

# Invariante do Laço Principal

O invariante do laço principal está na função `calcular_rota_otima`. Essa função é responsável por calcular a rota ótima entre pontos em um cluster, utilizando permutações para determinar a menor distância total de percurso.

O invariante do laço na função `calcular_rota_otima` é que, a cada iteração do laço `for`, a variável `distancia_minima` sempre armazena a menor distância total encontrada até o momento entre as permutações já processadas. Ou seja, independentemente de qual permutação esteja sendo considerada atualmente, `distancia_minima` sempre mantém o valor da menor distância total já identificada.

## Justificativa:

- **Inicialização**: No início do laço, `distancia_minima` é definida como infinito (`float('inf')`). Isso garante que qualquer distância total calculada nas primeiras permutações será menor que infinito, sendo então considerada como a nova `distancia_minima`.

- **Manutenção**: Em cada iteração do laço, a distância total da permutação atual (`distancia_total`) é calculada e comparada com `distancia_minima`. Se `distancia_total` for menor, a `distancia_minima` é atualizada para armazenar esse novo valor mais baixo. Assim, o invariante é mantido porque `distancia_minima` sempre reflete a menor distância encontrada até o momento.

- **Término**: Quando o laço termina, todas as permutações possíveis foram avaliadas, e `distancia_minima` armazena a menor distância total encontrada entre todos os percursos possíveis. Portanto, ao final do laço, `distancia_minima` representa efetivamente a menor distância total possível entre os pontos do cluster.

Este invariante é fundamental para o funcionamento do algoritmo, pois garante que, ao final das iterações, a rota com a menor distância total seja identificada. Isso é essencial para problemas de otimização de rotas, como no contexto desse código.

# Demonstração formal da corretude do algoritmo, aplicando indução matemática no invariante do laço:
## Base da Indução
Passo inicial (n = 1): Quando avaliamos a primeira permutação, a distancia_minima é atualizada para o valor da distância total daquela permutação (se for menor que float('inf'), o que sempre será). Assim, após a primeira permutação, a distancia_minima representa corretamente a menor distância encontrada até aquele ponto.

## Hipótese de Indução
Hipótese (n = k): Suponha que após k permutações, a distancia_minima representa corretamente a menor distância das k permutações.

## Passo de Indução
Prova (n = k + 1): Agora, precisamos mostrar que a propriedade se mantém para a k+1-ésima permutação. Quando a k+1-ésima permutação é avaliada, duas situações podem ocorrer:

A distância total da k+1-ésima permutação é maior do que a distancia_minima atual: Neste caso, a distancia_minima não é atualizada, permanecendo como a menor distância encontrada nas k permutações anteriores, que é a correta até o momento.

A distância total da k+1-ésima permutação é menor do que a distancia_minima atual: Neste caso, a distancia_minima é atualizada para o valor da distância total da k+1-ésima permutação. Assim, a distancia_minima agora representa corretamente a menor distância encontrada, considerando as k+1 permutações.

Em ambos os casos, a distancia_minima após a k+1-ésima permutação ainda representa a menor distância encontrada até aquele ponto, mantendo o invariante do laço.

Portanto, por indução matemática, podemos concluir que, após todas as permutações serem avaliadas, a distancia_minima refletirá corretamente a menor distância total de todas as permutações possíveis, e a rota_otima será a permutação que resulta nessa distância mínima. Assim, o algoritmo é correto em identificar a rota ótima.