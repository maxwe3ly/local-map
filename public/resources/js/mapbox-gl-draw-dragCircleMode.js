const doubleClickZoom = {
  enable(ctx) {
    setTimeout(() => {
      // First check we've got a map and some context.
      if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return;
      // Now check initial state wasn't false (we leave it disabled if so)
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom')) return;
      ctx.map.doubleClickZoom.enable();
    }, 0);
  },
  disable(ctx) {
    setTimeout(() => {
      if (!ctx.map || !ctx.map.doubleClickZoom) return;
      // Always disable here, as it's necessary in some cases.
      ctx.map.doubleClickZoom.disable();
    }, 0);
  }
};
const dragPan = {
    enable(ctx) {
        setTimeout(() => {
            // First check we've got a map and some context.
            if (!ctx.map || !ctx.map.dragPan || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue) return;
            // Now check initial state wasn't false (we leave it disabled if so)
            if (!ctx._ctx.store.getInitialConfigValue('dragPan')) return;
            ctx.map.dragPan.enable();
        }, 0);
    },
    disable(ctx) {
        setTimeout(() => {
            if (!ctx.map || !ctx.map.doubleClickZoom) return;
            // Always disable here, as it's necessary in some cases.
            ctx.map.dragPan.disable();
        }, 0);
    }
};

const DragCircleMode = {...window.MapboxDraw.modes.draw_polygon};

DragCircleMode.onSetup = function(opts) {
  const polygon = this.newFeature({
    type: 'Feature',
    properties: {
      isCircle: true,
      center: []
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[]]
    }
  });

  this.addFeature(polygon);

  this.clearSelectedFeatures();
  doubleClickZoom.disable(this);
  dragPan.disable(this);
  this.updateUIClasses({ mouse: 'add' });
  this.activateUIButton('polygon');
  this.setActionableState({
    trash: true
  });

  return {
    polygon,
    currentVertexPosition: 0
  };
};

DragCircleMode.onMouseDown = DragCircleMode.onTouchStart = function (state, e) {
  const currentCenter = state.polygon.properties.center;
  if (currentCenter.length === 0) {
    state.polygon.properties.center = [e.lngLat.lng, e.lngLat.lat];
  }
};

DragCircleMode.onDrag = DragCircleMode.onMouseMove = function (state, e) {
  const center = state.polygon.properties.center;
  if (center.length > 0) {
    const distanceInKm = window.turf.distance(
      window.turf.point(center),
      window.turf.point([e.lngLat.lng, e.lngLat.lat]),
      { units : 'kilometers'});
    const circleFeature = window.turf.circle(center, distanceInKm);
    state.polygon.incomingCoords(circleFeature.geometry.coordinates);
    state.polygon.properties.radiusInKm = distanceInKm;
  }
};

DragCircleMode.onMouseUp = DragCircleMode.onTouchEnd = function (state, e) {
  dragPan.enable(this);
  return this.changeMode('simple_select', { featureIds: [state.polygon.id] });
};

DragCircleMode.onClick = DragCircleMode.onTap = function (state, e) {
  // don't draw the circle if its a tap or click event
  state.polygon.properties.center = [];
};

DragCircleMode.toDisplayFeatures = function(state, geojson, display) {
  const isActivePolygon = geojson.properties.id === state.polygon.id;
  geojson.properties.active = (isActivePolygon) ? 'true' : 'false';
  return display(geojson);
};
