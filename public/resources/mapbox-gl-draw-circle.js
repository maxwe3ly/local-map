(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@mapbox/mapbox-gl-draw'), require('@turf/circle'), require('@turf/distance'), require('@turf/helpers')) :
	typeof define === 'function' && define.amd ? define(['exports', '@mapbox/mapbox-gl-draw', '@turf/circle', '@turf/distance', '@turf/helpers'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["mapbox-gl-draw-circle"] = {}, global.MapboxDraw, global.turf.circle, global.turf.distance, global.turf.helpers));
})(this, (function (exports, require$$0, require$$3, require$$5, require$$6) { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var constants;
	var hasRequiredConstants;
	function requireConstants() {
	  if (hasRequiredConstants) return constants;
	  hasRequiredConstants = 1;
	  constants = {
	    classes: {
	      CONTROL_BASE: 'mapboxgl-ctrl',
	      CONTROL_PREFIX: 'mapboxgl-ctrl-',
	      CONTROL_BUTTON: 'mapbox-gl-draw_ctrl-draw-btn',
	      CONTROL_BUTTON_LINE: 'mapbox-gl-draw_line',
	      CONTROL_BUTTON_POLYGON: 'mapbox-gl-draw_polygon',
	      CONTROL_BUTTON_POINT: 'mapbox-gl-draw_point',
	      CONTROL_BUTTON_TRASH: 'mapbox-gl-draw_trash',
	      CONTROL_BUTTON_COMBINE_FEATURES: 'mapbox-gl-draw_combine',
	      CONTROL_BUTTON_UNCOMBINE_FEATURES: 'mapbox-gl-draw_uncombine',
	      CONTROL_GROUP: 'mapboxgl-ctrl-group',
	      ATTRIBUTION: 'mapboxgl-ctrl-attrib',
	      ACTIVE_BUTTON: 'active',
	      BOX_SELECT: 'mapbox-gl-draw_boxselect'
	    },
	    sources: {
	      HOT: 'mapbox-gl-draw-hot',
	      COLD: 'mapbox-gl-draw-cold'
	    },
	    cursors: {
	      ADD: 'add',
	      MOVE: 'move',
	      DRAG: 'drag',
	      POINTER: 'pointer',
	      NONE: 'none'
	    },
	    types: {
	      POLYGON: 'polygon',
	      LINE: 'line_string',
	      POINT: 'point'
	    },
	    geojsonTypes: {
	      FEATURE: 'Feature',
	      POLYGON: 'Polygon',
	      LINE_STRING: 'LineString',
	      POINT: 'Point',
	      FEATURE_COLLECTION: 'FeatureCollection',
	      MULTI_PREFIX: 'Multi',
	      MULTI_POINT: 'MultiPoint',
	      MULTI_LINE_STRING: 'MultiLineString',
	      MULTI_POLYGON: 'MultiPolygon'
	    },
	    modes: {
	      DRAW_LINE_STRING: 'draw_line_string',
	      DRAW_POLYGON: 'draw_polygon',
	      DRAW_POINT: 'draw_point',
	      SIMPLE_SELECT: 'simple_select',
	      DIRECT_SELECT: 'direct_select',
	      STATIC: 'static'
	    },
	    events: {
	      CREATE: 'draw.create',
	      DELETE: 'draw.delete',
	      UPDATE: 'draw.update',
	      SELECTION_CHANGE: 'draw.selectionchange',
	      MODE_CHANGE: 'draw.modechange',
	      ACTIONABLE: 'draw.actionable',
	      RENDER: 'draw.render',
	      COMBINE_FEATURES: 'draw.combine',
	      UNCOMBINE_FEATURES: 'draw.uncombine'
	    },
	    updateActions: {
	      MOVE: 'move',
	      CHANGE_COORDINATES: 'change_coordinates'
	    },
	    meta: {
	      FEATURE: 'feature',
	      MIDPOINT: 'midpoint',
	      VERTEX: 'vertex'
	    },
	    activeStates: {
	      ACTIVE: 'true',
	      INACTIVE: 'false'
	    },
	    interactions: ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'],
	    LAT_MIN: -90,
	    LAT_RENDERED_MIN: -85,
	    LAT_MAX: 90,
	    LAT_RENDERED_MAX: 85,
	    LNG_MIN: -270,
	    LNG_MAX: 270
	  };
	  return constants;
	}

	var double_click_zoom;
	var hasRequiredDouble_click_zoom;
	function requireDouble_click_zoom() {
	  if (hasRequiredDouble_click_zoom) return double_click_zoom;
	  hasRequiredDouble_click_zoom = 1;
	  double_click_zoom = {
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
	  return double_click_zoom;
	}

	const MapboxDraw$1 = require$$0;
	const Constants$1 = requireConstants();
	const doubleClickZoom$1 = requireDouble_click_zoom();
	const circle$1 = require$$3.default;
	const CircleMode = {
	  ...MapboxDraw$1.modes.draw_polygon
	};
	const DEFAULT_RADIUS_IN_KM = 2;
	CircleMode.onSetup = function (opts) {
	  const polygon = this.newFeature({
	    type: Constants$1.geojsonTypes.FEATURE,
	    properties: {
	      isCircle: true,
	      center: []
	    },
	    geometry: {
	      type: Constants$1.geojsonTypes.POLYGON,
	      coordinates: [[]]
	    }
	  });
	  this.addFeature(polygon);
	  this.clearSelectedFeatures();
	  doubleClickZoom$1.disable(this);
	  this.updateUIClasses({
	    mouse: Constants$1.cursors.ADD
	  });
	  this.activateUIButton(Constants$1.types.POLYGON);
	  this.setActionableState({
	    trash: true
	  });
	  return {
	    initialRadiusInKm: opts.initialRadiusInKm || DEFAULT_RADIUS_IN_KM,
	    polygon,
	    currentVertexPosition: 0
	  };
	};
	CircleMode.clickAnywhere = function (state, e) {
	  if (state.currentVertexPosition === 0) {
	    state.currentVertexPosition++;
	    const center = [e.lngLat.lng, e.lngLat.lat];
	    const circleFeature = circle$1(center, state.initialRadiusInKm);
	    state.polygon.incomingCoords(circleFeature.geometry.coordinates);
	    state.polygon.properties.center = center;
	    state.polygon.properties.radiusInKm = state.initialRadiusInKm;
	  }
	  return this.changeMode(Constants$1.modes.SIMPLE_SELECT, {
	    featureIds: [state.polygon.id]
	  });
	};

	var drag_pan;
	var hasRequiredDrag_pan;
	function requireDrag_pan() {
	  if (hasRequiredDrag_pan) return drag_pan;
	  hasRequiredDrag_pan = 1;
	  drag_pan = {
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
	  return drag_pan;
	}

	const MapboxDraw = require$$0;
	const Constants = requireConstants();
	const doubleClickZoom = requireDouble_click_zoom();
	const dragPan = requireDrag_pan();
	const circle = require$$3;
	const distance = require$$5;
	const turfHelpers = require$$6;
	const DragCircleMode = {
	  ...MapboxDraw.modes.draw_polygon
	};
	DragCircleMode.onSetup = function (opts) {
	  const polygon = this.newFeature({
	    type: Constants.geojsonTypes.FEATURE,
	    properties: {
	      isCircle: true,
	      center: []
	    },
	    geometry: {
	      type: Constants.geojsonTypes.POLYGON,
	      coordinates: [[]]
	    }
	  });
	  this.addFeature(polygon);
	  this.clearSelectedFeatures();
	  doubleClickZoom.disable(this);
	  dragPan.disable(this);
	  this.updateUIClasses({
	    mouse: Constants.cursors.ADD
	  });
	  this.activateUIButton(Constants.types.POLYGON);
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
	    const distanceInKm = distance(turfHelpers.point(center), turfHelpers.point([e.lngLat.lng, e.lngLat.lat]), {
	      units: 'kilometers'
	    });
	    const circleFeature = circle(center, distanceInKm);
	    state.polygon.incomingCoords(circleFeature.geometry.coordinates);
	    state.polygon.properties.radiusInKm = distanceInKm;
	  }
	};
	DragCircleMode.onMouseUp = DragCircleMode.onTouchEnd = function (state, e) {
	  dragPan.enable(this);
	  return this.changeMode(Constants.modes.SIMPLE_SELECT, {
	    featureIds: [state.polygon.id]
	  });
	};
	DragCircleMode.onClick = DragCircleMode.onTap = function (state, e) {
	  // don't draw the circle if its a tap or click event
	  state.polygon.properties.center = [];
	};
	DragCircleMode.toDisplayFeatures = function (state, geojson, display) {
	  const isActivePolygon = geojson.properties.id === state.polygon.id;
	  geojson.properties.active = isActivePolygon ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
	  return display(geojson);
	};

	var create_vertex;
	var hasRequiredCreate_vertex;
	function requireCreate_vertex() {
	  if (hasRequiredCreate_vertex) return create_vertex;
	  hasRequiredCreate_vertex = 1;
	  const Constants = requireConstants();

	  /**
	   * Returns GeoJSON for a Point representing the
	   * vertex of another feature.
	   *
	   * @param {string} parentId
	   * @param {Array<number>} coordinates
	   * @param {string} path - Dot-separated numbers indicating exactly
	   *   where the point exists within its parent feature's coordinates.
	   * @param {boolean} selected
	   * @return {GeoJSON} Point
	   */
	  create_vertex = function (parentId, coordinates, path, selected) {
	    return {
	      type: Constants.geojsonTypes.FEATURE,
	      properties: {
	        meta: Constants.meta.VERTEX,
	        parent: parentId,
	        coord_path: path,
	        active: selected ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE
	      },
	      geometry: {
	        type: Constants.geojsonTypes.POINT,
	        coordinates: coordinates
	      }
	    };
	  };
	  return create_vertex;
	}

	var create_midpoint;
	var hasRequiredCreate_midpoint;
	function requireCreate_midpoint() {
	  if (hasRequiredCreate_midpoint) return create_midpoint;
	  hasRequiredCreate_midpoint = 1;
	  const Constants = requireConstants();
	  create_midpoint = function (parent, startVertex, endVertex, map) {
	    const startCoord = startVertex.geometry.coordinates;
	    const endCoord = endVertex.geometry.coordinates;

	    // If a coordinate exceeds the projection, we can't calculate a midpoint,
	    // so run away
	    if (startCoord[1] > Constants.LAT_RENDERED_MAX || startCoord[1] < Constants.LAT_RENDERED_MIN || endCoord[1] > Constants.LAT_RENDERED_MAX || endCoord[1] < Constants.LAT_RENDERED_MIN) {
	      return null;
	    }
	    const ptA = map.project([startCoord[0], startCoord[1]]);
	    const ptB = map.project([endCoord[0], endCoord[1]]);
	    const mid = map.unproject([(ptA.x + ptB.x) / 2, (ptA.y + ptB.y) / 2]);
	    return {
	      type: Constants.geojsonTypes.FEATURE,
	      properties: {
	        meta: Constants.meta.MIDPOINT,
	        parent: parent,
	        lng: mid.lng,
	        lat: mid.lat,
	        coord_path: endVertex.properties.coord_path
	      },
	      geometry: {
	        type: Constants.geojsonTypes.POINT,
	        coordinates: [mid.lng, mid.lat]
	      }
	    };
	  };
	  return create_midpoint;
	}

	var create_supplementary_points;
	var hasRequiredCreate_supplementary_points;
	function requireCreate_supplementary_points() {
	  if (hasRequiredCreate_supplementary_points) return create_supplementary_points;
	  hasRequiredCreate_supplementary_points = 1;
	  const createVertex = requireCreate_vertex();
	  const createMidpoint = requireCreate_midpoint();
	  const Constants = requireConstants();
	  function createSupplementaryPoints(geojson, options = {}, basePath = null) {
	    const {
	      type,
	      coordinates
	    } = geojson.geometry;
	    const featureId = geojson.properties && geojson.properties.id;
	    let supplementaryPoints = [];
	    if (type === Constants.geojsonTypes.POINT) {
	      // For points, just create a vertex
	      supplementaryPoints.push(createVertex(featureId, coordinates, basePath, isSelectedPath(basePath)));
	    } else if (type === Constants.geojsonTypes.POLYGON) {
	      // Cycle through a Polygon's rings and
	      // process each line
	      coordinates.forEach((line, lineIndex) => {
	        processLine(line, basePath !== null ? `${basePath}.${lineIndex}` : String(lineIndex));
	      });
	    } else if (type === Constants.geojsonTypes.LINE_STRING) {
	      processLine(coordinates, basePath);
	    } else if (type.indexOf(Constants.geojsonTypes.MULTI_PREFIX) === 0) {
	      processMultiGeometry();
	    }
	    function processLine(line, lineBasePath) {
	      let firstPointString = '';
	      let lastVertex = null;
	      line.forEach((point, pointIndex) => {
	        const pointPath = lineBasePath !== undefined && lineBasePath !== null ? `${lineBasePath}.${pointIndex}` : String(pointIndex);
	        const vertex = createVertex(featureId, point, pointPath, isSelectedPath(pointPath));

	        // If we're creating midpoints, check if there was a
	        // vertex before this one. If so, add a midpoint
	        // between that vertex and this one.
	        if (options.midpoints && lastVertex) {
	          const midpoint = createMidpoint(featureId, lastVertex, vertex, options.map);
	          if (midpoint) {
	            supplementaryPoints.push(midpoint);
	          }
	        }
	        lastVertex = vertex;

	        // A Polygon line's last point is the same as the first point. If we're on the last
	        // point, we want to draw a midpoint before it but not another vertex on it
	        // (since we already a vertex there, from the first point).
	        const stringifiedPoint = JSON.stringify(point);
	        if (firstPointString !== stringifiedPoint) {
	          supplementaryPoints.push(vertex);
	        }
	        if (pointIndex === 0) {
	          firstPointString = stringifiedPoint;
	        }
	      });
	    }
	    function isSelectedPath(path) {
	      if (!options.selectedPaths) return false;
	      return options.selectedPaths.indexOf(path) !== -1;
	    }

	    // Split a multi-geometry into constituent
	    // geometries, and accumulate the supplementary points
	    // for each of those constituents
	    function processMultiGeometry() {
	      const subType = type.replace(Constants.geojsonTypes.MULTI_PREFIX, '');
	      coordinates.forEach((subCoordinates, index) => {
	        const subFeature = {
	          type: Constants.geojsonTypes.FEATURE,
	          properties: geojson.properties,
	          geometry: {
	            type: subType,
	            coordinates: subCoordinates
	          }
	        };
	        supplementaryPoints = supplementaryPoints.concat(createSupplementaryPoints(subFeature, options, index));
	      });
	    }
	    return supplementaryPoints;
	  }
	  create_supplementary_points = createSupplementaryPoints;
	  return create_supplementary_points;
	}

	var geojsonExtent = {exports: {}};

	var geojsonNormalize;
	var hasRequiredGeojsonNormalize;
	function requireGeojsonNormalize() {
	  if (hasRequiredGeojsonNormalize) return geojsonNormalize;
	  hasRequiredGeojsonNormalize = 1;
	  geojsonNormalize = normalize;
	  var types = {
	    Point: 'geometry',
	    MultiPoint: 'geometry',
	    LineString: 'geometry',
	    MultiLineString: 'geometry',
	    Polygon: 'geometry',
	    MultiPolygon: 'geometry',
	    GeometryCollection: 'geometry',
	    Feature: 'feature',
	    FeatureCollection: 'featurecollection'
	  };

	  /**
	   * Normalize a GeoJSON feature into a FeatureCollection.
	   *
	   * @param {object} gj geojson data
	   * @returns {object} normalized geojson data
	   */
	  function normalize(gj) {
	    if (!gj || !gj.type) return null;
	    var type = types[gj.type];
	    if (!type) return null;
	    if (type === 'geometry') {
	      return {
	        type: 'FeatureCollection',
	        features: [{
	          type: 'Feature',
	          properties: {},
	          geometry: gj
	        }]
	      };
	    } else if (type === 'feature') {
	      return {
	        type: 'FeatureCollection',
	        features: [gj]
	      };
	    } else if (type === 'featurecollection') {
	      return gj;
	    }
	  }
	  return geojsonNormalize;
	}

	var dist;
	var hasRequiredDist;
	function requireDist() {
	  if (hasRequiredDist) return dist;
	  hasRequiredDist = 1;
	  dist = function e(t) {
	    switch (t && t.type || null) {
	      case "FeatureCollection":
	        return t.features = t.features.reduce(function (t, r) {
	          return t.concat(e(r));
	        }, []), t;
	      case "Feature":
	        return t.geometry ? e(t.geometry).map(function (e) {
	          var r = {
	            type: "Feature",
	            properties: JSON.parse(JSON.stringify(t.properties)),
	            geometry: e
	          };
	          return void 0 !== t.id && (r.id = t.id), r;
	        }) : t;
	      case "MultiPoint":
	        return t.coordinates.map(function (e) {
	          return {
	            type: "Point",
	            coordinates: e
	          };
	        });
	      case "MultiPolygon":
	        return t.coordinates.map(function (e) {
	          return {
	            type: "Polygon",
	            coordinates: e
	          };
	        });
	      case "MultiLineString":
	        return t.coordinates.map(function (e) {
	          return {
	            type: "LineString",
	            coordinates: e
	          };
	        });
	      case "GeometryCollection":
	        return t.geometries.map(e).reduce(function (e, t) {
	          return e.concat(t);
	        }, []);
	      case "Point":
	      case "Polygon":
	      case "LineString":
	        return [t];
	    }
	  };
	  return dist;
	}

	var flatten;
	var hasRequiredFlatten;
	function requireFlatten() {
	  if (hasRequiredFlatten) return flatten;
	  hasRequiredFlatten = 1;
	  flatten = function flatten(list) {
	    return _flatten(list);
	    function _flatten(list) {
	      if (Array.isArray(list) && list.length && typeof list[0] === 'number') {
	        return [list];
	      }
	      return list.reduce(function (acc, item) {
	        if (Array.isArray(item) && Array.isArray(item[0])) {
	          return acc.concat(_flatten(item));
	        } else {
	          acc.push(item);
	          return acc;
	        }
	      }, []);
	    }
	  };
	  return flatten;
	}

	var geojsonCoords;
	var hasRequiredGeojsonCoords;
	function requireGeojsonCoords() {
	  if (hasRequiredGeojsonCoords) return geojsonCoords;
	  hasRequiredGeojsonCoords = 1;
	  var geojsonNormalize = requireGeojsonNormalize(),
	    geojsonFlatten = requireDist(),
	    flatten = requireFlatten();
	  geojsonCoords = function (_) {
	    if (!_) return [];
	    var normalized = geojsonFlatten(geojsonNormalize(_)),
	      coordinates = [];
	    normalized.features.forEach(function (feature) {
	      if (!feature.geometry) return;
	      coordinates = coordinates.concat(flatten(feature.geometry.coordinates));
	    });
	    return coordinates;
	  };
	  return geojsonCoords;
	}

	var traverse = {exports: {}};

	var hasRequiredTraverse;
	function requireTraverse() {
	  if (hasRequiredTraverse) return traverse.exports;
	  hasRequiredTraverse = 1;
	  var traverse$1 = traverse.exports = function (obj) {
	    return new Traverse(obj);
	  };
	  function Traverse(obj) {
	    this.value = obj;
	  }
	  Traverse.prototype.get = function (ps) {
	    var node = this.value;
	    for (var i = 0; i < ps.length; i++) {
	      var key = ps[i];
	      if (!node || !hasOwnProperty.call(node, key)) {
	        node = undefined;
	        break;
	      }
	      node = node[key];
	    }
	    return node;
	  };
	  Traverse.prototype.has = function (ps) {
	    var node = this.value;
	    for (var i = 0; i < ps.length; i++) {
	      var key = ps[i];
	      if (!node || !hasOwnProperty.call(node, key)) {
	        return false;
	      }
	      node = node[key];
	    }
	    return true;
	  };
	  Traverse.prototype.set = function (ps, value) {
	    var node = this.value;
	    for (var i = 0; i < ps.length - 1; i++) {
	      var key = ps[i];
	      if (!hasOwnProperty.call(node, key)) node[key] = {};
	      node = node[key];
	    }
	    node[ps[i]] = value;
	    return value;
	  };
	  Traverse.prototype.map = function (cb) {
	    return walk(this.value, cb, true);
	  };
	  Traverse.prototype.forEach = function (cb) {
	    this.value = walk(this.value, cb, false);
	    return this.value;
	  };
	  Traverse.prototype.reduce = function (cb, init) {
	    var skip = arguments.length === 1;
	    var acc = skip ? this.value : init;
	    this.forEach(function (x) {
	      if (!this.isRoot || !skip) {
	        acc = cb.call(this, acc, x);
	      }
	    });
	    return acc;
	  };
	  Traverse.prototype.paths = function () {
	    var acc = [];
	    this.forEach(function (x) {
	      acc.push(this.path);
	    });
	    return acc;
	  };
	  Traverse.prototype.nodes = function () {
	    var acc = [];
	    this.forEach(function (x) {
	      acc.push(this.node);
	    });
	    return acc;
	  };
	  Traverse.prototype.clone = function () {
	    var parents = [],
	      nodes = [];
	    return function clone(src) {
	      for (var i = 0; i < parents.length; i++) {
	        if (parents[i] === src) {
	          return nodes[i];
	        }
	      }
	      if (typeof src === 'object' && src !== null) {
	        var dst = copy(src);
	        parents.push(src);
	        nodes.push(dst);
	        forEach(objectKeys(src), function (key) {
	          dst[key] = clone(src[key]);
	        });
	        parents.pop();
	        nodes.pop();
	        return dst;
	      } else {
	        return src;
	      }
	    }(this.value);
	  };
	  function walk(root, cb, immutable) {
	    var path = [];
	    var parents = [];
	    var alive = true;
	    return function walker(node_) {
	      var node = immutable ? copy(node_) : node_;
	      var modifiers = {};
	      var keepGoing = true;
	      var state = {
	        node: node,
	        node_: node_,
	        path: [].concat(path),
	        parent: parents[parents.length - 1],
	        parents: parents,
	        key: path.slice(-1)[0],
	        isRoot: path.length === 0,
	        level: path.length,
	        circular: null,
	        update: function (x, stopHere) {
	          if (!state.isRoot) {
	            state.parent.node[state.key] = x;
	          }
	          state.node = x;
	          if (stopHere) keepGoing = false;
	        },
	        'delete': function (stopHere) {
	          delete state.parent.node[state.key];
	          if (stopHere) keepGoing = false;
	        },
	        remove: function (stopHere) {
	          if (isArray(state.parent.node)) {
	            state.parent.node.splice(state.key, 1);
	          } else {
	            delete state.parent.node[state.key];
	          }
	          if (stopHere) keepGoing = false;
	        },
	        keys: null,
	        before: function (f) {
	          modifiers.before = f;
	        },
	        after: function (f) {
	          modifiers.after = f;
	        },
	        pre: function (f) {
	          modifiers.pre = f;
	        },
	        post: function (f) {
	          modifiers.post = f;
	        },
	        stop: function () {
	          alive = false;
	        },
	        block: function () {
	          keepGoing = false;
	        }
	      };
	      if (!alive) return state;
	      function updateState() {
	        if (typeof state.node === 'object' && state.node !== null) {
	          if (!state.keys || state.node_ !== state.node) {
	            state.keys = objectKeys(state.node);
	          }
	          state.isLeaf = state.keys.length == 0;
	          for (var i = 0; i < parents.length; i++) {
	            if (parents[i].node_ === node_) {
	              state.circular = parents[i];
	              break;
	            }
	          }
	        } else {
	          state.isLeaf = true;
	          state.keys = null;
	        }
	        state.notLeaf = !state.isLeaf;
	        state.notRoot = !state.isRoot;
	      }
	      updateState();

	      // use return values to update if defined
	      var ret = cb.call(state, state.node);
	      if (ret !== undefined && state.update) state.update(ret);
	      if (modifiers.before) modifiers.before.call(state, state.node);
	      if (!keepGoing) return state;
	      if (typeof state.node == 'object' && state.node !== null && !state.circular) {
	        parents.push(state);
	        updateState();
	        forEach(state.keys, function (key, i) {
	          path.push(key);
	          if (modifiers.pre) modifiers.pre.call(state, state.node[key], key);
	          var child = walker(state.node[key]);
	          if (immutable && hasOwnProperty.call(state.node, key)) {
	            state.node[key] = child.node;
	          }
	          child.isLast = i == state.keys.length - 1;
	          child.isFirst = i == 0;
	          if (modifiers.post) modifiers.post.call(state, child);
	          path.pop();
	        });
	        parents.pop();
	      }
	      if (modifiers.after) modifiers.after.call(state, state.node);
	      return state;
	    }(root).node;
	  }
	  function copy(src) {
	    if (typeof src === 'object' && src !== null) {
	      var dst;
	      if (isArray(src)) {
	        dst = [];
	      } else if (isDate(src)) {
	        dst = new Date(src.getTime ? src.getTime() : src);
	      } else if (isRegExp(src)) {
	        dst = new RegExp(src);
	      } else if (isError(src)) {
	        dst = {
	          message: src.message
	        };
	      } else if (isBoolean(src)) {
	        dst = new Boolean(src);
	      } else if (isNumber(src)) {
	        dst = new Number(src);
	      } else if (isString(src)) {
	        dst = new String(src);
	      } else if (Object.create && Object.getPrototypeOf) {
	        dst = Object.create(Object.getPrototypeOf(src));
	      } else if (src.constructor === Object) {
	        dst = {};
	      } else {
	        var proto = src.constructor && src.constructor.prototype || src.__proto__ || {};
	        var T = function () {};
	        T.prototype = proto;
	        dst = new T();
	      }
	      forEach(objectKeys(src), function (key) {
	        dst[key] = src[key];
	      });
	      return dst;
	    } else return src;
	  }
	  var objectKeys = Object.keys || function keys(obj) {
	    var res = [];
	    for (var key in obj) res.push(key);
	    return res;
	  };
	  function toS(obj) {
	    return Object.prototype.toString.call(obj);
	  }
	  function isDate(obj) {
	    return toS(obj) === '[object Date]';
	  }
	  function isRegExp(obj) {
	    return toS(obj) === '[object RegExp]';
	  }
	  function isError(obj) {
	    return toS(obj) === '[object Error]';
	  }
	  function isBoolean(obj) {
	    return toS(obj) === '[object Boolean]';
	  }
	  function isNumber(obj) {
	    return toS(obj) === '[object Number]';
	  }
	  function isString(obj) {
	    return toS(obj) === '[object String]';
	  }
	  var isArray = Array.isArray || function isArray(xs) {
	    return Object.prototype.toString.call(xs) === '[object Array]';
	  };
	  var forEach = function (xs, fn) {
	    if (xs.forEach) return xs.forEach(fn);else for (var i = 0; i < xs.length; i++) {
	      fn(xs[i], i, xs);
	    }
	  };
	  forEach(objectKeys(Traverse.prototype), function (key) {
	    traverse$1[key] = function (obj) {
	      var args = [].slice.call(arguments, 1);
	      var t = new Traverse(obj);
	      return t[key].apply(t, args);
	    };
	  });
	  var hasOwnProperty = Object.hasOwnProperty || function (obj, key) {
	    return key in obj;
	  };
	  return traverse.exports;
	}

	var extent;
	var hasRequiredExtent;
	function requireExtent() {
	  if (hasRequiredExtent) return extent;
	  hasRequiredExtent = 1;
	  extent = Extent;
	  function Extent(bbox) {
	    if (!(this instanceof Extent)) {
	      return new Extent(bbox);
	    }
	    this._bbox = bbox || [Infinity, Infinity, -Infinity, -Infinity];
	    this._valid = !!bbox;
	  }
	  Extent.prototype.include = function (ll) {
	    this._valid = true;
	    this._bbox[0] = Math.min(this._bbox[0], ll[0]);
	    this._bbox[1] = Math.min(this._bbox[1], ll[1]);
	    this._bbox[2] = Math.max(this._bbox[2], ll[0]);
	    this._bbox[3] = Math.max(this._bbox[3], ll[1]);
	    return this;
	  };
	  Extent.prototype.equals = function (_) {
	    var other;
	    if (_ instanceof Extent) {
	      other = _.bbox();
	    } else {
	      other = _;
	    }
	    return this._bbox[0] == other[0] && this._bbox[1] == other[1] && this._bbox[2] == other[2] && this._bbox[3] == other[3];
	  };
	  Extent.prototype.center = function (_) {
	    if (!this._valid) return null;
	    return [(this._bbox[0] + this._bbox[2]) / 2, (this._bbox[1] + this._bbox[3]) / 2];
	  };
	  Extent.prototype.union = function (_) {
	    this._valid = true;
	    var other;
	    if (_ instanceof Extent) {
	      other = _.bbox();
	    } else {
	      other = _;
	    }
	    this._bbox[0] = Math.min(this._bbox[0], other[0]);
	    this._bbox[1] = Math.min(this._bbox[1], other[1]);
	    this._bbox[2] = Math.max(this._bbox[2], other[2]);
	    this._bbox[3] = Math.max(this._bbox[3], other[3]);
	    return this;
	  };
	  Extent.prototype.bbox = function () {
	    if (!this._valid) return null;
	    return this._bbox;
	  };
	  Extent.prototype.contains = function (ll) {
	    if (!ll) return this._fastContains();
	    if (!this._valid) return null;
	    var lon = ll[0],
	      lat = ll[1];
	    return this._bbox[0] <= lon && this._bbox[1] <= lat && this._bbox[2] >= lon && this._bbox[3] >= lat;
	  };
	  Extent.prototype.intersect = function (_) {
	    if (!this._valid) return null;
	    var other;
	    if (_ instanceof Extent) {
	      other = _.bbox();
	    } else {
	      other = _;
	    }
	    return !(this._bbox[0] > other[2] || this._bbox[2] < other[0] || this._bbox[3] < other[1] || this._bbox[1] > other[3]);
	  };
	  Extent.prototype._fastContains = function () {
	    if (!this._valid) return new Function('return null;');
	    var body = 'return ' + this._bbox[0] + '<= ll[0] &&' + this._bbox[1] + '<= ll[1] &&' + this._bbox[2] + '>= ll[0] &&' + this._bbox[3] + '>= ll[1]';
	    return new Function('ll', body);
	  };
	  Extent.prototype.polygon = function () {
	    if (!this._valid) return null;
	    return {
	      type: 'Polygon',
	      coordinates: [[
	      // W, S
	      [this._bbox[0], this._bbox[1]],
	      // E, S
	      [this._bbox[2], this._bbox[1]],
	      // E, N
	      [this._bbox[2], this._bbox[3]],
	      // W, N
	      [this._bbox[0], this._bbox[3]],
	      // W, S
	      [this._bbox[0], this._bbox[1]]]]
	    };
	  };
	  return extent;
	}

	var hasRequiredGeojsonExtent;
	function requireGeojsonExtent() {
	  if (hasRequiredGeojsonExtent) return geojsonExtent.exports;
	  hasRequiredGeojsonExtent = 1;
	  var geojsonCoords = requireGeojsonCoords(),
	    traverse = requireTraverse(),
	    extent = requireExtent();
	  var geojsonTypesByDataAttributes = {
	    features: ['FeatureCollection'],
	    coordinates: ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'],
	    geometry: ['Feature'],
	    geometries: ['GeometryCollection']
	  };
	  var dataAttributes = Object.keys(geojsonTypesByDataAttributes);
	  geojsonExtent.exports = function (_) {
	    return getExtent(_).bbox();
	  };
	  geojsonExtent.exports.polygon = function (_) {
	    return getExtent(_).polygon();
	  };
	  geojsonExtent.exports.bboxify = function (_) {
	    return traverse(_).map(function (value) {
	      if (!value) return;
	      var isValid = dataAttributes.some(function (attribute) {
	        if (value[attribute]) {
	          return geojsonTypesByDataAttributes[attribute].indexOf(value.type) !== -1;
	        }
	        return false;
	      });
	      if (isValid) {
	        value.bbox = getExtent(value).bbox();
	        this.update(value);
	      }
	    });
	  };
	  function getExtent(_) {
	    var ext = extent(),
	      coords = geojsonCoords(_);
	    for (var i = 0; i < coords.length; i++) ext.include(coords[i]);
	    return ext;
	  }
	  return geojsonExtent.exports;
	}

	var constrain_feature_movement;
	var hasRequiredConstrain_feature_movement;
	function requireConstrain_feature_movement() {
	  if (hasRequiredConstrain_feature_movement) return constrain_feature_movement;
	  hasRequiredConstrain_feature_movement = 1;
	  const extent = requireGeojsonExtent();
	  const Constants = requireConstants();
	  const {
	    LAT_MIN,
	    LAT_MAX,
	    LAT_RENDERED_MIN,
	    LAT_RENDERED_MAX,
	    LNG_MIN,
	    LNG_MAX
	  } = Constants;

	  // Ensure that we do not drag north-south far enough for
	  // - any part of any feature to exceed the poles
	  // - any feature to be completely lost in the space between the projection's
	  //   edge and the poles, such that it couldn't be re-selected and moved back
	  constrain_feature_movement = function (geojsonFeatures, delta) {
	    // "inner edge" = a feature's latitude closest to the equator
	    let northInnerEdge = LAT_MIN;
	    let southInnerEdge = LAT_MAX;
	    // "outer edge" = a feature's latitude furthest from the equator
	    let northOuterEdge = LAT_MIN;
	    let southOuterEdge = LAT_MAX;
	    let westEdge = LNG_MAX;
	    let eastEdge = LNG_MIN;
	    geojsonFeatures.forEach(feature => {
	      const bounds = extent(feature);
	      const featureSouthEdge = bounds[1];
	      const featureNorthEdge = bounds[3];
	      const featureWestEdge = bounds[0];
	      const featureEastEdge = bounds[2];
	      if (featureSouthEdge > northInnerEdge) northInnerEdge = featureSouthEdge;
	      if (featureNorthEdge < southInnerEdge) southInnerEdge = featureNorthEdge;
	      if (featureNorthEdge > northOuterEdge) northOuterEdge = featureNorthEdge;
	      if (featureSouthEdge < southOuterEdge) southOuterEdge = featureSouthEdge;
	      if (featureWestEdge < westEdge) westEdge = featureWestEdge;
	      if (featureEastEdge > eastEdge) eastEdge = featureEastEdge;
	    });

	    // These changes are not mutually exclusive: we might hit the inner
	    // edge but also have hit the outer edge and therefore need
	    // another readjustment
	    const constrainedDelta = delta;
	    if (northInnerEdge + constrainedDelta.lat > LAT_RENDERED_MAX) {
	      constrainedDelta.lat = LAT_RENDERED_MAX - northInnerEdge;
	    }
	    if (northOuterEdge + constrainedDelta.lat > LAT_MAX) {
	      constrainedDelta.lat = LAT_MAX - northOuterEdge;
	    }
	    if (southInnerEdge + constrainedDelta.lat < LAT_RENDERED_MIN) {
	      constrainedDelta.lat = LAT_RENDERED_MIN - southInnerEdge;
	    }
	    if (southOuterEdge + constrainedDelta.lat < LAT_MIN) {
	      constrainedDelta.lat = LAT_MIN - southOuterEdge;
	    }
	    if (westEdge + constrainedDelta.lng <= LNG_MIN) {
	      constrainedDelta.lng += Math.ceil(Math.abs(constrainedDelta.lng) / 360) * 360;
	    }
	    if (eastEdge + constrainedDelta.lng >= LNG_MAX) {
	      constrainedDelta.lng -= Math.ceil(Math.abs(constrainedDelta.lng) / 360) * 360;
	    }
	    return constrainedDelta;
	  };
	  return constrain_feature_movement;
	}

	var move_features;
	var hasRequiredMove_features;
	function requireMove_features() {
	  if (hasRequiredMove_features) return move_features;
	  hasRequiredMove_features = 1;
	  const constrainFeatureMovement = requireConstrain_feature_movement();
	  const Constants = requireConstants();
	  move_features = function (features, delta) {
	    const constrainedDelta = constrainFeatureMovement(features.map(feature => feature.toGeoJSON()), delta);
	    features.forEach(feature => {
	      const currentCoordinates = feature.getCoordinates();
	      const moveCoordinate = coord => {
	        const point = {
	          lng: coord[0] + constrainedDelta.lng,
	          lat: coord[1] + constrainedDelta.lat
	        };
	        return [point.lng, point.lat];
	      };
	      const moveRing = ring => ring.map(coord => moveCoordinate(coord));
	      const moveMultiPolygon = multi => multi.map(ring => moveRing(ring));
	      let nextCoordinates;
	      if (feature.type === Constants.geojsonTypes.POINT) {
	        nextCoordinates = moveCoordinate(currentCoordinates);
	      } else if (feature.type === Constants.geojsonTypes.LINE_STRING || feature.type === Constants.geojsonTypes.MULTI_POINT) {
	        nextCoordinates = currentCoordinates.map(moveCoordinate);
	      } else if (feature.type === Constants.geojsonTypes.POLYGON || feature.type === Constants.geojsonTypes.MULTI_LINE_STRING) {
	        nextCoordinates = currentCoordinates.map(moveRing);
	      } else if (feature.type === Constants.geojsonTypes.MULTI_POLYGON) {
	        nextCoordinates = currentCoordinates.map(moveMultiPolygon);
	      }
	      feature.incomingCoords(nextCoordinates);
	    });
	  };
	  return move_features;
	}

	var create_supplementary_points_circle;
	var hasRequiredCreate_supplementary_points_circle;
	function requireCreate_supplementary_points_circle() {
	  if (hasRequiredCreate_supplementary_points_circle) return create_supplementary_points_circle;
	  hasRequiredCreate_supplementary_points_circle = 1;
	  const createVertex = requireCreate_vertex();
	  function createSupplementaryPointsForCircle(geojson) {
	    const {
	      properties,
	      geometry
	    } = geojson;
	    if (!properties.user_isCircle) return null;
	    const supplementaryPoints = [];
	    const vertices = geometry.coordinates[0].slice(0, -1);
	    for (let index = 0; index < vertices.length; index += Math.round(vertices.length / 4)) {
	      supplementaryPoints.push(createVertex(properties.id, vertices[index], `0.${index}`, false));
	    }
	    return supplementaryPoints;
	  }
	  create_supplementary_points_circle = createSupplementaryPointsForCircle;
	  return create_supplementary_points_circle;
	}

	var DirectModeOverride_1;
	var hasRequiredDirectModeOverride;
	function requireDirectModeOverride() {
	  if (hasRequiredDirectModeOverride) return DirectModeOverride_1;
	  hasRequiredDirectModeOverride = 1;
	  const MapboxDraw = require$$0;
	  const createSupplementaryPoints = requireCreate_supplementary_points();
	  const moveFeatures = requireMove_features();
	  const Constants = requireConstants();
	  const constrainFeatureMovement = requireConstrain_feature_movement();
	  const distance = require$$5;
	  const turfHelpers = require$$6;
	  const circle = require$$3;
	  const createSupplementaryPointsForCircle = requireCreate_supplementary_points_circle();
	  const DirectModeOverride = MapboxDraw.modes.direct_select;
	  DirectModeOverride.dragFeature = function (state, e, delta) {
	    moveFeatures(this.getSelected(), delta);
	    this.getSelected().filter(feature => feature.properties.isCircle).map(circle => circle.properties.center).forEach(center => {
	      center[0] += delta.lng;
	      center[1] += delta.lat;
	    });
	    state.dragMoveLocation = e.lngLat;
	  };
	  DirectModeOverride.dragVertex = function (state, e, delta) {
	    if (state.feature.properties.isCircle) {
	      const center = state.feature.properties.center;
	      const movedVertex = [e.lngLat.lng, e.lngLat.lat];
	      const radius = distance(turfHelpers.point(center), turfHelpers.point(movedVertex), {
	        units: 'kilometers'
	      });
	      const circleFeature = circle(center, radius);
	      state.feature.incomingCoords(circleFeature.geometry.coordinates);
	      state.feature.properties.radiusInKm = radius;
	    } else {
	      const selectedCoords = state.selectedCoordPaths.map(coord_path => state.feature.getCoordinate(coord_path));
	      const selectedCoordPoints = selectedCoords.map(coords => ({
	        type: Constants.geojsonTypes.FEATURE,
	        properties: {},
	        geometry: {
	          type: Constants.geojsonTypes.POINT,
	          coordinates: coords
	        }
	      }));
	      const constrainedDelta = constrainFeatureMovement(selectedCoordPoints, delta);
	      for (let i = 0; i < selectedCoords.length; i++) {
	        const coord = selectedCoords[i];
	        state.feature.updateCoordinate(state.selectedCoordPaths[i], coord[0] + constrainedDelta.lng, coord[1] + constrainedDelta.lat);
	      }
	    }
	  };
	  DirectModeOverride.toDisplayFeatures = function (state, geojson, push) {
	    if (state.featureId === geojson.properties.id) {
	      geojson.properties.active = Constants.activeStates.ACTIVE;
	      push(geojson);
	      const supplementaryPoints = geojson.properties.user_isCircle ? createSupplementaryPointsForCircle(geojson) : createSupplementaryPoints(geojson, {
	        map: this.map,
	        midpoints: true,
	        selectedPaths: state.selectedCoordPaths
	      });
	      supplementaryPoints.forEach(push);
	    } else {
	      geojson.properties.active = Constants.activeStates.INACTIVE;
	      push(geojson);
	    }
	    this.fireActionable(state);
	  };
	  DirectModeOverride_1 = DirectModeOverride;
	  return DirectModeOverride_1;
	}

	var DirectModeOverrideExports = requireDirectModeOverride();
	var DirectModeOverride = /*@__PURE__*/getDefaultExportFromCjs(DirectModeOverrideExports);

	var SimpleSelectModeOverride_1;
	var hasRequiredSimpleSelectModeOverride;
	function requireSimpleSelectModeOverride() {
	  if (hasRequiredSimpleSelectModeOverride) return SimpleSelectModeOverride_1;
	  hasRequiredSimpleSelectModeOverride = 1;
	  const MapboxDraw = require$$0;
	  const createSupplementaryPoints = requireCreate_supplementary_points();
	  const moveFeatures = requireMove_features();
	  const Constants = requireConstants();
	  const createSupplementaryPointsForCircle = requireCreate_supplementary_points_circle();
	  const SimpleSelectModeOverride = MapboxDraw.modes.simple_select;
	  SimpleSelectModeOverride.dragMove = function (state, e) {
	    // Dragging when drag move is enabled
	    state.dragMoving = true;
	    e.originalEvent.stopPropagation();
	    const delta = {
	      lng: e.lngLat.lng - state.dragMoveLocation.lng,
	      lat: e.lngLat.lat - state.dragMoveLocation.lat
	    };
	    moveFeatures(this.getSelected(), delta);
	    this.getSelected().filter(feature => feature.properties.isCircle).map(circle => circle.properties.center).forEach(center => {
	      center[0] += delta.lng;
	      center[1] += delta.lat;
	    });
	    state.dragMoveLocation = e.lngLat;
	  };
	  SimpleSelectModeOverride.toDisplayFeatures = function (state, geojson, display) {
	    geojson.properties.active = this.isSelected(geojson.properties.id) ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
	    display(geojson);
	    this.fireActionable();
	    if (geojson.properties.active !== Constants.activeStates.ACTIVE || geojson.geometry.type === Constants.geojsonTypes.POINT) return;
	    const supplementaryPoints = geojson.properties.user_isCircle ? createSupplementaryPointsForCircle(geojson) : createSupplementaryPoints(geojson);
	    supplementaryPoints.forEach(display);
	  };
	  SimpleSelectModeOverride_1 = SimpleSelectModeOverride;
	  return SimpleSelectModeOverride_1;
	}

	var SimpleSelectModeOverrideExports = requireSimpleSelectModeOverride();
	var SimpleSelectModeOverride = /*@__PURE__*/getDefaultExportFromCjs(SimpleSelectModeOverrideExports);

	exports.CircleMode = CircleMode;
	exports.DirectMode = DirectModeOverride;
	exports.DragCircleMode = DragCircleMode;
	exports.SimpleSelectMode = SimpleSelectModeOverride;

}));
//# sourceMappingURL=mapbox-gl-draw-circle.umd.js.map
