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
}