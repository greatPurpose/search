import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
// You could use BrowserRoute or HashRoute
// But passing in history directly to Route will
// give your app more flexibility on deeper integration of `history`
import { Router } from 'react-router-dom'

import I18NProvider from 'common/components/Utilities/I18NProvider'

import { actions as tickerActions } from './redux/modules/ticker';
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  ticker: state.ticker,
})

const mapDispatchToProps = {
  ...tickerActions,
}
@connect(mapStateToProps, mapDispatchToProps)
export default class Root extends React.PureComponent {
  constructor(props){
    super(props);
    const {getTicker} = props;
    getTicker();
  }
  get content() {
    const { routes, history } = this.props

    return <Router history={history}>{routes}</Router>
  }

  render() {
    const { store } = this.props

    return (
      <I18NProvider>
        <Provider store={store}>{this.content}</Provider>
      </I18NProvider>
    )
  }
}

Root.propTypes = {
  history: PropTypes.object.isRequired,
  routes: PropTypes.element.isRequired,
  store: PropTypes.object.isRequired,
}
