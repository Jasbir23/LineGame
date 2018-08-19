import React from 'react';
import './App.css';
import Immutable from "immutable";
class DrawArea extends React.Component {
    constructor() {
      super();
  
      this.state = {
        lines: new Immutable.List(),
        relArray : new Immutable.List(),
        isDrawing: false
      };
  
      this.handleMouseDown = this.handleMouseDown.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseUp = this.handleMouseUp.bind(this);
    }
  
    componentDidMount() {
      document.addEventListener("mouseup", this.handleMouseUp);
    }
  
    componentWillUnmount() {
      document.removeEventListener("mouseup", this.handleMouseUp);
    }
  
    handleMouseDown(mouseEvent) {
      if (mouseEvent.button !== 0) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
  
      this.setState(prevState => ({
        lines: prevState.lines.push(new Immutable.List([point])),
        isDrawing: true
      }));
    }
  
    handleMouseMove(mouseEvent) {
      if (!this.state.isDrawing) {
        return;
      }
  
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      const listNumber = this.state.lines.size - 1;
      const pointNumber = this.state.lines.get(this.state.lines.size - 1).size - 1;
      const prevPoint = this.state.lines.getIn([listNumber, pointNumber]);
      const slope = (prevPoint.get('y') - point.get('y')) / (prevPoint.get('x') - point.get('x'));
      const dist = Math.sqrt(Math.pow((prevPoint.get('y') - point.get('y')), 2) + Math.pow((prevPoint.get('x') - point.get('x')), 2));
      const xDir = point.get('y') < prevPoint.get('y');
      const yDir = point.get('x') < prevPoint.get('x');
      this.setState(prevState =>  ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
        relArray: prevState.relArray.push({ slope : slope, dist : dist, xDir: xDir, yDir: yDir })
      }));
    }
  
    handleMouseUp() {
      this.setState({ isDrawing: false });
      const listNumber = this.state.lines.size - 1;
      const pointNumber = this.state.lines.get(this.state.lines.size - 1).size - 1;
      const lastPoint = this.state.lines.getIn([listNumber, pointNumber]);
      this.animateLine(lastPoint, this.state.relArray);
    }
    animateLine (lastPoint, ptArray) {
      let i = 0;
      let refPoint = lastPoint;
      let timer = setInterval(() => {
        if(i >= ptArray.size - 1) clearInterval(timer);
        let item = ptArray.get(i);
        i++;
        if(isNaN(item.slope)) return 0;
        let newX = refPoint.get('x');
        let newY = refPoint.get('y');
        if(item.slope === Infinity) newY -= item.dist;
        else if(item.slope === -Infinity) newY += item.dist;
        else if((item.xDir && !item.yDir) || (!item.xDir && !item.yDir)){
          newY += (item.dist * Math.sin(Math.atan(item.slope)));
          newX += (item.dist * Math.cos(Math.atan(item.slope))) 
        }
        else if((!item.xDir && item.yDir) || (item.xDir && item.yDir)) {
          newY -= (item.dist * Math.sin(Math.atan(item.slope)));
          newX -= (item.dist * Math.cos(Math.atan(item.slope))) 
        }
        refPoint = new Immutable.Map({ x: newX, y: newY })
        this.setState(prevState =>  ({
          lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(new Immutable.Map({ x : newX, y : newY })))
        }));
        return 0;
      }, 30)
      this.setState({
        relArray: new Immutable.List()
      })
    }
  
    relativeCoordinatesForEvent(mouseEvent) {
      const boundingRect = this.refs.drawArea.getBoundingClientRect();
      return new Immutable.Map({
        x: mouseEvent.clientX - boundingRect.left,
        y: mouseEvent.clientY - boundingRect.top,
      });
    }
  
    render() {
      return (
        <div
          className="drawArea"
          ref="drawArea"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
        >
          <Drawing lines={this.state.lines} />
        </div>
      );
    }
  }
  
  function Drawing({ lines }) {
    return (
      <svg className="drawing">
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} />
        ))}
      </svg>
    );
  }
  
  function DrawingLine({ line }) {
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
    return <path className="path" d={pathData} />;
  }
  
  export default DrawArea;
  