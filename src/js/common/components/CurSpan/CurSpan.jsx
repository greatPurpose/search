import React from 'react';
import styled from "styled-components";

import './CurSpan.scss';

const CurSpan = ({curType, enabled}) => (
  <div className="span-currency">
    <div className={enabled? curType : 'disabled'}>
      {curType}
    </div>
  </div>
);

const ShortCurSpan = styled.span`
  height: 16px;
  padding-left: 4px;
  padding-right: 4px;
  opacity: 0.5;
  font-family: DIN-Medium;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 0.7px;
  border-radius: 1px;
  text-align: center;
  background-color: #7f7f7f;        
  color: #ffffff;          
  background-color: ${props => 
                      props.enabled 
                      ? props.caption == 'WETH' 
                        ? '#ed1e79'
                        : props.caption == 'DAI'
                          ? '#fdb134'
                          : props.caption == 'ZRX'
                            ? '#00ae99'
                            : '#7f7f7f'  //USD
                      : '#838383' }
  opacity: ${props => props.caption == 'USD' ? '0.5': '1'}
`

const MiddleCurSpan = styled.span`
  height: 23px;
  padding-left: 8px;
  padding-right: 8px;
  opacity: 0.5;
  font-family: DIN-Medium;
  font-size: 17px;
  line-height: 22px;
  font-weight: bold;
  letter-spacing: 1.4px;
  border-radius: 2px;
  text-align: center;
  background-color: #7f7f7f;        
  color: #ffffff;          
  background-color: ${props => 
                      props.enabled 
                      ? props.caption == 'WETH' 
                        ? '#ed1e79'
                        : props.caption == 'DAI'
                          ? '#fdb134'
                          : props.caption == 'ZRX'
                            ? '#00ae99'
                            : '#7f7f7f'  //USD
                      : '#838383' }
  opacity: ${props => props.caption == 'USD' ? '0.5': '1'}
`
export {CurSpan, ShortCurSpan, MiddleCurSpan};
