function initGeoman(map) {
  window.map.geoman = new window.Geoman.Geoman(map, {
    settings: {
      controlsPosition: 'top-right',
      throttlingDelay: 100
    },
    controls: {
      draw: {
        text_marker: {
          uiEnabled: false,
        },
        circle_marker: {
          uiEnabled: false,
        },
        marker: {
          uiEnabled: false,
        },
        circle: {
          title: '绘制圆',
        },
        line: {
          title: '绘制折线',
        },
        rectangle: {
          title: '绘制矩形',
        },
        polygon: {
          title: '绘制多边形',
          uiEnabled: true
        },
      },
      edit: {
        drag: {
          uiEnabled: true,
          title: '移动图形'
        },
        change: {
          title: '编辑图形'
        },
        rotate: {
          title: '旋转图形'
        },
        delete: {
          title: '删除图形'
        },
        cut: {
          uiEnabled: false,
        }
      },
      helper: {
        zoom_to_features: {
          uiEnabled: false,
        },
        shape_markers: {
          uiEnabled: false,
        },
        snapping: {
          uiEnabled: false,
        }
      }
    }
  });

  // 添加自定义箭头标记的实现
  setupArrowMarkerControl(map);
}

// 设置自定义箭头标记控件
function setupArrowMarkerControl(map) {
  // 等待 geoman 完全加载
  map.on('gm:loaded', function() {
    // 获取 geoman 控件容器
    const drawControlGroup = document.querySelector('.maplibregl-ctrl-group');
    
    if (drawControlGroup) {
      // 创建箭头标记按钮
      const arrowMarkerButton = document.createElement('button');
      arrowMarkerButton.type = 'button';
      arrowMarkerButton.className = 'arrow-marker-control';
      arrowMarkerButton.title = '绘制箭头标记';
      arrowMarkerButton.setAttribute('aria-label', '绘制箭头标记');
      
      // 添加点击事件
      arrowMarkerButton.addEventListener('click', function() {
        // 切换激活状态
        const isActive = arrowMarkerButton.classList.contains('active');
        
        if (isActive) {
          // 如果已激活，则禁用
          arrowMarkerButton.classList.remove('active');
          disableArrowMarkerMode(map);
        } else {
          // 移除其他按钮的激活状态
          document.querySelectorAll('.maplibregl-ctrl-group button').forEach(btn => {
            btn.classList.remove('active');
          });
          
          // 激活箭头标记模式
          arrowMarkerButton.classList.add('active');
          enableArrowMarkerMode(map, arrowMarkerButton);
        }
      });
      
      // 将按钮插入到第一个控件组的最前面
      drawControlGroup.insertBefore(arrowMarkerButton, drawControlGroup.firstChild);
    }
  });
}

// 启用箭头标记绘制模式
function enableArrowMarkerMode(map, button) {
  // 禁用其他绘制模式
  map.gm.disableDraw();
  
  // 设置鼠标样式
  map.getCanvas().style.cursor = 'crosshair';
  
  // 创建临时的事件监听器
  const clickHandler = function(e) {
    // 使用 MarkerManager 创建箭头标记
    if (window.markerManager) {
      // 构建正确的图片路径
      const publicUrl = window.tileserverConfig?.publicUrl || '/';
      const keyQuery = window.tileserverConfig?.keyQuery || '';
      const arrowImageUrl = `${publicUrl}images/arrow.svg${keyQuery}`;
      
      const arrowMarker = window.markerManager.createImageMarker(
        e.lngLat, 
        arrowImageUrl,
        {
          payload: {
            id: `arrow-marker-${Date.now()}`,
            type: 'arrow_marker'
          }
        }
      );
      
      // 触发 geoman 创建事件
      map.fire('gm:create', {
        shape: 'arrow_marker',
        feature: arrowMarker
      });
    }
    
    // 禁用箭头标记模式
    disableArrowMarkerMode(map);
    button.classList.remove('active');
  };
  
  // 添加点击事件监听器
  map.on('click', clickHandler);
  
  // 添加 ESC 键取消功能
  const escHandler = function(e) {
    if (e.key === 'Escape') {
      disableArrowMarkerMode(map);
      button.classList.remove('active');
      document.removeEventListener('keydown', escHandler);
    }
  };
  
  document.addEventListener('keydown', escHandler);
  
  // 保存事件处理器以便清理
  map._arrowMarkerClickHandler = clickHandler;
  map._arrowMarkerEscHandler = escHandler;
}

// 禁用箭头标记绘制模式
function disableArrowMarkerMode(map) {
  // 重置鼠标样式
  map.getCanvas().style.cursor = '';
  
  // 清理事件监听器
  if (map._arrowMarkerClickHandler) {
    map.off('click', map._arrowMarkerClickHandler);
    map._arrowMarkerClickHandler = null;
  }
  
  if (map._arrowMarkerEscHandler) {
    document.removeEventListener('keydown', map._arrowMarkerEscHandler);
    map._arrowMarkerEscHandler = null;
  }
}