var canvas = document.getElementById('c');
var ctx = canvas.getContext("2d");
var height =  0,width =  0,innerpoints = [],outerpoints = [],particles = [];// 颗粒

var noofpoints = 521,trashold = 10; // noofpnits  总共是521条线
var x =  0,y =  0,p =  0,n =  0,point =  0,dx =  0,dy =  0,color =  0;
deltaangle = Math.PI * 2 / noofpoints,
r = Math.min(height, width) * 0.5; // 三角洲

var distance = function distance(x1, y1, x2, y2) { //  计算两点之间的距离
  return Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
};
var mapVal = function mapVal(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
var resize = function resize() {
  height = ctx.canvas.clientHeight;
  width = ctx.canvas.clientWidth;

  if (ctx.canvas.clientWidth !== canvas.width ||
  ctx.canvas.clientHeight !== canvas.height)
  {
    canvas.width = width;
    canvas.height = height;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI);
    innerpoints = [];
    r = 10;
    for (var i = deltaangle; i <= Math.PI * 2; i += deltaangle) {
      x = r * 16 * Math.pow(Math.sin(i), 3);
      y = r * (13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i));
      innerpoints.push({
        x: x,
        y: y });


      x = 10 * r * 16 * Math.pow(Math.sin(i), 3);
      y = 10 * r * (13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(3 * i) - Math.cos(4 * i));
      outerpoints.push({
        x: x,
        y: y });


      var step = random(0.001, 0.003, true);
      particles.push({
        step: step,
        x: x,
        y: y });

    }
  }
};
var random = function random(min, max, isFloat) {
  if (isFloat) {
    return Math.random() * (max - min) + min;
  }
  return ~~(Math.random() * (max - min) + min);
};

resize();

//particles = [...outerpoints];
ctx.globalAlpha = 0.5;
ctx.globalCompositeOperation = 'source-over';
var draw = function draw() {
  ctx.fillStyle = "rgba(255,255,238,0.03)";
  ctx.fillRect(-width, -height, width * 2, height * 2);
  ctx.beginPath();

  for (var i = 0; i < innerpoints.length; i++) {
    s = outerpoints[i];
    d = innerpoints[i];
    point = particles[i];

    if (distance(point.x, point.y, d.x, d.y) > 10) {
      dx = d.x - s.x;
      dy = d.y - s.y;

      point.x += dx * point.step;
      point.y += dy * point.step;
      color = distance(0, 0, point.x, point.y);
      // console.log("什么颜色",color);
      ctx.beginPath();
      ctx.fillStyle = "hsl(" + color % 360 + ",100%,50%)";
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    } else {
      point.x = d.x;
      point.y = d.y;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
      particles[i].x = s.x;
      particles[i].y = s.y;
      particles[i].step = random(0.001, 0.003, true);
    }
  }

};


var render = function render() {
  resize();
  draw();
  requestAnimationFrame(render);
};

requestAnimationFrame(render);