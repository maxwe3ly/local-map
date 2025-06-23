function extendDrawBar(opt) {
  var ctrl = this;
  ctrl.draw = opt.draw;
  ctrl.buttons = opt.buttons || [];
  ctrl.onAddOrig = opt.draw.onAdd;
  ctrl.onRemoveOrig = opt.draw.onRemove;
}

extendDrawBar.prototype.onAdd = function(map) {
  var ctrl = this;
  ctrl.map = map;
  ctrl.elContainer = ctrl.onAddOrig(map);
  ctrl.buttons.forEach(function(b) {
    ctrl.addButton(b);
  });
  return ctrl.elContainer;
};

extendDrawBar.prototype.onRemove = function(map) {
  var ctrl = this;
  ctrl.buttons.forEach(function(b) {
    ctrl.removeButton(b);
  });
  ctrl.onRemoveOrig(map);
};

extendDrawBar.prototype.addButton = function(opt) {
  var ctrl = this;
  var elButton = document.createElement('button');
  elButton.className = 'mapbox-gl-draw_ctrl-draw-btn';
  if (opt.classes instanceof Array) {
    opt.classes.forEach(function(c) {
      elButton.classList.add(c);
    });
  }
  if (opt.content) {
    if (opt.content instanceof Element) {
      elButton.appendChild(opt.content);
    } else {
      elButton.innerHTML = opt.content;
    }
  }
  elButton.addEventListener(opt.on, opt.action);
  ctrl.elContainer.appendChild(elButton);
  opt.elButton = elButton;
};

extendDrawBar.prototype.removeButton = function(opt) {
  opt.elButton.removeEventListener(opt.on, opt.action);
  opt.elButton.remove();
};