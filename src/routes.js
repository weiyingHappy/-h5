import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import React from 'react'
import config from '../config/config'
import { Router, Route, IndexRoute, Redirect, hashHistory, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import { combineReducers } from 'redux'
import reducers from './reducers'

const loggerMiddleware = createLogger();


let comp = config.debug?(
    compose(
        applyMiddleware(
            thunkMiddleware
            // loggerMiddleware
        ),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
):(
    compose(
        applyMiddleware(
            thunkMiddleware
            // loggerMiddleware
        ),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

let store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    }),
    comp
);

function errorLoading(error) {
    NProgress.done()
    throw new Error(`Dynamic page loading failed: ${error}`);
}


function loadRoute(cb) {
    NProgress.done()
    return module => cb(null, module.default);
}

const test = () => {
    return (
        <div>hello</div>
    )
};

NProgress.configure({ showSpinner: false })

const history = syncHistoryWithStore(browserHistory, store)

history.listen(() => {
    NProgress.start()
})

import {NotFoundPage} from './page/custom/NotFoundPage'
const Root = () => {
    return (
        <Provider store={store}>
            <Router history={history}>
                {/* 主入口页面路由 */}
                <Route path="/cmsfont/entrance/:hotel_token/:alias" getComponent = {(location, cb) => {
                    System.import('@/src/page/entrance')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }}></Route>
                <Route path="/cmsfont/entrance/:hotel_token/:alias/:room_id" getComponent = {(location, cb) => {
                    System.import('@/src/page/entrance')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }}></Route>

                {/* 老代码-开始 */}
                <Route path="/cmsfont/index/:token" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Index')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/rooms" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Rooms')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                {/* 兼容代码，将老地址重定向到新入口 */}
                <Redirect from="/cmsfont/rooms/:token" to="/cmsfont/entrance/:token/1" />
                <Redirect from="/cmsfont/myorder/:token" to="/cmsfont/entrance/:token/2" />
                {/* <Route path="/cmsfont/rooms/:token" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Rooms')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/> */}
                <Route path="/cmsfont/register" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Register')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/intro" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Intro')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/snap" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Snap')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/my" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/My')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/roomInfo/:id" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/RoomInfo')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/chooseDate" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/DatePicker')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/orderGenerate" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/OrderGenerate')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/payPage" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/PayPage')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/paySuccess" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/paySuccess')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/uniPay/:order_no" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/UniPay')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/setting" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Setting')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/myorder" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/MyOrder')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/ShowOrder/:id" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/ShowOrder')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/CommentOrder" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/CommentOrder')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/ShowComment" getComponent = {(location, cb)=>{
                        System.import('./page/one/components/show-comment')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/Accumulate" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Accumulate')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/toYouZhu/:token" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/ToYouZhu')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/refundProgress" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/RefundProgress')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/chooseCoupon" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/ChooseCoupon')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/luggage" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/Luggage')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/choose_wuyou_order" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/ChooseOrderForLuggage')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/luggageOrders" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/LuggageOrders')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/luggageOrderInfo/:id" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/LuggageOrderInfo')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/wallet" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/wallet')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/wallet_log" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/wallet_log')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/coupon_rule" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/Coupon_rule')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }} />
                <Route path="/cmsfont/error" getComponent = {(location, cb)=>{
                    System.import('./page/custom/ErrorPage')
                        .then(loadRoute(cb))
                        .catch(errorLoading);
                }}/>
                <Route path="/cmsfont/404" getComponent = {(location, cb)=>{
                        System.import('./page/custom/NotFoundPage')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/coupon" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/Coupon')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/chooseCoupon" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/ChooseCoupon')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/exchangeCoupon" getComponent = {(location, cb)=>{
                        System.import('./page/one/containers/ExchangeCoupon')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
                <Route path="/cmsfont/comments" getComponent = {(location, cb) => {
                    System.import('./page/one/containers/CommentPage')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }}/>
                
                {/* 老代码-结束 */}
                
                {/* 用户信息错误时统一跳转 */}
                <Route path="/cmsfont/not_user" getComponent = {(location, cb) => {
                    System.import('@/src/page/custom/NotUserInfo')
                        .then(loadRoute(cb))
                        .catch(errorLoading)
                }}></Route>

                {
                    /**
                     * 路由v2版本
                     */
                }
                <Route path='/cmsfont/v2'>
                    <Route path='home' getComponent = {(location, cb) => {
                        System.import('@/src/page/two/home')
                            .then(loadRoute(cb))
                            .catch(errorLoading)
                    }}></Route>
                    <Route path='home2' getComponent = {(location, cb) => {
                        System.import('@/src/page/two/home')
                            .then(loadRoute(cb))
                            .catch(errorLoading)
                    }}></Route>
                </Route>

                <Route path="*" getComponent = {(location, cb)=>{
                        System.import('./page/custom/NotFoundPage')
                            .then(loadRoute(cb))
                            .catch(errorLoading);
                    } }/>
            </Router>
        </Provider>
    )
};



export default Root;