document.addEventListener('DOMContentLoaded', function () {
  // 初始化地图
  const map = initMap();

  // 初始化 Geoman 插件
  initGeoman(map);

  // 等待地图加载完成
  map.on('load', function () {
    // 设置标记管理器
    const markerManager = setupMarkers(map);

    // 设置导入导出功能
    setupImportExport(map, markerManager);

    initTaskPopupEvents();
  });

  // 等待 Geoman 加载完成
  map.on('gm:loaded', function () {
    console.log('Geoman fully loaded');

    map.addControl(new maplibregl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
    }));
    map.addControl(new maplibregl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    }));

    // 设置 Geoman 事件处理
    setupGeomanEvents(map);
  });
});

// 初始化弹窗事件委托
function initTaskPopupEvents() {
  // 使用事件委托，将事件监听器添加到文档
  document.addEventListener('click', function (e) {
    // 检查点击的元素或其父元素是否是弹窗
    const popup = e.target.closest('.maplibregl-popup');
    if (popup) {
      // 获取所有弹窗
      const allPopups = document.querySelectorAll('.maplibregl-popup');
      // 将所有弹窗的 z-index 重置为默认值
      allPopups.forEach(p => {
        p.style.zIndex = '1';
      });
      // 将当前点击的弹窗 z-index 设置为较高值
      popup.style.zIndex = '1000';
      // 阻止事件冒泡，避免触发地图的点击事件
      e.stopPropagation();
    }
  });

  // 添加地图点击事件监听器，重置所有弹窗的 zIndex
  window.map.instance.on('click', function () {
    // 获取所有弹窗
    const allPopups = document.querySelectorAll('.maplibregl-popup');
    // 将所有弹窗的 z-index 重置为默认值
    allPopups.forEach(p => {
      p.style.zIndex = '1';
    });
  });
}