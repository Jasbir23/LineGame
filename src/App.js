import React, { Component } from 'react';
import './App.css';
import Draw from "./Draw";

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      isDrawing: false,
      points: []
    }
  }
  handleMouseDown = (e) => {
    this.setState({
      isDrawing: true
    })
  }
  handleMouseMove = (e) => {
    if(this.state.isDrawing){
    this.state.points.push(this.relativeCoordinatesForEvent(e))
    this.setState({
      points: this.state.points
    })
  }
  }
  handleMouseUp = (e) => {
    this.setState({
      isDrawing: false,
      points: []
    })
  }
  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return {
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    };
  }
  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }
  // render() {
  //   const pathData = "M " +
  //         this.state.points
  //           .map(p => {
  //             return `${p.x} ${p.y}`;
  //           })
  //           .join(" L ");
  //   return (
  //     <div 
  //     className="drawArea"
  //     ref="drawArea"
  //     onMouseDown={this.handleMouseDown}
  //     onMouseMove={this.handleMouseMove}>
  //     <svg>
  //       <path stroke={"black"} d={pathData} />
  //     </svg>
  //     </div>
  //   );
  // }
  render(){
    return(
      <Draw />
    )
  }
}

export default App;
