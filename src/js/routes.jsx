import React from "react"
import { Route, Switch, withRouter } from "react-router-dom"

import styles from "../style/index.scss"
import SearchView from "./views/SearchView/SearchView"
import Header from "./common/components/Header/Header"
import Footer from "./common/components/Footer/Footer"

// This show case how you can access routing info in your component
const HeaderWithRouter = withRouter(props => <Header {...props} />)

module.exports = (
  <div className={styles.container}>
    <HeaderWithRouter />
    <div className={styles.content}>
      <Switch>
        <Route exact path="/search" component={SearchView} />
        {/* <Route path="/page" component={JustAnotherPage} /> */}
        <Route path="*" component={SearchView} />
      </Switch>
    </div>
    <Footer />
  </div>
)
