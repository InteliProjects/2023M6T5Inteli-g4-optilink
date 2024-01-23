# Importando as bibliotecas necessárias
from flask import Flask, request, jsonify, Response
import pandas as pd
import unidecode
from pyproj import Proj, transform
from k_means_constrained import KMeansConstrained
from sklearn.metrics import pairwise_distances
import itertools
import warnings
import math

# Inicializando a aplicação Flask
app = Flask(__name__)

warnings.simplefilter(action='ignore', category=FutureWarning)
# Função para tratar nomes de colunas de um DataFrame
def tratar_colunas(df):
    # Remove caracteres especiais e transforma para minúsculas
    df.columns = df.columns.str.replace(':', '').str.lower().str.replace(' ', '_')
    # Remove acentuação
    df.columns = [unidecode.unidecode(col) for col in df.columns]
    return df

# Função para calcular a rota ótima, considerando a localização inicial do técnico
def calcular_rota_otima(df_cluster, localizacao_tecnico):
    # Calcula todas as permutações de chamadas no cluster
    permutacoes = itertools.permutations(df_cluster.index)
    distancia_minima = float('inf')
    rota_otima = None

    # Loop através de cada permutação para encontrar a rota ótima
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

    return rota_otima, distancia_minima

# Função para realizar o clustering
def clustering(df_servicos_cidade, produtividade=3, data_execucao='2023-09-02'):
    # Seleciona colunas relevantes
    df_servicos_cidade_clusters = df_servicos_cidade[['id_venda', 'dt_inicio_execucao', 'setor', 'instalado', 'latitude', 'longitude']]

    # Converte para o formato de data e filtra por uma data específica
    df_servicos_cidade_clusters['dt_inicio_execucao'] = pd.to_datetime(df_servicos_cidade_clusters['dt_inicio_execucao']).dt.date
    df_servicos_cidade_clusters_specific = df_servicos_cidade_clusters[df_servicos_cidade_clusters['dt_inicio_execucao'] == pd.to_datetime(data_execucao).date()]
    
    # Valida coordenadas geográficas
    if not validate_lat_long(df_servicos_cidade_clusters_specific):
        df_servicos_cidade_clusters_specific = df_servicos_cidade_clusters_specific[
            (df_servicos_cidade_clusters_specific['latitude'].between(-90, 90)) & 
            (df_servicos_cidade_clusters_specific['longitude'].between(-180, 180))
        ]

    # Converte lat/long para coordenadas UTM
    df_servicos_cidade_clusters_specific['utm_x'], df_servicos_cidade_clusters_specific['utm_y'] = zip(*df_servicos_cidade_clusters_specific.apply(lambda row: latlong_to_utm(row['latitude'], row['longitude']), axis=1))

    # Determina o número de clusters com base na produtividade
    k = len(df_servicos_cidade_clusters_specific) // produtividade

    # Aplica o algoritmo KMeans Constrained
    clf = KMeansConstrained(
        n_clusters=k,
        size_min=produtividade,
        size_max=produtividade+1,
        random_state=0
    )
    coordinates = df_servicos_cidade_clusters_specific[['utm_x', 'utm_y']].values
    df_servicos_cidade_clusters_specific['cluster'] = clf.fit_predict(coordinates)
    df_servicos_cidade_clusters_specific.sort_values(by=['cluster'], inplace=True)

    return df_servicos_cidade_clusters_specific

# Função para validar as coordenadas geográficas
def validate_lat_long(df):
    invalid_coords = df[
        (df['latitude'] < -90) | (df['latitude'] > 90) |
        (df['longitude'] < -180) | (df['longitude'] > 180)
    ]

    # Retorna True se não houver coordenadas inválidas
    return invalid_coords.empty

# Função para converter latitude e longitude para UTM
def latlong_to_utm(lat, long):
    proj_utm = Proj(proj='utm', zone=22, ellps='WGS84')
    proj_latlong = Proj(proj='latlong', datum='WGS84')
    utm_x, utm_y = transform(proj_latlong, proj_utm, long, lat)
    return utm_x, utm_y

# Função para calcular a distância euclidiana
def calcular_distancia(ponto1, ponto2):
    lat1, lon1 = ponto1
    lat2, lon2 = ponto2
    # Diferença em graus
    delta_lat = lat2 - lat1
    delta_lon = lon2 - lon1
    # Conversão de graus para quilômetros (aproximadamente)
    distancia_km_lat = delta_lat * 111
    distancia_km_lon = delta_lon * 111 * math.cos(math.radians((lat1 + lat2) / 2))
    # Distância euclidiana em km
    return math.sqrt(distancia_km_lat**2 + distancia_km_lon**2)


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
    
    tecnicos_sobrando.to_csv('../../../../codigo/backend/arquivos/tecnicos_sobrando.csv', index=False)
    chamadas_sobrando.to_csv('../../../../codigo/backend/arquivos/chamadas_sobrando.csv', index=False)

    # Renomeando e reorganizando as colunas
    df_final.rename(columns={'latitude_x': 'latitude_demanda', 'longitude_x': 'longitude_demanda',
                            'latitude_y': 'latitude_tecnico', 'longitude_y': 'longitude_tecnico'}, inplace=True)
        # Cria uma coluna com a distância total percorrida pelo técnico no cluster
    # Inicialize a coluna 'distancia_total_tecnico_cluster' com zeros
    df_final['distancia_total_tecnico_cluster'] = 0.0

    # Calcula a distância total percorrida por cada técnico
    for tecnico in df_final['matricula'].unique():
        # Filtra as linhas para o técnico atual
        df_tecnico = df_final[df_final['matricula'] == tecnico]
        
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

    df_final = df_final[['uf', 'matricula', 'nome', 'latitude_tecnico', 'longitude_tecnico', 
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
    # try:
    #     produtividade = int(request.form['produtividade'])
    # except:
    produtividade = 3
    # try:
    #     max_distancia = float(request.form['max_distancia'])
    # except:
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
        df_tecnicos['latitude'] = pd.to_numeric(df_tecnicos['latitude'], errors='coerce').fillna(0).astype(float)
        df_tecnicos['longitude'] = pd.to_numeric(df_tecnicos['longitude'], errors='coerce').fillna(0).astype(float)

        df_clusters = clustering(df_demanda, produtividade, data_execucao)
        df_alocacao = alocacao(df_clusters, df_tecnicos, cidade, max_distancia)

        # Exporta os dados para CSV
        clusters_csv = df_clusters[['latitude', 'longitude', 'cluster']].to_csv('../../../../codigo/backend/arquivos/clusters.csv', index=False)
        df_alocacao = df_alocacao.to_csv('../../../../codigo/backend/arquivos/alocacao.csv', index=False)

        # Cria uma resposta com os arquivos CSV e a mensagem de sucesso
        response = jsonify({
            'message': 'O algoritmo foi executado com sucesso e os arquivos de resultado foram criados.'
        })
        response.headers["Content-Disposition"] = "attachment; filename=alocacao.csv"
        response.mimetype = 'text/csv'
        return response

# Executa a aplicação Flask
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0') 