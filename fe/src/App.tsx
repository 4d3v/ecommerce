import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom'
import axios from 'axios'
import Header from './components/Header'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import CartScreen from './screens/CartScreen'
import LoginScreen from './screens/LoginScreen'
import SignUpScreen from './screens/SignUpScreen'
import ProfileScreen from './screens/ProfileScreen'
import MyOrdersScreen from './screens/MyOrdersScreen'
import ShippingScreen from './screens/ShippingScreen'
import PaymentScreen from './screens/PaymentScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderScreen from './screens/OrderScreen'
import Footer from './components/Footer'
import './styles/App.scss'
import { BASE_URL } from './constants/endPoints'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import UserListScreen from './screens/UserListScreen'
import UserEditScreen from './screens/UserEditScreen'

declare global {
  interface Window {
    paypal: any
  }
}

const App = () => {
  const [paycId, setPaycId] = useState('NOT_SET')
  const initialPaypalOptions = {
    'client-id': paycId,
    currency: 'USD',
    intent: 'capture',
  }
  useEffect(() => {
    const getPaypalClientId = async () => {
      const {
        data: {
          data: { paypal_client_id },
        },
      } = await axios.get(`${BASE_URL}/config/paypal`)

      setPaycId(paypal_client_id)
    }

    if (paycId === 'NOT_SET') getPaypalClientId()
  }, [paycId])

  return (
    <Router>
      {paycId !== 'NOT_SET' && (
        <PayPalScriptProvider options={initialPaypalOptions}>
          <Header />
          <main>
            <Switch>
              <Route path='/placeorder' component={PlaceOrderScreen} exact />
              <Route path='/payment' component={PaymentScreen} exact />
              <Route path='/shipping' component={ShippingScreen} exact />
              <Route path='/signup' component={SignUpScreen} exact />
              <Route path='/login' component={LoginScreen} exact />
              <Route path='/profile' component={ProfileScreen} exact />
              <Route path='/myorders' component={MyOrdersScreen} exact />
              <Route path='/order/:orderid' component={OrderScreen} exact />
              <Route path='/product/:id' component={ProductScreen} exact />
              <Route path='/topics' component={Topics} exact />
              <Route path='/cart/:id?' component={CartScreen} exact />
              <Route path='/admin/users' component={UserListScreen} exact />
              <Route
                path='/admin/user/:userid'
                component={UserEditScreen}
                exact
              />
              <Route path='/' component={HomeScreen} exact />
            </Switch>
          </main>
          <Footer />
        </PayPalScriptProvider>
      )}
    </Router>
  )
}

function Topics() {
  let match = useRouteMatch()

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic />
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  )
}

function Topic() {
  let { topicId }: any = useParams()
  return <h3>Requested topic ID: {topicId}</h3>
}

export default App
