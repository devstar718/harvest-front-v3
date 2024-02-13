import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Tutorial from './pages/Tutorial'
import BeginnersFarm from './pages/BeginnersFarm'
import Portfolio from './pages/Portfolio'
import Farm from './pages/Farm'
import Analytic from './pages/Analytic'
import FAQ from './pages/FAQ'
import Sidebar from './components/Sidebar'
import AdvancedFarm from './pages/AdvancedFarm'
import WidoDetail from './pages/WidoDetail'
import Charts from './pages/Charts'
import { ROUTES } from './constants'
import { Body, GlobalStyle } from './components/GlobalStyle'
import Modal from './components/Modal'
import Providers from './providers'
import '@fontsource/work-sans'
import '@fontsource/dm-sans'
import 'bootstrap/dist/css/bootstrap.min.css'

const NewLoginModal = () => {
  const newLogin = localStorage.getItem('newLogin')
  const [open, setOpen] = useState(false)
  localStorage.setItem('darkmode', false)
  const [showModal, setShowModal] = useState(true)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    if (queryParams.has('utm_source') || queryParams.has('utm_medium')) {
      setShowModal(false) // Don't show the modal if the parameters are present
      return
    }

    if (newLogin === null || newLogin === 'true') {
      localStorage.setItem('newLogin', true)
      setOpen(true)
    }
  }, [newLogin])

  return (
    <>
      {showModal && newLogin ? (
        <Modal
          title="Important Notice"
          confirmationLabel="I certify that I read and agree with this warning"
          open={open}
          onClose={() => {
            setOpen(false)
            localStorage.setItem('newLogin', false)
          }}
        >
          Due to regulatory uncertainty, Harvest Finance is not available to people or companies,
          who are residents in the <b>United States</b> or other restricted territory, or who are
          subject to other restrictions. <br /> <br /> By interacting with the Harvest Finance
          website and/or smart contracts, the user acknowledges the experimental nature of yield
          farming with Harvest Finance, its dependency on 3rd party protocols, and the potential for
          total loss of funds deposited. The user accepts full liability for their usage of Harvest
          Finance, and no financial responsibility is placed on the protocol developers and
          contributors.
        </Modal>
      ) : null}
    </>
  )
}

const App = () => (
  <Router>
    <GlobalStyle />
    <ToastContainer />
    <NewLoginModal />
    <Providers>
      <Body id="page-content">
        <Sidebar width="280px" />
        <Switch>
          <Route exact path={ROUTES.PORTFOLIO} component={Portfolio} />
          <Route exact path={ROUTES.TUTORIAL} component={Tutorial} />
          <Route exact path={ROUTES.BEGINNERSFARM} component={BeginnersFarm} />
          <Route exact path={ROUTES.ADVANCED} component={Farm} />
          <Route exact path={ROUTES.ANALYTIC} component={Analytic} />
          <Route path={ROUTES.ADVANCEDFARM} component={AdvancedFarm} />
          <Route path={ROUTES.WIDODETAIL} component={WidoDetail} />
          <Route path={ROUTES.FAQ} component={FAQ} />
          <Route exact path={ROUTES.CHARTS} component={Charts} />
        </Switch>
      </Body>
    </Providers>
  </Router>
)

export default App
