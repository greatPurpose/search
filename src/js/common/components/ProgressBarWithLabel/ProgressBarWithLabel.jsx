import React from 'react';
import './ProgressBarWithLabel.scss';
import { Progress } from 'reactstrap';
import styled, { css } from "styled-components";

const LabelProgress = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    div {
        width: 25%;
        height: 27px;
        margin-top: 7px;
        opacity: 0.25;
        font-size: 20px;
        font-weight: 500;
        font-family: DINPro-Medium;
        text-align: center;
        color: #4a4a4a;            
    }
    div:first-child {
      width: 12.5%;
      text-align: left;
      opacity: ${props=> (props.v > 0) && '0.75'}
    }
    div:nth-child(2) {
      opacity: ${props=> (props.v >= 25) && '0.75'}
    }
    div:nth-child(3) {
      opacity: ${props=> (props.v >= 50) && '0.75'}
    }
    div:nth-child(4) {
      opacity: ${props=> (props.v >= 75) && '0.75'}
    }
    div:last-child {
      width: 12.5%;
      text-align: right;
      opacity: ${props=> (props.v >= 100) && '0.75'}
    }  
`

const ProgressBarWithLabel = ({v}) => (
  <div className="div-labelprogress">
    {v > 0
      ? (<Progress className={v>100?'danger':''} value={v}/>)
      : (<Progress className={'danger'} value={2.5}/>)
    }
    <LabelProgress v={v}>
      <div >0%</div>
      <div>25%</div>
      <div>50%</div>
      <div>75%</div>
      <div>100%</div>
    </LabelProgress>

  </div>
);

export default ProgressBarWithLabel;
