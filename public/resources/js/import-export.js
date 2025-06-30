function setupImportExport(map, markerManager) {
  // 导出覆盖物功能
  document.getElementById('export-features').addEventListener('click', function () {
    // 导出所有覆盖物为 GeoJSON
    const allFeatures = map.gm.features.exportGeoJson();

    // 将自定义 marker 转换为 GeoJSON 并添加到 features 中
    const markerFeatures = markerManager.exportMarkersAsGeoJSON().features;
    allFeatures.features = allFeatures.features.concat(markerFeatures);

    // 创建 Blob 对象
    const blob = new Blob([JSON.stringify(allFeatures, null, 2)], { type: 'application/json' });

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'map-features.geojson';

    // 触发下载
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // 导入覆盖物功能
  document.getElementById('import-features').addEventListener('click', function () {
    // 创建文件输入元素
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,.geojson';

    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const geojson = JSON.parse(e.target.result);

          // 清除现有的自定义 marker
          markerManager.clearMarkers();

          // 分离自定义 marker 和其他 Geoman 图形
          const customMarkerFeatures = [];
          const geomanFeatures = { type: 'FeatureCollection', features: [] };

          geojson.features.forEach(feature => {
            if (feature.properties && feature.properties.shape === 'custom_marker') {
              customMarkerFeatures.push(feature);
            } else {
              geomanFeatures.features.push(feature);
            }
          });

          // 导入 Geoman 图形
          if (geomanFeatures.features.length > 0) {
            const result = map.gm.features.importGeoJson(geomanFeatures);
            console.log('导入 Geoman 图形结果:', result);
          }

          // 导入自定义 marker
          customMarkerFeatures.forEach(feature => {
            const data = {
              lng: feature.geometry.coordinates[0],
              lat: feature.geometry.coordinates[1],
              imageUrl: feature.properties.imageUrl,
              id: feature.properties.id || markerManager.generateMarkerId()
            };
            markerManager.createMarkerFromData(data);
            // TODO: 根据 markerId，更新关联的 popup
            // 为特定 ID 的 marker 添加不同状态的弹窗
            if (data.id === 'feature-custom-marker-1') {
              // 创建未开始状态的弹窗
              const popup = createTaskPopup('not-started');
              // 使用 MarkerManager 的 updatePopup 方法关联弹窗
              setTimeout(() => {
                markerManager.updatePopup(data.id, popup);
              }, 0); // 添加延时确保 marker 已完全创建
            } else if (data.id === 'feature-custom-marker-2') {
              // 创建进行中状态的弹窗
              const popup = createTaskPopup('in-progress');
              setTimeout(() => {
                markerManager.updatePopup(data.id, popup);
              }, 0);
            } else if (data.id === 'feature-custom-marker-3') {
              // 创建已完成状态的弹窗
              const popup = createTaskPopup('completed');
              setTimeout(() => {
                markerManager.updatePopup(data.id, popup);
              }, 0);
            }
          });

          // 显示导入结果
          console.log(`成功导入 ${geomanFeatures.features.length} 个 Geoman 图形和 ${customMarkerFeatures.length} 个自定义标记`);
          
          // NOTE: 添加按钮点击事件监听器，更新 feature-custom-marker-1 的弹窗状态, 后续移除
          document.getElementById('update-custom-marker-1-status-button')?.addEventListener('click', function() {
            // 创建进行中状态的弹窗
            const popup = createTaskPopup('in-progress');
            // 更新 marker 的弹窗
            markerManager.updatePopup('feature-custom-marker-1', popup);
            console.log('已将 feature-custom-marker-1 的弹窗状态从未开始更新为进行中');
          });
        } catch (error) {
          console.error('导入 GeoJSON 失败:', error);
          alert('导入失败，请确保文件格式正确');
        }
      };
      reader.readAsText(file);
    });

    // 触发文件选择对话框
    fileInput.click();
  });
}