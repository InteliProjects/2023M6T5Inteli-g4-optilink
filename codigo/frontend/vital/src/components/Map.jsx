/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL  from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { IconLayer, PathLayer } from "@deck.gl/layers";
import IconClusterLayer from "./icon-cluster-layer";
import icon from "./data/location-icon-atlas.png";
import iconT from "./data/location-icon-atlas_blue.png";
import mock from "./data/location-icon-mapping.json"
import "./css/style.css"

//Definindo coordenadas iniciais do mapa
const MAP_VIEW = new MapView({ repeat: true });
const INITIAL_VIEW_STATE = {
  longitude: -49.29546347150432,
  latitude: -25.495061963499822,
  zoom: 13,
  maxZoom: 20,
  pitch: 0,
  bearing: 0,
};

//Definindo aparência do mapa
const MAP_STYLE =
  //Importando json de estilo e padronização
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"; 

  //Função para acionar ao colocar o mouse em cima a descrição do marcador no mapa, que varia se for demanda ou técnico
  function renderTooltip(info) {
    const { object, x, y, layer } = info;
  
    if (!object) {
      return null;
    }
  
    let content;
    if (layer.id.includes('tec')) {
      content = (
        <div>
          <div><strong>Nome do Técnico:</strong> {object.Nome}</div>
          <div><strong>WFM:</strong> {object.WFM}</div>
          <div><strong>Setor:</strong> {object.Setor}</div>
        </div>
      );
    } else if (layer.id.includes('dem')) {
      content = (
        <div>
          <div><strong>Cluster:</strong> {object.Cluster}</div>
          <div><strong>Ordem:</strong> {object.Ordem}</div>
          <div><strong>Setor:</strong> {object.Setor}</div>
          <div><strong>Instalado:</strong> {object.Instalado}</div>
        </div>
      );
    } else {
      content = <div>Informação não disponível</div>;
    }
    return (
      <div className="tooltip" style={{ left: x, top: y }}>
        {content}
      </div>
    );
  }
  

/* eslint-disable react/no-deprecated */

//Início do componente mapa, que guarda o mapa para ser importado por outros componentes
export default function ComponenteMap({
  //Definindo parametros
  iconMapping = mock,
  iconAtlas = icon,
  showCluster = true,
  mapStyle = MAP_STYLE,
  selectedUF,
  selectedDate

}) 

{
  //Definindo useState para guardar e atualizar os dados após cada alteração
  const [mapData, setMapData] = useState([]);
  const [pathLayers, setPathLayers] = useState([]);
  //GET que trás os dados de alocação para serem mostrados no mapa
  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tabelaAlocacao?uf=${selectedUF}&dt_inicio_execucao=${selectedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        console.log(data);

        const formattedData = data.map(item => ({
          WFM: item.matricula_wfm,
          Nome: item.nome,
          Latitude_tec: item.latitude_tecnico,
          Longitude_tec: item.longitude_tecnico,
          Coordenadas_tec: [item.longitude_tecnico, item.latitude_tecnico],
          Setor: item.setor,
          Instalado: item.instalado,
          Cluster: item.cluster,
          Latitude_dem: item.latitude_demanda,
          Longitude_dem: item.longitude_demanda,
          Coordenadas_dem: [item.longitude_demanda, item.latitude_demanda],
          Dist_Tec: item.distancia_tecnico_cluster,
          Ordem: item.ordem,
          Dist_Total_Tec: item.distancia_total_tecnico_cluster,
        }));
        console.log(formattedData)
        setMapData(formattedData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };
  
    fetchMap();
  }, [selectedUF, selectedDate]);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/tabelaAlocacao?uf=${selectedUF}&dt_inicio_execucao=${selectedDate}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
  
        const dataByTechnician = {};
        data.forEach(item => {
          const techKey = item.matricula_wfm;
          if (!dataByTechnician[techKey]) {
            dataByTechnician[techKey] = {
              technician: item,
              demands: [{
                coordinates: [item.longitude_tecnico, item.latitude_tecnico],
                order: 0 // valor de ordem para garantir que seja o primeiro
              }]
            };
          }
          dataByTechnician[techKey].demands.push({
            coordinates: [item.longitude_demanda, item.latitude_demanda],
            order: [item.ordem + 1]
          });
        });
  
        for (const tech in dataByTechnician) {
          dataByTechnician[tech].demands.sort((a, b) => a.order - b.order);
        }
  
        const newPaths = Object.values(dataByTechnician).map(tech => {
          const path = tech.demands.map(d => d.coordinates);
          path.unshift([tech.technician.longitude_tecnico, tech.technician.latitude_tecnico]);
        
          return new PathLayer({
            id: `path-layer-${tech.technician.matricula_wfm}`,
            data: [{ path }],
            getPath: d => d.path,
            getColor: d => d.color || [Math.random() * 255, Math.random() * 255, Math.random() * 255],
            widthMinPixels: 5
          });
        });
        
        setMapData(data);
        setPathLayers(newPaths);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };
  
    fetchMap();
  }, [selectedUF, selectedDate]);
  

// eslint-disable-next-line react-hooks/rules-of-hooks
  const [hoverInfo, setHoverInfo] = useState({});

  const hideTooltip = () => {
    setHoverInfo({});
  };
  const expandTooltip = (info) => {
    if (info.picked && showCluster) {
      setHoverInfo(info);
    } else {
      setHoverInfo({});
    }
  };

  const commonLayerProps = {
    pickable: true,
    sizeUnits: "meters",
    sizeScale: 2000,
    sizeMinPixels: 6,
    onHover: !hoverInfo.objects && setHoverInfo,
  };
  
  const layerDem = showCluster
    ? new IconClusterLayer({
        ...commonLayerProps,
        id: "icon-cluster-dem",
        data: mapData,
        getPosition: (d) => d.Coordenadas_dem,
        iconAtlas,
        iconMapping,
        sizeScale: 40,
      })
    : new IconLayer({
        ...commonLayerProps,
        id: "icon-dem",
        data: mapData,
        getPosition: (d) => d.Coordenadas_dem,
        iconAtlas,
        iconMapping,
        getIcon: (d) => "marker",
      });
  
  const layerTec = showCluster
    ? new IconClusterLayer({
        ...commonLayerProps,
        id: "icon-cluster-tec",
        data: mapData,
        getPosition: (d) => d.Coordenadas_tec,
        iconAtlas: iconT,
        iconMapping,
        sizeScale: 40,
      })
    : new IconLayer({
        ...commonLayerProps,
        id: "icon-tec",
        data: mapData,
        getPosition: (d) => d.Coordenadas_tec,
        iconAtlas: iconT,
        iconMapping,
        getIcon: (d) => "marker",
      });

    

  return (
    <div className="relative flex h-full max-h-[29.5rem] flex-col justify-center overflow-hidden">
      <DeckGL
        layers={[...pathLayers,layerDem, layerTec]}
        views={MAP_VIEW}
        initialViewState={INITIAL_VIEW_STATE}
        controller={{ dragRotate: false }}
        onViewStateChange={hideTooltip}
        onClick={expandTooltip}
      >
        <Map
          reuseMaps
          mapLib={maplibregl}
          mapStyle={mapStyle}
          preventStyleDiffing={true}
        />

        {renderTooltip(hoverInfo)}
      </DeckGL>
    </div>
  );
}