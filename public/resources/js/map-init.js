function isWebglSupported() {
  if (window.WebGLRenderingContext) {
    const canvas = document.createElement('canvas');
    try {
      const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (context && typeof context.getParameter == 'function') {
        return true;
      }
    } catch (e) {
      // WebGL is supported, but disabled
    }
    return false;
  }
  // WebGL not supported
  return false;
}

function initMap() {

  if (!isWebglSupported()) {
    console.log('请升级浏览器以支持webGL 渲染地图');
  }

  var keyMatch = location.search.match(/[\?\&]key=([^&]+)/i);
  var keyParam = keyMatch ? '?key=' + keyMatch[1] : '';


  maplibregl.setRTLTextPlugin(window.tileserverConfig.publicUrl + 'mapbox-gl-rtl-text.js' + keyParam, true);
  window.map = {};
  var map = new maplibregl.Map({
    container: 'map',
    style: (window.tileserverConfig.publicUrl || '/') + 'styles/' + window.tileserverConfig.id + '/style.json' + keyParam,
    hash: true,
    maxPitch: 85,
    attributionControl: false,
  });
  window.map.instance = map;
  return map;
}