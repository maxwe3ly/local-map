/**
 * MapLibre GL特定的右键菜单功能
 */
class MapLibreContextMenu {
  /**
   * 初始化MapLibre GL右键菜单功能
   * @param {Object} map - MapLibre GL地图实例
   * @param {Object} options - 配置选项
   * @param {Array} options.customOverlays - 自定义覆盖物配置
   */
  constructor(map, options = {}) {
    this.map = map;
    this.overlays = [];
    this.geometries = [];
    this.fences = [];
    
    // 默认覆盖物
    this.defaultOverlays = [
      {
        name: '默认标记',
        imageUrl: `${window.tileserverConfig.publicUrl}images/marker-icon.png`,
        action: this.addDefaultMarker.bind(this)
      }
    ];
    
    // 自定义覆盖物
    this.customOverlays = options.customOverlays || [];
    
    // 禁用默认右键菜单
    this.map.getCanvas().addEventListener('contextmenu', e => {
      e.preventDefault();
    });
    
    // 注册右键点击事件
    this.map.on('contextmenu', this.handleContextMenu.bind(this));
  }

  /**
   * 处理右键菜单事件
   * @param {Object} e - 事件对象
   */
  handleContextMenu(e) {
    // 检查是否点击在已有元素上
    const clickedElement = this.getClickedElement(e);
    
    if (clickedElement) {
      this.showElementMenu(clickedElement, e);
    } else {
      this.showDefaultMenu(e);
    }
  }

  /**
   * 获取点击的元素
   * @param {Object} e - 事件对象
   * @returns {Object|null} 点击的元素或null
   */
  getClickedElement(e) {
    // 检查是否点击在覆盖物上
    // 这里使用占位代码，后续补充实现
    return null;
  }

  /**
   * 显示元素特定的右键菜单
   * @param {Object} element - 点击的元素
   * @param {Object} e - 事件对象
   */
  showElementMenu(element, e) {
    contextMenu.show([
      {
        text: '删除',
        action: () => {
          this.deleteElement(element);
        }
      }
    ], e.originalEvent.clientX, e.originalEvent.clientY);
  }

  /**
   * 显示默认右键菜单
   * @param {Object} e - 事件对象
   */
  showDefaultMenu(e) {
    // 合并默认覆盖物和自定义覆盖物
    const allOverlays = [...this.defaultOverlays, ...this.customOverlays];
    
    // 创建覆盖物子菜单项
    const overlaySubmenuItems = allOverlays.map(overlay => ({
      text: overlay.name,
      imageUrl: overlay.imageUrl,
      action: () => {
        this.addOverlay(e.lngLat, overlay);
      }
    }));
    
    contextMenu.show([
      {
        text: '添加覆盖物',
        submenu: overlaySubmenuItems
        // 移除 gridLayout: true
      },
      {
        text: '添加几何图形',
        submenu: [
          {
            text: '圆',
            action: () => {
              this.addCircle(e.lngLat);
            }
          },
          {
            text: '矩形',
            action: () => {
              this.addRectangle(e.lngLat);
            }
          }
        ]
      },
      {
        text: '添加围栏',
        action: () => {
          this.addFence(e.lngLat);
        }
      }
    ], e.originalEvent.clientX, e.originalEvent.clientY);
  }

  /**
   * 添加默认标记
   * @param {Object} lngLat - 经纬度对象
   */
  addDefaultMarker(lngLat) {
    console.log('添加默认标记，坐标:', lngLat.lng, lngLat.lat);
    // 实现添加默认标记的逻辑
    const marker = new maplibregl.Marker()
      .setLngLat(lngLat)
      .addTo(this.map);
    
    this.overlays.push({
      type: 'marker',
      element: marker,
      position: lngLat
    });
  }

  /**
   * 添加覆盖物
   * @param {Object} lngLat - 经纬度对象
   * @param {Object} overlay - 覆盖物配置
   */
  addOverlay(lngLat, overlay) {
    console.log('添加覆盖物，坐标:', lngLat.lng, lngLat.lat, '覆盖物:', overlay.name);
    
    if (overlay.action) {
      // 如果覆盖物有自定义动作，则执行
      overlay.action(lngLat);
    } else {
      // 否则创建自定义标记
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.backgroundImage = `url(${overlay.imageUrl})`;
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.backgroundSize = 'contain';
      
      const marker = new maplibregl.Marker({
        element: el
      })
        .setLngLat(lngLat)
        .addTo(this.map);
      
      this.overlays.push({
        type: 'custom-marker',
        element: marker,
        position: lngLat,
        config: overlay
      });
    }
  }

  /**
   * 添加圆形
   * @param {Object} lngLat - 经纬度对象
   */
  addCircle(lngLat) {
    console.log('添加圆，中心坐标:', lngLat.lng, lngLat.lat);
    // 实现添加圆形的逻辑
  }

  /**
   * 添加矩形
   * @param {Object} lngLat - 经纬度对象
   */
  addRectangle(lngLat) {
    console.log('添加矩形，起始坐标:', lngLat.lng, lngLat.lat);
    // 实现添加矩形的逻辑
  }

  /**
   * 添加围栏
   * @param {Object} lngLat - 经纬度对象
   */
  addFence(lngLat) {
    console.log('添加围栏，起始坐标:', lngLat.lng, lngLat.lat);
    // 实现添加围栏的逻辑
  }

  /**
   * 删除元素
   * @param {Object} element - 要删除的元素
   */
  deleteElement(element) {
    console.log('删除元素');
    // 实现删除元素的逻辑
  }
}