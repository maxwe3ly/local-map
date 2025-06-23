/**
 * 覆盖物配置模块 - 提供地图覆盖物的配置信息
 */
class OverlayConfig {
  /**
   * 获取自定义覆盖物配置
   * @returns {Array} 自定义覆盖物配置数组
   */
  static getCustomOverlays() {
    // 确保 publicUrl 末尾有斜杠
    const publicUrl = window.tileserverConfig.publicUrl;
    const baseUrl = publicUrl.endsWith('/') ? publicUrl : publicUrl + '/';
    
    return [
      {
        name: '汽车',
        imageUrl: baseUrl + 'images/car.svg' + window.tileserverConfig.keyQuery
      },
      {
        name: '餐厅',
        imageUrl: baseUrl + 'images/restaurant.svg' + window.tileserverConfig.keyQuery
      }
      // 可以在这里添加更多自定义覆盖物
    ];
  }
}

// 如果在浏览器环境中，将其暴露为全局变量
if (typeof window !== 'undefined') {
  window.OverlayConfig = OverlayConfig;
}

// 如果在 Node.js 环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OverlayConfig;
}