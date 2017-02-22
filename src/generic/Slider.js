import React, { Component } from 'react';

export default class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {sliderClass : ""};
    this.switchContent = this.switchContent.bind(this);
    this.showSlider = this.showSlider.bind(this);
  }

  componentWillMount() {
    this.showSlider(false);

    let difX = 0;
    let difY = 0;
    document.addEventListener("touchstart", (event) => {
      difX = event.changedTouches[0].pageX;
      difY = event.changedTouches[0].pageY;

    });

    document.addEventListener("touchend", (event) => {
      difX += - event.changedTouches[0].pageX;
      difY += - event.changedTouches[0].pageY;
      let test = Math.abs(difX) > 25 && Math.abs(difX) > 2 * Math.abs(difY);
      if (test) {
        let test = difX < 0;
        this.showSlider(test);
      }
    });


  }

  showSlider(show) {
    let slider = "slider-mask";
    if (!show) {
      slider = "slider-collapse";
    }
    this.setState({ sliderClass: slider });
  }

  switchContent(item) {
    for(let it of this.props.menuItems){
      it.logo = it.disable;
    }
    item.logo = item.enable;
    this.props.switchContent(item);
  }

  render() {
    return (
      <div className={this.state.sliderClass} onClick={this.showSlider.bind(this, false)}>
        <div className="slider">
          {this.props.menuItems.map((item) => {
            return (
              <div className="Item" key={"Item" + item.type} onClick={this.switchContent.bind(this, item)}>
                {item.logo}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}