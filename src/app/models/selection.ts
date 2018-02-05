import * as Konva from 'konva';

export class Selection {

  readonly DEFAULT_WIDTH = 50;
  readonly DEFAULT_HEIGHT = 50;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
  selectionLayer: Konva.Layer;
  textFontSize = 10;
  rectStrokeWidth = 4;
  circleRadius = 10;
  circleStrokeWidth = 2;
  private _isActive = false;

  constructor(
    order: number,
    x: number,
    y: number,
    width: number = null,
    height: number = null
  ) {
    this.order = order;
    this.x = x;
    this.y = y;
    this.width = width || this.DEFAULT_WIDTH;
    this.height = height || this.DEFAULT_HEIGHT;
    this.create();
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  exportLayer(): Konva.Layer {
    return this.selectionLayer;
  }

  private create() {
    const that = this;

    this.selectionLayer = new Konva.Layer();

    const selectionGroup = new Konva.Group({
      x: this.x,
      y: this.y,
      draggable: true
    });

    const orderNumberGroup = new Konva.Group({
      x: 0,
      y: 0,
      name: 'orderNumberGroup'
    });

    const selectionRect = new Konva.Rect({
      x: 0,
      y: 0,
      name: 'selection',
      width: this.width,
      height: this.height,
      strokeWidth: this.rectStrokeWidth,
      stroke: 'darkorange'
    });

    const orderCircle = new Konva.Circle({
      radius: this.circleRadius,
      stroke: 'white',
      strokeWidth: this.circleStrokeWidth,
      fill: 'black',
      fillLinearGradientStartPoint: { x : -50, y : -50},
      fillLinearGradientEndPoint: { x : 50, y : 50},
      fillLinearGradientColorStops: [0, 'red', 1, 'yellow'],
    });

    const orderNumber = new Konva.Text({
      x: -3.25, // -4.75
      y: -3.75,
      text: this.order + '',
      fontSize: this.textFontSize,
      fill: 'white',
      align: 'center'
    });

    const closeButtonGroup = new Konva.Group({
      x: this.width,
      y: 0,
      name: 'closeButtonGroup'
    });

    const closeCircle = new Konva.Circle({
      radius: this.circleRadius,
      stroke: 'white',
      strokeWidth: this.circleStrokeWidth,
      fill: 'orange'
    });

    const closeLinesGroup = new Konva.Group({
      x: closeCircle.x() - closeCircle.getAttr('radius') / 2,
      y: closeCircle.y() - closeCircle.getAttr('radius') / 2
    });

    const closeLine = new Konva.Line({
      points: [0, 0, closeCircle.getAttr('radius'), closeCircle.getAttr('radius')],
      stroke: 'white',
      strokeWidth: this.circleStrokeWidth
    });

    const closeLine2 = new Konva.Line({
      points: [closeCircle.getAttr('radius'), 0, 0, closeCircle.getAttr('radius')],
      stroke: 'white',
      strokeWidth: this.circleStrokeWidth
    });

    const movableCircle = new Konva.Circle({
      x: 0,
      y: selectionRect.getHeight(),
      name: 'bottomLeft',
      radius: this.circleRadius / 2,
      stroke: 'grey',
      strokeWidth: this.circleStrokeWidth / 2,
      fill: 'white',
      draggable: true
    });

    const movableCircle2 = new Konva.Circle({
      x: selectionRect.getWidth(),
      y: selectionRect.getHeight(),
      name: 'bottomRight',
      radius: this.circleRadius / 2,
      stroke: 'grey',
      strokeWidth: this.circleStrokeWidth / 2,
      fill: 'white',
      draggable: true
    });

    orderNumberGroup.add(orderCircle, orderNumber);
    closeLinesGroup.add(closeLine, closeLine2);
    closeButtonGroup.add(closeCircle, closeLinesGroup);

    selectionGroup.add(selectionRect, orderNumberGroup, closeButtonGroup);
    this.selectionLayer.add(selectionGroup);

    this.addAnchor(selectionGroup, movableCircle);
    this.addAnchor(selectionGroup, movableCircle2);

    closeButtonGroup.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    closeButtonGroup.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
    closeButtonGroup.on('click', function() {
      that.suicide();
    });
  }

  private suicide() {
    document.body.style.cursor = 'default';
    this.selectionLayer.destroy();
  }

  private addAnchor(group: Konva.Group, anchor: Konva.Circle) {
    const that = this;
    const stage = group.getStage();
    const layer = group.getLayer();

    anchor.on('dragmove', function() {
      that.update(this);
      layer.draw();
    });
    anchor.on('mousedown touchstart', function() {
      this.moveToTop();
    });
    anchor.on('dragend', function() {
      layer.draw();
    });
    anchor.on('mouseover', function() {
      const layer1 = this.getLayer();
      document.body.style.cursor = 'pointer';
      this.setStrokeWidth(4);
      layer1.draw();
    });
    anchor.on('mouseout', function() {
      const layer2 = this.getLayer();
      document.body.style.cursor = 'default';
      this.setStrokeWidth(2);
      layer2.draw();
    });

    group.add(anchor);
  }

  private update(activeAnchor: Konva.Circle) {
    const group: Konva.Group = activeAnchor.getParent();
    const bottomRight: Konva.Circle = group.find('.bottomRight')[0];
    const bottomLeft: Konva.Circle = group.find('.bottomLeft')[0];
    const selection: Konva.Rect = group.find('.selection')[0];
    const closeButton: Konva.Group = group.find('.closeButtonGroup')[0];
    const orderNumber: Konva.Group = group.find('.orderNumberGroup')[0];

    const anchorX = activeAnchor.x();
    const anchorY = activeAnchor.y();

    // update anchor positions
    switch (activeAnchor.name()) {
      case 'bottomLeft':
        bottomRight.y(anchorY);
        orderNumber.x(anchorX);
        selection.x(anchorX);
        break;
      case 'bottomRight':
        bottomLeft.y(anchorY);
        closeButton.x(anchorX);
        break;
    }

    const width = bottomRight.x() - bottomLeft.x();
    const height = bottomLeft.y();

    if (width && height) {
      selection.width(width);
      selection.height(height);
    }
  }
}
