/**
 * 上下文菜单模块 - 提供通用的右键菜单功能
 */
class ContextMenu {
  constructor() {
    this.activeMenu = null;
    this.eventListener = null;
  }

  /**
   * 创建并显示上下文菜单
   * @param {Array} items - 菜单项配置数组
   * @param {number} x - 菜单X坐标
   * @param {number} y - 菜单Y坐标
   */
  show(items, x, y) {
    // 移除已有的菜单
    this.hide();
    
    // 创建菜单容器
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    
    // 添加菜单项
    items.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.className = 'context-menu-item';
      if (item.submenu) {
        menuItem.className += ' has-submenu';
      }
      
      // 如果有图标，则使用图标
      if (item.imageUrl) {
        menuItem.className += ' image-item';
        const img = document.createElement('img');
        img.src = item.imageUrl;
        img.alt = item.text;
        img.className = 'menu-item-image';
        menuItem.appendChild(img);
        // 添加文本节点显示名称
        const textNode = document.createTextNode(item.text);
        menuItem.appendChild(textNode);
        // 添加标题属性作为悬停提示
        menuItem.title = item.text;
      } else {
        menuItem.textContent = item.text;
      }
      
      if (item.submenu) {
        // 创建子菜单
        const submenu = document.createElement('div');
        submenu.className = 'submenu';
        
        // 移除网格布局相关代码
        // 不再使用 gridLayout 属性
        
        item.submenu.forEach(subItem => {
          const subMenuItem = document.createElement('div');
          subMenuItem.className = 'context-menu-item';
          
          // 如果有图标，则使用图标
          if (subItem.imageUrl) {
            subMenuItem.className += ' image-item';
            const img = document.createElement('img');
            img.src = subItem.imageUrl;
            img.alt = subItem.text;
            img.className = 'menu-item-image';
            subMenuItem.appendChild(img);
            // 添加文本节点显示名称
            const textNode = document.createTextNode(subItem.text);
            subMenuItem.appendChild(textNode);
            // 添加标题属性作为悬停提示
            subMenuItem.title = subItem.text;
          } else {
            subMenuItem.textContent = subItem.text;
          }
          
          subMenuItem.onclick = e => {
            e.stopPropagation(); // 防止触发父菜单的点击事件
            subItem.action();
            this.hide();
          };
          submenu.appendChild(subMenuItem);
        });
        
        menuItem.appendChild(submenu);
      } else {
        menuItem.onclick = () => {
          item.action();
          this.hide();
        };
      }
      
      menu.appendChild(menuItem);
    });
    
    document.body.appendChild(menu);
    this.activeMenu = menu;
    
    // 点击其他区域关闭菜单
    setTimeout(() => {
      this.eventListener = () => this.hide();
      document.addEventListener('click', this.eventListener);
    }, 0);
  }

  /**
   * 隐藏上下文菜单
   */
  hide() {
    if (this.activeMenu) {
      this.activeMenu.parentNode.removeChild(this.activeMenu);
      this.activeMenu = null;
      
      if (this.eventListener) {
        document.removeEventListener('click', this.eventListener);
        this.eventListener = null;
      }
    }
  }
}

// 导出单例实例
const contextMenu = new ContextMenu();