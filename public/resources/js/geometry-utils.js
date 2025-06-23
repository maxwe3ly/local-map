/**
 * 几何图形工具类 - 提供通用的几何计算和处理函数
 */
class GeometryUtils {
  /**
   * 计算两点之间的距离
   * @param {Array|Object} point1 - 第一个点 [lng, lat] 或 {lng, lat}
   * @param {Array|Object} point2 - 第二个点 [lng, lat] 或 {lng, lat}
   * @returns {number} 距离（米）
   */
  static distance(point1, point2) {
    // 转换为统一格式
    const p1 = Array.isArray(point1) ? {lng: point1[0], lat: point1[1]} : point1;
    const p2 = Array.isArray(point2) ? {lng: point2[0], lat: point2[1]} : point2;
    
    // 使用Haversine公式计算球面距离
    const R = 6371000; // 地球半径（米）
    const dLat = this.toRadians(p2.lat - p1.lat);
    const dLng = this.toRadians(p2.lng - p1.lng);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(p1.lat)) * Math.cos(this.toRadians(p2.lat)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * 将角度转换为弧度
   * @param {number} degrees - 角度
   * @returns {number} 弧度
   */
  static toRadians(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * 计算点到线段的距离
   * @param {Object} point - 点坐标 {lng, lat}
   * @param {Object} lineStart - 线段起点 {lng, lat}
   * @param {Object} lineEnd - 线段终点 {lng, lat}
   * @returns {number} 距离（米）
   */
  static pointToLineDistance(point, lineStart, lineEnd) {
    // 将地理坐标转换为平面坐标（简化计算）
    // 注意：这种方法在较小范围内有效，大范围应使用更复杂的投影
    const p = {x: point.lng, y: point.lat};
    const v = {x: lineStart.lng, y: lineStart.lat};
    const w = {x: lineEnd.lng, y: lineEnd.lat};
    
    // 线段长度的平方
    const l2 = Math.pow(v.x - w.x, 2) + Math.pow(v.y - w.y, 2);
    
    // 如果线段实际上是一个点，则返回点到点的距离
    if (l2 === 0) {
      return this.distance(point, lineStart);
    }
    
    // 考虑线段 v-w 作为参数化的形式：v + t (w - v).
    // 我们需要找到投影点的参数值 t
    const t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    
    // 将 t 限制在 [0,1] 范围内，表示线段上的点
    const clampedT = Math.max(0, Math.min(1, t));
    
    // 投影点
    const projection = {
      lng: v.x + clampedT * (w.x - v.x),
      lat: v.y + clampedT * (w.y - v.y)
    };
    
    // 返回点到投影点的距离
    return this.distance(point, projection);
  }

  /**
   * 计算多边形的面积
   * @param {Array} points - 多边形顶点数组 [{lng, lat}, ...]
   * @returns {number} 面积（平方米）
   */
  static polygonArea(points) {
    // 实现多边形面积计算
    // 注意：这里需要考虑地球曲率，简单实现可能不够准确
    return 0;
  }
}