import React from 'react';
import './App.css';
import Immutable from "immutable";
import levels from "./levels";

var allLevels = levels(window.innerHeight, window.innerWidth)
var levelNo = 0;

// var startPt= [[25,525],[75,525],[75,575], [25,575]];
var startPt = allLevels[levelNo].start;
var targetPt= allLevels[levelNo].target;
var obstacles= allLevels[levelNo].obstacles;
obstacles.push(targetPt)
let lineMax = 900;
let lineLength = 0;
let targetColor= "black";

class DrawArea extends React.Component {
    constructor() {
      super();
  
      this.state = {
        lines: new Immutable.List(),
        relArray : new Immutable.List(),
        isDrawing: false,
        isAnimating: false
      };
    }
  
    componentDidMount() {
      document.querySelector(".drawArea").style.height = window.innerHeight + "px";
      document.querySelector(".drawArea").style.width = window.innerWidth + "px";
      document.querySelector('#startPt').classList.add('animateSt');
      document.querySelector('#target').classList.add('animateTar');
      this.refs.drawArea.addEventListener('touchmove', (event) => this.handleMouseMove(event), false)
      this.refs.drawArea.addEventListener('touchend', (event) => this.handleMouseUp(event), false)
      this.refs.drawArea.addEventListener('touchstart', (event) => this.handleMouseDown(event), false)
    }
    switchLevel() {
      var len = allLevels.length;
      if(levelNo + 1 > len - 1) levelNo = 0;
      else levelNo ++;
       startPt = allLevels[levelNo].start;
 targetPt= allLevels[levelNo].target;
 obstacles= allLevels[levelNo].obstacles;
obstacles.push(targetPt)
    }
  
    handleMouseDown = (mouseEvent) => {
      targetColor = "black";
      document.querySelector('#startPt').classList.remove('animateSt');
      document.querySelector('#target').classList.add('animateTar');
      var touchPoint = [mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY];
      if (this.inside(touchPoint,targetPt)) this.switchLevel();
      if (!this.inside(touchPoint,startPt)) return;
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      clearInterval(this.timer)
      this.setState({
        lines: new Immutable.List()
      }, () => {
        this.setState(prevState => ({
          lines: prevState.lines.push(new Immutable.List([point])),
          isDrawing: true,
          isAnimating: false,
          relArray: new Immutable.List()
        }));
      })
    }
  
    inside(point, vs) {
      // ray-casting algorithm based on
      // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  
      var x = point[0], y = point[1];
  
      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
          var xi = vs[i][0], yi = vs[i][1];
          var xj = vs[j][0], yj = vs[j][1];
  
          var intersect = ((yi > y) != (yj > y))
              && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
          if (intersect) inside = !inside;
      }
  
      return inside;
  }
    handleMouseMove = (mouseEvent) => {
      if(lineLength > lineMax) return this.handleMouseUp()
      var touchPoint = [mouseEvent.touches[0].clientX, mouseEvent.touches[0].clientY];
        let collision = false;
        obstacles.map((item) => {
          if(collision) return;
          if(this.inside(touchPoint, item)) {
            this.emptyOut()
            collision = true;
          }
        })
      if (!this.state.isDrawing || this.state.isAnimating || collision) {
        return;
      }
      const point = this.relativeCoordinatesForEvent(mouseEvent);
      if(this.state.lines) {
        const listNumber = this.state.lines.size - 1;
        const pointNumber = this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size - 1 || 0;
        const prevPoint = this.state.lines.getIn([listNumber, pointNumber]);
        if(prevPoint){
      const slope = (prevPoint.get('y') - point.get('y')) / (prevPoint.get('x') - point.get('x'));
      const dist = Math.sqrt(Math.pow((prevPoint.get('y') - point.get('y')), 2) + Math.pow((prevPoint.get('x') - point.get('x')), 2));
      const xDir = point.get('y') < prevPoint.get('y');
      const yDir = point.get('x') < prevPoint.get('x');
      lineLength= lineLength + dist;
      this.setState(prevState =>  ({
        lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point)),
        relArray: prevState.relArray.push({ slope : slope, dist : dist, xDir: xDir, yDir: yDir })
      }));
    }
    }
    else this.setState(prevState =>  ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    }));
    }

    emptyOut(){
        let timer2 = setInterval(() => {
          if((this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size === 0) || !this.state.lines.get(this.state.lines.size - 1)) {
            this.setState({ 
            isAnimating: false,
          lines: new Immutable.List() }) 
            clearInterval(timer2);
            clearInterval(this.timer);
          }
          else {
            this.setState(prevState =>  ({
              lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
                if(line) {
               if(line.size > 25) {
                return line.splice(0,5) || line.splice(0,line.size - 1) && line
                }
                else return line.shift()
              }
              })
            }))
          }
      }, 20)
        this.setState({
          relArray: new Immutable.List(),
          isAnimating: true
        })
      }
  
    handleMouseUp() {
      document.querySelector('#startPt').classList.add('animateSt');
      document.querySelector('#target').classList.add('animateTar');
      lineLength = 0;
      this.setState({ isDrawing: false });
      const listNumber = this.state.lines.size - 1;
      const pointNumber = this.state.lines.get(this.state.lines.size - 1) && this.state.lines.get(this.state.lines.size - 1).size - 1;
      const lastPoint = this.state.lines.getIn([listNumber, pointNumber]);
      if(pointNumber > 8)
      lastPoint && !this.state.isAnimating && pointNumber && this.animateLine(lastPoint, this.state.relArray);
      else this.emptyOut();
    }
    animateLine (lastPoint, ptArray) {
      this.setState({
        isAnimating: true
      })
      let i = 0;
      let refPoint = lastPoint;
      this.timer = setInterval(() => {
        let collPt = [refPoint.get('x'),refPoint.get('y')];
        let collision = false;
        obstacles.map((item, index) => {
          if(collision) return;
          if(this.inside(collPt, item)) {
            clearInterval(this.timer);
            if(index === obstacles.length - 1) {
              document.querySelector('#target').classList.remove('animateTar');
      document.querySelector('#startPt').classList.remove('animateSt');
              targetColor = "rgba(182, 230, 23, 1)";
            }
            this.emptyOut();
            collision = true;
          }
        })
        if(i >= ptArray.size - 1) {
          clearInterval(this.timer);
          if(refPoint.get('x') < window.innerWidth && refPoint.get('x') > 0 && refPoint.get('y') < window.innerHeight && refPoint.get('y') > 0) this.animateLine(refPoint, this.state.relArray)
          else {
          this.emptyOut();
        }
        } else if(!collision) {
          let item = ptArray.get(i);
          i++;
          if(!item) return;
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
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line && line.push(refPoint))
          }));
          this.setState(prevState =>  ({
            lines: prevState.lines.updateIn([prevState.lines.size - 1], line => {
              if(line) {
              if(line.size > 25) {
               return line.splice(0,5) || line.splice(0,line.size) && line
               }
               else return line.shift()
              }
              })
          }));
          return 0;
        }
      }, 20)
    }
  
    relativeCoordinatesForEvent(mouseEvent) {
      const boundingRect = this.refs.drawArea.getBoundingClientRect();
      return new Immutable.Map({
        x: mouseEvent.touches[0].clientX - boundingRect.left,
        y: mouseEvent.touches[0].clientY - boundingRect.top,
      });
    }
  
    render() {
      return (
        <div>
          <div
            id="jaz"
            className="drawArea"
            ref="drawArea"
          >
            <Drawing lines={this.state.lines} />
          </div>
        </div>
      );
    }
  }
  
  function Drawing({ lines }) {
    return (
      <svg className="drawing">
      <defs>
      rgba(245, 245, 245, 1) 0%, rgba(213, 238, 245, 1) 11%, rgba(188, 233, 245, 1) 23%, rgba(150, 226, 245, 1) 34%,
       rgba(127, 225, 250, 1) 46%, rgba(98, 216, 245, 1) 57%,
       rgba(74, 215, 247, 1) 67%, rgba(67, 207, 242, 1) 78%, rgba(53, 196, 240, 1) 89%, rgba(10, 184, 247, 1) 100%
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="rgba(249, 250, 247, 1)" stopOpacity="1" />
      <stop offset="10%" stopColor="rgba(243, 250, 223, 1)" stopOpacity="1" />
      <stop offset="20%" stopColor="rgba(238, 250, 200, 1)" stopOpacity="1" />
      <stop offset="30%" stopColor="rgba(226, 250, 147, 1)" stopOpacity="1" />
      <stop offset="40%" stopColor="rgba(222, 252, 131, 1)" stopOpacity="1" />
      <stop offset="50%" stopColor="rgba(221, 255, 120, 1)" stopOpacity="1" />
      <stop offset="60%" stopColor="rgba(207, 247, 86, 1)" stopOpacity="1" />
      <stop offset="70%" stopColor="rgba(197, 235, 70, 1)" stopOpacity="1" />
      <stop offset="80%" stopColor=" rgba(182, 230, 23, 1)" stopOpacity="1" />
      <stop offset="100%" stopColor=" rgba(144, 230, 58, 1)" stopOpacity="1" />
    </linearGradient>
    <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgba(225, 225, 225, 1)" stopOpacity="1" />
      <stop offset="11%" stopColor="rgba(213, 238, 245, 1)" stopOpacity="1" />
      <stop offset="23%" stopColor="rgba(188, 233, 245, 1)" stopOpacity="1" />
      <stop offset="34%" stopColor="rgba(150, 226, 245, 1)" stopOpacity="1" />
      <stop offset="46%" stopColor="rgba(127, 225, 250, 1)" stopOpacity="1" />
      <stop offset="57%" stopColor="rgba(98, 216, 245, 1)" stopOpacity="1" />
      <stop offset="67%" stopColor="rgba(67, 207, 242, 1)" stopOpacity="1" />
      <stop offset="78%" stopColor="rgba(53, 196, 240, 1)" stopOpacity="1" />
      <stop offset="89%" stopColor=" rgba(50, 184, 247, 1)" stopOpacity="1" />
      <stop offset="100%" stopColor=" rgba(74, 215, 247, 1)" stopOpacity="1" />
    </linearGradient>
    </defs>
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} stroke= "url(#grad2)" strokeWidth={15} className="path" />
        ))}
        {lines.map((line, index) => (
          <DrawingLine key={index} line={line} stroke= "url(#grad2)" strokeWidth = {5} className="path2" />
        ))}
        <polygon className="startPt" id="startPt" points={startPt.toString()} />
        {obstacles.map((item,index) => <polygon key={index} className="obstacle" points= {item.toString()} />)}
        <polygon className="targetPtInitial" id="target" points={targetPt.toString()} style= {{ fill: targetColor }}/>
      </svg>
    );
  }
  
  function DrawingLine({ line, stroke, strokeWidth, className }) {
    if(line.size <= 0) return null;
    const pathData = "M " +
      line
        .map(p => {
          return `${p.get('x')} ${p.get('y')}`;
        })
        .join(" L ");
    return <path className={className} d={pathData} stroke= {stroke} strokeWidth={strokeWidth} />;
  }
  
  export default DrawArea;
  