/**
 * 箭头绘制模式 - 基于MapboxDraw的自定义绘制模式
 * 允许用户通过两次点击创建箭头：第一次点击确定箭头尾部，第二次点击确定箭头顶部
 */
(function(window) {
  // 获取MapboxDraw常量和工具
  const Constants = MapboxDraw.constants;
  const doubleClickZoom = MapboxDraw.lib.doubleClickZoom;
  
  // 创建箭头绘制模式
  const ArrowDrawMode = {};
  
  // 初始化模式
  ArrowDrawMode.onSetup = function() {
    // 创建一个新的Feature（LineString类型）
    const arrow = this.newFeature({
      type: Constants.geojsonTypes.FEATURE,
      properties: {
        isArrow: true
      },
      geometry: {
        type: Constants.geojsonTypes.LINE_STRING,
        coordinates: []
      }
    });
    
    // 添加到绘制器中
    this.addFeature(arrow);
    
    // 禁用双击缩放
    doubleClickZoom.disable(this);
    
    // 更新UI状态
    this.updateUIClasses({ mouse: Constants.cursors.ADD });
    this.activateUIButton(Constants.types.LINE);
    
    // 设置可操作状态
    this.setActionableState({ trash: true });
    
    return {
      arrow,
      currentVertexPosition: 0,
      clickCount: 0
    };
  };
  
  // 处理点击事件
  ArrowDrawMode.onClick = function(state, e) {
    // 获取点击位置
    const coordinates = [e.lngLat.lng, e.lngLat.lat];
    
    // 第一次点击 - 设置箭头尾部
    if (state.clickCount === 0) {
      state.arrow.updateCoordinate(`${state.currentVertexPosition}`, coordinates[0], coordinates[1]);
      state.clickCount++;
    }
    // 第二次点击 - 设置箭头顶部并完成绘制
    else if (state.clickCount === 1) {
      state.arrow.updateCoordinate(`${state.currentVertexPosition + 1}`, coordinates[0], coordinates[1]);
      
      // 计算箭头头部
      this.createArrowhead(state.arrow);
      
      // 完成绘制，切换到选择模式
      this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.arrow.id] });
    }
  };
  
  // 处理鼠标移动事件 - 实时更新箭头
  ArrowDrawMode.onMouseMove = function(state, e) {
    if (state.clickCount === 1) {
      // 更新第二个点的位置
      state.arrow.updateCoordinate(`${state.currentVertexPosition + 1}`, e.lngLat.lng, e.lngLat.lat);
    }
  };
  
  // 创建箭头头部
  ArrowDrawMode.createArrowhead = function(arrow) {
    // 获取箭头的坐标
    const coordinates = arrow.getCoordinates();
    
    if (coordinates.length < 2) return;
    
    // 获取箭头的尾部和顶部
    const start = coordinates[0];
    const end = coordinates[1];
    
    // 计算箭头方向
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    
    // 计算箭头长度（地理坐标单位）
    // 这里使用了一个简单的比例，可以根据需要调整
    const arrowLength = Math.sqrt(dx * dx + dy * dy) * 0.1;
    
    // 计算箭头方向角度
    const angle = Math.atan2(dy, dx);
    
    // 计算箭头两侧的点
    const arrowAngle = Math.PI / 6; // 30度
    
    // 计算箭头左侧点
    const leftX = end[0] - arrowLength * Math.cos(angle + arrowAngle);
    const leftY = end[1] - arrowLength * Math.sin(angle + arrowAngle);
    
    // 计算箭头右侧点
    const rightX = end[0] - arrowLength * Math.cos(angle - arrowAngle);
    const rightY = end[1] - arrowLength * Math.sin(angle - arrowAngle);
    
    // 更新箭头的坐标，形成一个完整的箭头形状
    // 路径: 起点 -> 终点 -> 左侧点 -> 终点 -> 右侧点
    arrow.setCoordinates([
      start,
      end,
      [leftX, leftY],
      end,
      [rightX, rightY]
    ]);
  };
  
  // 处理取消事件
  ArrowDrawMode.onStop = function(state) {
    doubleClickZoom.enable(this);
    this.activateUIButton();
    
    // 如果没有完成绘制，则删除该特征
    if (state.arrow.getCoordinates().length < 2) {
      this.deleteFeature([state.arrow.id], { silent: true });
    }
  };
  
  // 处理键盘事件 - 按Escape键取消绘制
  ArrowDrawMode.onKeyUp = function(state, e) {
    if (e.keyCode === 27) { // Escape键
      this.changeMode(Constants.modes.SIMPLE_SELECT);
    }
  };
  
  // 显示特征
  ArrowDrawMode.toDisplayFeatures = function(state, geojson, display) {
    // 只显示当前正在绘制的箭头
    const isActiveArrow = state.arrow && geojson.properties.id === state.arrow.id;
    
    // 设置特征的活动状态
    geojson.properties.active = isActiveArrow ? Constants.activeStates.ACTIVE : Constants.activeStates.INACTIVE;
    
    // 显示特征
    display(geojson);
  };
  
  // 导出模式
  window.ArrowDrawMode = ArrowDrawMode;
})(window);