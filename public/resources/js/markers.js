// MarkerManager 类 - 全局管理所有 markers
class MarkerManager {
  constructor(map) {
    this.map = map;
    this.markers = [];
    this.listeners = {}; // 事件监听器
    this.markerIdCounter = 0; // 添加计数器用于生成唯一 id

    // 初始化图片标记相关元素
    this.initImageMarkerElements();

    // TODO: 业务代码加入后删除
    this.initImageMarkerSelectEvent();

    // 监听 Geoman 拖拽模式的启用/禁用
    map.on('gm:globaldragmodetoggled', (event) => {
      console.log('拖拽模式切换:', event.enabled);
      this.setDraggable(event.enabled);
    });

    // 监听 Geoman 删除模式的启用/禁用
    map.on('gm:globaldeletemodetoggled', (event) => {
      console.log('删除模式切换:', event.enabled);
      this.setRemovalMode(event.enabled);
    });

    this.on('click', (marker) => {
      console.log('点击事件:', marker);
    });
  }

  // 生成唯一的 marker id
  generateMarkerId() {
    return `feature-custom-marker-${++this.markerIdCounter}`;
  }

  // 初始化图片标记相关元素
  initImageMarkerElements() {
    // 创建悬浮图片元素
    this.floatingImage = document.createElement('img');
    this.floatingImage.className = 'floating-image';
    document.body.appendChild(this.floatingImage);

    // 监听地图点击事件，放置图片
    this.map.on('click', (e) => {
      if (this.selectedImageUrl && this.floatingImage.style.display === 'block') {
        // 用户已选中图片，创建 marker
        this.createImageMarker(e.lngLat, this.selectedImageUrl);

        console.log('添加图片标记，坐标:', e.lngLat.lng, e.lngLat.lat, '图片:', this.selectedImageUrl);

        // 重置选择器
        this.imageSelector.value = '';

        // 隐藏悬浮图片
        this.floatingImage.style.display = 'none';

        // 禁用鼠标移动跟踪
        document.removeEventListener('mousemove', this.moveFloatingImage.bind(this));

        // 重置选中的图片URL
        this.selectedImageUrl = '';
      }
    });
  }

  // NOTE: 初始化图片选择器事件
  initImageMarkerSelectEvent() {
    // 获取图片选择器
    this.imageSelector = document.getElementById('image-selector');
    // 当前选中的图片URL
    this.selectedImageUrl = '';

    // NOTE: 监听选择器变化
    this.imageSelector.addEventListener('change', () => {
      this.selectedImageUrl = this.imageSelector.value;

      if (this.selectedImageUrl) {
        // 显示悬浮图片
        this.floatingImage.src = this.selectedImageUrl;
        this.floatingImage.style.display = 'block';

        // 启用鼠标移动跟踪
        document.addEventListener('mousemove', this.moveFloatingImage.bind(this));
      } else {
        // 隐藏悬浮图片
        this.floatingImage.style.display = 'none';

        // 禁用鼠标移动跟踪
        document.removeEventListener('mousemove', this.moveFloatingImage.bind(this));
      }
    });
  }

  // 移动悬浮图片函数
  moveFloatingImage(e) {
    this.floatingImage.style.left = e.clientX + 'px';
    this.floatingImage.style.top = e.clientY + 'px';
  }

  // 添加 marker
  addMarker(marker) {
    this.markers.push(marker);
    this._triggerEvent('add', marker);
    return marker;
  }

  // 创建并添加 marker
  createMarker(options) {
    // 如果没有提供 id，则生成一个新的唯一 id
    if (!options.payload || !options.payload.id) {
      if (!options.payload) options.payload = {};
      options.payload.id = this.generateMarkerId();
    }

    // 保存 payload 到 marker 对象中
    const marker = new maplibregl.Marker(options)
      .setLngLat(options.lngLat)
      .addTo(this.map);

    // 将 payload 附加到 marker 对象
    if (options.payload) {
      marker.payload = options.payload;
    }

    // 添加点击事件
    const element = marker.getElement();
    element.addEventListener('click', (e) => {
      // 阻止事件冒泡，避免触发地图点击事件
      e.stopPropagation();

      // 如果不是删除模式，则触发点击事件
      if (!this.map.gm.globalRemovalModeEnabled()) {
        console.log('Marker 点击事件', {
          position: marker.getLngLat(),
          payload: marker.payload
        });

        // 触发自定义点击事件
        this._triggerEvent('click', marker);
      }
    });

    return this.addMarker(marker);
  }

  // 创建自定义图片 marker
  createImageMarker(lngLat, imageUrl, options = {}) {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.style.backgroundImage = `url(${imageUrl})`;
    el.style.width = '36px';
    el.style.height = '36px';
    el.style.backgroundSize = 'contain';

    const markerOptions = {
      element: el,
      draggable: this.map.gm.globalDragModeEnabled(),
      ...options,
      lngLat: lngLat
    };

    return this.createMarker(markerOptions);
  }

  // 从数据创建 Marker
  createMarkerFromData(data) {
    if (data && data.lng !== undefined && data.lat !== undefined && data.imageUrl) {
      const lngLat = {
        lng: data.lng,
        lat: data.lat
      };

      const options = {};

      if (data.id) {
        options.payload = { id: data.id };
      }

      return this.createImageMarker(lngLat, data.imageUrl, options);
    }
    return null;
  }

  // 删除 marker
  removeMarker(marker) {
    const index = this.markers.indexOf(marker);
    if (index > -1) {
      // 记录被删除的 marker 信息
      const lngLat = marker.getLngLat();
      console.log('操作类型: 删除', {
        feature: `Marker at ${lngLat.lng}, ${lngLat.lat}`
      });

      marker.remove(); // 从地图中移除
      this.markers.splice(index, 1); // 从数组中移除
      this._triggerEvent('remove', marker);
      return true;
    }
    return false;
  }

  // 清除所有 markers
  clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    const removedCount = this.markers.length;
    this.markers = [];
    this._triggerEvent('clear', { count: removedCount });
    return removedCount;
  }

  // 获取所有 markers
  getMarkers() {
    return [...this.markers];
  }

  // 查找 marker
  findMarkerByLngLat(lngLat, tolerance = 0.0001) {
    return this.markers.find(marker => {
      const pos = marker.getLngLat();
      return Math.abs(pos.lng - lngLat.lng) < tolerance &&
        Math.abs(pos.lat - lngLat.lat) < tolerance;
    });
  }

  // 根据 id 查找 marker
  findMarkerById(id) {
    return this.markers.find(marker => marker.payload && marker.payload.id === id);
  }

  // 为指定 marker 添加关联的 popup
  updatePopup(id, popup) {
    const marker = this.findMarkerById(id);
    if (marker) {
      // 如果 marker 已有 popup，先移除
      if (marker.getPopup()) {
        marker.getPopup().remove();
      }

      // 添加新的 popup
      if (popup) {
        // 直接使用 setDOMContent 而不是 setHTML
        const mapPopup = new maplibregl.Popup({
          offset: [0, -30],
          closeButton: false,
          closeOnClick: false  // 添加此选项，防止点击地图时自动关闭弹窗
        });
        mapPopup.setDOMContent(popup);
        marker.setPopup(mapPopup);

        // 默认显示 popup
        marker.togglePopup();
      }

      console.log(`为 marker ${id} 更新了 popup`);
      return true;
    }
    console.warn(`未找到 id 为 ${id} 的 marker`);
    return false;
  }

  // 将 Marker 转换为 GeoJSON
  markerToGeoJSON(marker) {
    const el = marker.getElement();
    const lngLat = marker.getLngLat();
    const imageUrl = el.style.backgroundImage.replace(/url\(["']?([^"']*)[""]?\)/g, "$1");

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lngLat.lng, lngLat.lat]
      },
      properties: {
        shape: 'custom_marker',
        imageUrl: imageUrl,
        id: marker.payload && marker.payload.id ? marker.payload.id : this.generateMarkerId()
      },
      id: marker.payload && marker.payload.id ? marker.payload.id : this.generateMarkerId()
    };
  }

  // 导出所有 markers 为 GeoJSON
  exportMarkersAsGeoJSON() {
    return {
      type: 'FeatureCollection',
      features: this.markers.map(marker => this.markerToGeoJSON(marker))
    };
  }

  // 设置拖拽模式
  setDraggable(draggable) {
    this.markers.forEach(marker => {
      marker.setDraggable(draggable);
    });
  }

  // 设置删除模式
  setRemovalMode(enabled) {
    this.markers.forEach(marker => {
      const element = marker.getElement();
      if (enabled) {
        element.classList.add('marker-delete-mode');
        element.onclick = () => {
          this.removeMarker(marker);
        };
      } else {
        element.classList.remove('marker-delete-mode');
        element.onclick = null;
      }
    });
  }

  // 添加事件监听器
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return this;
  }

  // 移除事件监听器
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
    return this;
  }

  // 触发事件
  _triggerEvent(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

// 设置图片标记功能
function setupMarkers(map) {
  // 创建全局 marker 管理器
  const markerManager = new MarkerManager(map);

  // 将 markerManager 设置为全局对象，以便其他模块使用
  window.map.markerManager = markerManager;

  markerManager.on('add', (marker) => {
    console.log(marker, 'marker');
    const popup = createTaskPopup('not-started');
    // 使用 MarkerManager 的 updatePopup 方法关联弹窗
    setTimeout(() => {
      markerManager.updatePopup(marker.payload.id, popup);
    }, 0); // 添加延时确保 marker 已完全创建
  });

  return markerManager;
}