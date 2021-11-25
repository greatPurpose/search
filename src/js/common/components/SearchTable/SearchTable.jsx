import React, { PureComponent } from 'react';
import web3 from 'web3';
import ReactTableContainer from "react-table-container";
import { TableHead } from 'reactstrap';
import { Spinner } from 'react-bootstrap';

import { getConcentratedAddr, formatMoney} from '../../services/helpers';
import MyTooltip from '../MyTooltip/MyTooltip';
import { Status } from '../../../redux/modules/order';

import './SearchTable.scss';

class SearchTable extends PureComponent { 
  constructor(props) {
    super(props);

    this.state = {
      tableData : props.tableData,
      curSortIndex: -1,
      curSortState: false
    };
  }

  buttonItem = (row, i) => {
    const { isAllowanced, orderList, getOrder, fillOrder } = this.props;

    if (orderList) {
      const index = orderList.map(item => item.id).indexOf(row.orderId);
      
      if (index >= 0) {
        if (orderList[index].excutionStatus) {
          return orderList[index].excutionStatus === Status.DOING
            ? (<button className='btn-take enabled loading' disabled >
                <Spinner
                  className="loading"
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              </button>)
            : orderList[index].execution
              ? <button className='btn-take disabled' disabled>Taken</button>
              : <button className='btn-take failed' disabled>Failed</button>
        }

        else if (orderList[index].validationStatus) {
          return orderList[index].validationStatus === Status.DOING
            ? (<button className='btn-take enabled loading' disabled >
                <Spinner
                  className="loading"
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              </button>)
            : orderList[index].validation
              ? <button className='btn-take enabled' onClick={() => fillOrder(row) }>Confirm</button>
              : <button className='btn-take failed' disabled>Failed</button>
        }
      }
    }

    return isAllowanced 
      ? <button className='btn-take enabled' onClick={() => getOrder(row.orderId)}>Take</button>
      : (<React.Fragment>
          <button id={'btn-tooltip'+i} className='btn-take disabled'>Take</button>
          <MyTooltip className='tooltip-my' id={'btn-tooltip'+i} text='Set allowance before taking.'/>
        </React.Fragment>)
  }

  render () {
    const { searchData } = this.props;
    return (
      <div className="TableSearchWrapper">
        <ReactTableContainer 
          className='rtc' 
          width="100%" 
          height={ searchData ? "635px" : "135px" }
          customHeader={[TableHead]}
          scrollbarStyle={{
            background: { 
              marginRight: '5px',
              backgroundColor: "transparent" 
            },
            backgroundFocus: { 
              marginRight: '5px',
              backgroundColor: "transparent" 
            },
            foreground: { 
              marginRight: '5px',
              opacity: 0.28,
              borderRadius: '6.5px',
              backgroundColor: '#000000' 
            },
            foregroundFocus: { 
              marginRight: '5px',
              opacity: 0.28,
              borderRadius: '6.5px',
              backgroundColor: '#000000' 
            },
          }}
     
        >

          <table className={`table-search ${searchData ? '' : 'no-orders'}`}>

            <thead>
              <tr>
                <th width='1000px'>
                  <div style={{minWidth:'150px'}}>
                    <span>ID</span>
                  </div>
                </th>
                <th width='1000px'>
                  <div style={{minWidth:'100px'}}>
                    <span>Price</span>
                  </div>
                </th>
                <th width='1000px'>
                  <div style={{minWidth:'150px'}}>
                    <span>Size</span>
                  </div>
                </th>
                <th width='1000px'>
                  <div style={{minWidth:'300px'}}>
                    <span>Expiration</span>
                  </div>
                </th>
                <th width='1000px'>
                  <div style={{minWidth:'250px'}}>
                    <span></span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
            {searchData
              ? searchData.quotes.map((row, i) => (
                <tr key={i}>
                  <td >{getConcentratedAddr(row.orderId)}</td>
                  <td >
                    { formatMoney(web3.utils.fromWei(row.price)) + ' ' + searchData.quoteAssetName}
                  </td>
                  <td >
                    {formatMoney(web3.utils.fromWei(row.size)) + getConcentratedAddr( searchData.baseAssetName) + ' / ' 
                    + formatMoney(web3.utils.fromWei(row.size) / web3.utils.fromWei(row.price)) + getConcentratedAddr(searchData.quoteAssetName)}
                    </td>
                  <td >{new Date(Number(row.expiration)).toString()}</td>
                  <td>
                    <div className="button-item">
                      {this.buttonItem(row, i)}
                      {row.txId 
                        ? <a className='link_etherscan' target='_blank' href={`https://etherscan.io/tx/${row.txId}`}>View on Etherscan</a>
                        : null
                      }
                    </div>
                  </td>
                </tr>)
                )
              : <tr className='tr-no-order'><td colSpan="5">No orders to display</td></tr>
              }
            </tbody>

          </table>
        </ReactTableContainer>
      </div>
    )
  }
}

export default SearchTable;
