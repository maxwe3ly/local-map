/**
 * Leaflet特定的右键菜单功能
 */
class LeafletContextMenu {
  /**
   * 初始化Leaflet右键菜单功能
   * @param {Object} map - Leaflet地图实例
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
        imageUrl: `${window.publicUrl}images/marker-icon.png`,
        action: this.addDefaultMarker.bind(this)
      }
    ];
    
    // 自定义覆盖物
    this.customOverlays = options.customOverlays || [];
    
    // 禁用默认右键菜单
    this.map.getContainer().addEventListener('contextmenu', e => {
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
        this.addOverlay(e.latlng, overlay);
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
              this.addCircle(e.latlng);
            }
          },
          {
            text: '矩形',
            action: () => {
              this.addRectangle(e.latlng);
            }
          }
        ]
      },
      {
        text: '添加围栏',
        action: () => {
          this.addFence(e.latlng);
        }
      }
    ], e.originalEvent.clientX, e.originalEvent.clientY);
  }

  /**
   * 添加默认标记
   * @param {Object} latlng - 经纬度对象
   */
  addDefaultMarker(latlng) {
    console.log('添加默认标记，坐标:', latlng.lng, latlng.lat);
    // 实现添加默认标记的逻辑
    const marker = L.marker(latlng).addTo(this.map);
    
    this.overlays.push({
      type: 'marker',
      element: marker,
      position: latlng
    });
  }

  /**
   * 添加覆盖物
   * @param {Object} latlng - 经纬度对象
   * @param {Object} overlay - 覆盖物配置
   */
  addOverlay(latlng, overlay) {
    console.log('添加覆盖物，坐标:', latlng.lng, latlng.lat, '覆盖物:', overlay.name);
    
    if (overlay.action) {
      // 如果覆盖物有自定义动作，则执行
      overlay.action(latlng);
    } else {
      // 否则创建自定义标记
      try {
        const customIcon = L.icon({
          iconUrl: overlay.imageUrl,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          // 添加错误处理回退图标
          iconRetinaUrl: overlay.imageUrl,
          // 确保图标加载失败时不会使用默认图标
          className: 'custom-marker-icon'
        });
        
        const marker = L.marker(latlng, { icon: customIcon }).addTo(this.map);
        
        // 监听图标加载错误
        const iconElement = marker.getElement();
        if (iconElement) {
          const imgElement = iconElement.querySelector('img');
          if (imgElement) {
            imgElement.onerror = () => {
              console.error('图标加载失败，URL:', overlay.imageUrl);
              // 可以在这里实现自定义错误处理
            };
          }
        }
        
        this.overlays.push({
          type: 'custom-marker',
          element: marker,
          position: latlng,
          config: overlay
        });
      } catch (error) {
        console.error('创建自定义标记时出错:', error);
        // 回退到默认标记
        this.addDefaultMarker(latlng);
      }
    }
  }

  /**
   * 添加圆形
   * @param {Object} latlng - 经纬度对象
   */
  addCircle(latlng) {
    console.log('添加圆，中心坐标:', latlng.lng, latlng.lat);
    // 实现添加圆形的逻辑
  }

  /**
   * 添加矩形
   * @param {Object} latlng - 经纬度对象
   */
  addRectangle(latlng) {
    console.log('添加矩形，起始坐标:', latlng.lng, latlng.lat);
    // 实现添加矩形的逻辑
  }

  /**
   * 添加围栏
   * @param {Object} latlng - 经纬度对象
   */
  addFence(latlng) {
    console.log('添加围栏，起始坐标:', latlng.lng, latlng.lat);
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

  /**
   * 计算点到线段的距离
   * @param {Object} p - 点坐标 {x, y}
   * @param {Object} v - 线段起点 {x, y}
   * @param {Object} w - 线段终点 {x, y}
   * @returns {number} 距离
   */
  distanceToSegment(p, v, w) {
    // 线段长度的平方
    var l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    
    // 如果线段实际上是一个点，则返回点到点的距离
    if (l2 === 0) return Math.sqrt(Math.pow(p.x - v.x, 2) + Math.pow(p.y - v.y, 2));
    
    // 考虑线段 v-w 作为参数化的形式：v + t (w - v).
    // 我们需要找到投影点的参数值 t
    var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    
    // 将 t 限制在 [0,1] 范围内，表示线段上的点
    t = Math.max(0, Math.min(1, t));
    
    // 投影点
    var projection = {
      x: v.x + t * (w.x - v.x),
      y: v.y + t * (w.y - v.y)
    };
    
    // 返回点到投影点的距离
    return Math.sqrt(Math.pow(p.x - projection.x, 2) + Math.pow(p.y - projection.y, 2));
  }
}