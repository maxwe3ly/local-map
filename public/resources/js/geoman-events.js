function setupGeomanEvents(map) {
  const getGeoJson = (featureData) => {
    try {
      return JSON.stringify(featureData.getGeoJson(), null, 2);
    } catch (e) {
      throw Error('Can\'t retrieve GeoJSON');
    }
  };

  function getGeoJsonFromEvent(event) {
    return getGeoJson(event.feature);
  }

  // 监听绘制事件
  map.on('gm:create', (event) => {
    console.log('操作类型: 增加', {
      shape: event.shape,  // 形状类型（如 marker, circle, polygon 等）
      feature: getGeoJson(event.feature)  // feature 数据
    });
    
    // 在创建完成后禁用绘图模式，重置为默认模式
    map.gm.disableDraw();
  });

  // 监听编辑事件
  map.on('gm:editend', (event) => {
    console.log('操作类型: 编辑', {
      feature: getGeoJson(event.feature)  // 被编辑的 feature 数据
    });
    
  });

  // 监听删除事件
  map.on('gm:remove', (event) => {
    console.log('操作类型: 删除', {
      shape: event.shape, 
      feature: event.feature.id 
    });
    
    // 在编辑完成后禁用编辑模式，重置为默认模式
    map.gm.disableGlobalRemovalMode();
  });

  // 监听旋转结束事件
  map.on('gm:rotateend', function(event) {
    console.log('操作类型: 旋转', {
      feature: getGeoJsonFromEvent(event)
    });
    
  });
  // 监听移动结束事件
  map.on('gm:dragend', function(event) {
    console.log('操作类型: 移动', {
      feature: getGeoJsonFromEvent(event)
    });
  });
}