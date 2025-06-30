// 创建弹窗元素
function createTaskPopup(status) {

  // 创建弹窗容器
  const popup = document.createElement('div');
  popup.id = `task-${status}-popup`;
  popup.className = `task-popup task-popup-${status}`;

  // 移除单独的点击事件监听器，改用事件委托

  // 根据状态设置不同的内容
  let title, icon, content, primaryButtonText;

  switch (status) {
    case 'completed':
      title = '任务已完成';
      icon = '✓';
      content = '该任务已经成功完成。您可以查看详情或继续其他任务。';
      primaryButtonText = '查看详情';
      break;
    case 'in-progress':
      title = '任务进行中';
      icon = '⟳';
      content = '该任务正在进行中。您可以查看当前进度或暂停任务。';
      primaryButtonText = '查看进度';
      break;
    case 'not-started':
      title = '任务未开始';
      icon = '○';
      content = '该任务尚未开始。您可以立即开始或安排在稍后进行。';
      primaryButtonText = '开始任务';
      break;
    default:
      title = '任务信息';
      icon = '!';
      content = '未知的任务状态。';
      primaryButtonText = '确定';
  }

  // 创建弹窗头部
  const header = document.createElement('div');
  header.className = 'task-popup-header';

  const titleElement = document.createElement('h3');
  titleElement.className = 'task-popup-title';

  const iconSpan = document.createElement('span');
  iconSpan.className = 'task-status-icon';
  iconSpan.textContent = icon;

  titleElement.appendChild(iconSpan);
  titleElement.appendChild(document.createTextNode(` ${title}`));

  header.appendChild(titleElement);

  // 创建弹窗内容
  const contentDiv = document.createElement('div');
  contentDiv.className = 'task-popup-content';

  const paragraph = document.createElement('p');
  paragraph.textContent = content;

  contentDiv.appendChild(paragraph);

  // 创建弹窗底部
  const footer = document.createElement('div');
  footer.className = 'task-popup-footer';

  // 组装弹窗
  popup.appendChild(header);
  popup.appendChild(contentDiv);
  popup.appendChild(footer);

  return popup;
}

// 移除所有已存在的任务弹窗
function removeExistingPopups() {
  const existingPopups = document.querySelectorAll('.task-popup');
  existingPopups.forEach(popup => {
    popup.remove();
  });
}

// 显示弹窗 - 修改为始终创建新的弹窗
function showPopup(popupId) {
  // 从 ID 中提取状态
  const status = popupId.replace('task-', '').replace('-popup', '');
  // 创建新的弹窗
  const popup = createTaskPopup(status);
  // 显示弹窗
  popup.classList.add('show');
}

// 隐藏弹窗
function closePopup(popupId) {
  const popup = document.getElementById(popupId);
  if (popup) {
    popup.classList.remove('show');
    // 延迟后移除 DOM 元素
    setTimeout(() => {
      popup.remove();
    }, 300); // 300ms 后移除，可以配合 CSS 过渡效果
  }
}

// 根据任务状态显示相应的弹窗
function showTaskStatusPopup(status) {
  const popupId = `task-${status}-popup`;
  showPopup(popupId);
}

// 示例：如何在地图上的标记点击事件中使用
function onMarkerClick(marker) {
  // 获取标记关联的任务状态
  const taskStatus = marker.properties.taskStatus; // 'completed', 'in-progress', 或 'not-started'

  // 显示相应的任务状态弹窗
  showTaskStatusPopup(taskStatus);
}

// 在文档加载完成后初始化事件委托
document.addEventListener('DOMContentLoaded', initTaskPopupEvents);

// 导出函数供其他模块使用
window.showTaskStatusPopup = showTaskStatusPopup;
window.closePopup = closePopup;