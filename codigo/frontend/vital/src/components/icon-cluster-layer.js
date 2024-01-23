import { CompositeLayer } from '@deck.gl/core';
import { IconLayer } from '@deck.gl/layers';
import Supercluster from 'supercluster';

// Função para determinar o nome do ícone com base no tamanho do cluster
function getIconName(size) {
  if (size === 0) {
    return '';
  }
  if (size < 10) {
    return `marker-${size}`;
  }
  if (size < 100) {
    return `marker-${Math.floor(size / 10)}0`;
  }
  return 'marker-100';
}

// Função para determinar o tamanho do ícone com base no tamanho do cluster
function getIconSize(size) {
  return Math.min(100, size) / 100 + 1;
}

// Classe IconClusterLayer que estende CompositeLayer
export default class IconClusterLayer extends CompositeLayer {
  // Determina se o estado do componente deve ser atualizado
  shouldUpdateState({ changeFlags }) {
    return changeFlags.somethingChanged;
  }

  // Atualiza o estado do componente quando necessário
  updateState({ props, oldProps, changeFlags }) {
    const rebuildIndex = changeFlags.dataChanged || props.sizeScale !== oldProps.sizeScale;

    if (rebuildIndex) {
      // Cria um novo índice de cluster usando Supercluster
      const index = new Supercluster({ maxZoom: 16, radius: props.sizeScale * Math.sqrt(2) });
      index.load(
        props.data.map(d => ({
          geometry: { coordinates: props.getPosition(d) },
          properties: d
        }))
      );
      this.setState({ index });
    }

    // Atualiza os dados se o zoom mudou ou se o índice foi reconstruído
    const z = Math.floor(this.context.viewport.zoom);
    if (rebuildIndex || z !== this.state.z) {
      this.setState({
        data: this.state.index.getClusters([-180, -85, 180, 85], z),
        z
      });
    }
  }

  // Fornece informações para a seleção de ícones
  getPickingInfo({ info, mode }) {
    const pickedObject = info.object && info.object.properties;
    if (pickedObject) {
      if (pickedObject.cluster && mode !== 'hover') {
        info.objects = this.state.index
          .getLeaves(pickedObject.cluster_id, 25)
          .map(f => f.properties);
      }
      info.object = pickedObject;
    }
    return info;
  }

  // Renderiza as camadas de ícones
  renderLayers() {
    const { data } = this.state;
    const { iconAtlas, iconMapping, sizeScale } = this.props;

    return new IconLayer(
      this.getSubLayerProps({
        id: 'icon',
        data,
        iconAtlas,
        iconMapping,
        sizeScale,
        getPosition: d => d.geometry.coordinates,
        getIcon: d => getIconName(d.properties.cluster ? d.properties.point_count : 1),
        getSize: d => getIconSize(d.properties.cluster ? d.properties.point_count : 1)
      })
    );
  }
}
