import React from 'react';
import styled from 'styled-components';

const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%; 
  border: red 0px solid;
  position: relative;
  margin: 0 auto ;
  background: #4e5660;
  background: -moz-radial-gradient(center, ellipse cover,  #4e5660 10%, #000000 76%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(10%,#4e5660), color-stop(76%,#000000));
  background: -webkit-radial-gradient(center, ellipse cover,  #4e5660 10%,#000000 76%);
  background: -o-radial-gradient(center, ellipse cover,  #4e5660 10%,#000000 76%);
  background: -ms-radial-gradient(center, ellipse cover,  #4e5660 10%,#000000 76%);
  background: radial-gradient(ellipse at center,  #4e5660 10%,#000000 76%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4e5660', endColorstr='#000000',GradientType=1 );
  
  & .center {
    left: 50%;
    top: 50%;
  }
  
  & .full {
      width: 100%;
      height: 100%;
      position: absolute;
      overflow: hidden;
    }
    
    & .outer {
      position: absolute;
      width: 380px; height: 900px; border: 1px solid; border-top: none; border-bottom: none; 
      left: 260px;
    }
    
    & .outer div {
      width: 260px;  height: 100%; border: 1px solid; border-top: none; border-bottom: none; margin: 0 auto;
    }
      
    & .linesRight, .linesLeft {
      position: absolute;
      top: 225px;
      float: left;
      width: 900px;
    }
    
    & .line {
      border-bottom: 1px solid;
      margin-bottom: 150px;
    }
    
    & .left {
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
    }
    
    & .right {
      -webkit-transform: rotate(-30deg);
      transform: rotate(-30deg);
    }
      
    & .circle {
      position: absolute;
      width: 380px;
      height: 380px;
      border: 1px solid;
      border-radius:100%;
      top: 261px;
      left: 260px;
    }
    
    & .circle div {
      position: absolute;
      width: 260px;
      height: 260px;
      border: 1px solid;
      border-radius:100%;
      top: 60px;
      left: 60px;
    }
    
    & .hex {
      position: absolute;
      width: 370px;
      height: 440px;
      border: 1px solid;
      top: 232px;
      left: 265px;
      border: none;
    }
    
    & .hex div {
      position: absolute;
      border-bottom: 1px solid;
    }
    
    & .side_01 {
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
      width: 214px;
      left: 170px;
      top: 53px;
    }
    
    & .side_02 {
      width: 228px;
      right: -113px;
       -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
      top: 220px;
    }
    
    & .side_03 {
      -webkit-transform: rotate(150deg);
      transform: rotate(150deg);
      width: 214px;
      left: 171px;
      top: 386px;
    }
    
    & .side_04 {
      -webkit-transform: rotate(30deg);
      transform: rotate(30deg);
      width: 214px;
      left: -15px;
      top: 386px;
    }
    
    & .side_05 {
      width: 228px;
       -webkit-transform: rotate(90deg);
      transform: rotate(90deg);
      top: 220px;
      left: -113px;
    }
    
    & .side_06 {
      -webkit-transform: rotate(150deg);
      transform: rotate(150deg);
      width: 214px;
      left: -15px;
      top: 54px;
    }
      
    & .full div {
      opacity: 0.9;
      border-color: #fff;
    }
    
    & .empty div {
      opacity: 1;
      border-color: #4e5660;
    }
      
    & .text {
      position: absolute;
      z-index: 20;
      width: 900px;
      text-align: center;
      bottom: 120px;
      font: 40px/45px 'Open Sans', sans-serif;
      letter-spacing: 4px;
      background-color: rgba(0,0,0,0.2);
    }
      
    & .fullLeft, .fullRight {
      opacity: 0;
    }
    
    & .fullLeft {
      clip: rect(0px, 450px, 900px, 450px);
      -webkit-animation: leftAni 5s; /* Chrome, Safari, Opera */
      animation: leftAni 5s;
      -webkit-animation-iteration-count: infinite;
      animation-iteration-count: infinite;
    }
    
    @-webkit-keyframes leftAni {
      0% {clip: rect(0px, 450px, 900px, 450px);opacity: 0;}
      75% {clip: rect(0px, 450px, 900px, 200px);opacity: 1;}
      100% {clip: rect(0px, 450px, 900px, 450px));opacity: 0;}
    }
    
    @keyframes leftAni {
      0% {clip: rect(0px, 450px, 900px, 450px));opacity: 0;}
      75% {clip: rect(0px, 450px, 900px, 200px); opacity: 1;}
      100% {clip: rect(0px, 450px, 900px, 450px)); opacity: 0;}
    }
    
    
    & .fullRight {
      clip: rect(0px, 450px, 900px, 450px);
      -webkit-animation: rightAni 5s; /* Chrome, Safari, Opera */
      animation: rightAni 5s;
      -webkit-animation-iteration-count: infinite;
      animation-iteration-count: infinite;  
    }
    
    @-webkit-keyframes rightAni {
      0% {clip: rect(0px, 450px, 900px, 450px); opacity: 0;}
      75% {clip: rect(0px, 700px, 900px, 450px); opacity: 1;}
      100% {clip: rect(0px, 450px, 900px, 450px)); opacity: 0;}
    }
    
    @keyframes rightAni {
      0% {clip: rect(0px, 450px, 900px, 450px)); opacity: 0;}
      75% {clip: rect(0px, 700px, 900px, 450px); opacity: 1;}
      100% {clip: rect(0px, 450px, 900px, 450px)); opacity: 0;}
    }
`;

const Mask = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: -moz-radial-gradient(center, ellipse cover,  rgba(0,0,0,0) 0%, rgba(0,0,0,1) 76%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(0,0,0,0)), color-stop(76%,rgba(0,0,0,1)));
  background: -webkit-radial-gradient(center, ellipse cover,  rgba(0,0,0,0) 0%,rgba(0,0,0,1) 76%);
  background: -o-radial-gradient(center, ellipse cover,  rgba(0,0,0,0) 0%,rgba(0,0,0,1) 76%);
  background: -ms-radial-gradient(center, ellipse cover,  rgba(0,0,0,0) 0%,rgba(0,0,0,1) 76%);
  background: radial-gradient(ellipse at center,  rgba(0,0,0,0) 0%,rgba(0,0,0,1) 76%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#000000',GradientType=1 );
`;

const Spacing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
`;

const DestinyLoader = () => {
  return(
    <LoaderWrapper>
      <Mask />
      <Spacing />

      <div className="center">
        <div className="empty">
          <div className="linesLeft">
            <div className="line left no1" />
            <div className="line left no2" />
            <div className="line left no3" />
            <div className="line left no4" />
          </div>

          <div className="linesRight">
            <div className="line right no1" />
            <div className="line right no2" />
            <div className="line right no3" />
            <div className="line right no4" />
          </div>

          <div className="outer"><div /></div>
        </div>

        <div className="full fullLeft">
          <div className="linesLeft">
            <div className="line left" />
            <div className="line left" />
            <div className="line left" />
            <div className="line left" />
          </div>

          <div className="linesRight">
            <div className="line right" />
            <div className="line right" />
            <div className="line right" />
            <div className="line right" />
          </div>

          <div className="circle"><div /></div>
          <div className="outer"><div /></div>

          <div className="hex">
            <div className="side_01" />
            <div className="side_02" />
            <div className="side_03" />
            <div className="side_04" />
            <div className="side_05" />
            <div className="side_06" />
          </div>
        </div>

        <div className="full fullRight">

          <div className="linesLeft">
            <div className="line left" />
            <div className="line left" />
            <div className="line left" />
            <div className="line left" />
          </div>

          <div className="linesRight">
            <div className="line right" />
            <div className="line right" />
            <div className="line right" />
            <div className="line right" />
          </div>

          <div className="circle"><div /></div>
          <div className="outer"><div /></div>

          <div className="hex">
            <div className="side_01" />
            <div className="side_02" />
            <div className="side_03" />
            <div className="side_04" />
            <div className="side_05" />
            <div className="side_06" />
          </div>
        </div>
      </div>
    </LoaderWrapper>
  )
};

export default DestinyLoader;