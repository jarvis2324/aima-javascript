class AnimationController {
  constructor(root, min, max, renderer) {
    this.root = root;
    this.slider = this.root.selectAll('.ACSlider');
    this.slider.attr('min', min).attr('max', max)
      .attr('step', 1).property('value', 0);
    renderer(0);
    this.slider.on('change input', () => {
      let val = parseInt(this.slider.property('value'));
      renderer(val);
    });
    this.nextElement = this.root.select('.ACNext');
    this.nextElement.on('click', () => {
      let val = parseInt(this.slider.property('value'));
      this.slider.property('value', val + 1);
      this.slider.dispatch('change');
    });
    this.prevElement = this.root.select('.ACPrev');
    this.prevElement.on('click', () => {
      let val = parseInt(this.slider.property('value'));
      this.slider.property('value', val - 1);
      this.slider.dispatch('change');
    });
  }
}
