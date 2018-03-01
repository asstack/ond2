import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers/rootReducer';
import rootSaga from "../sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware),
    )
  );
//createLogger()
  sagaMiddleware.run(rootSaga);

  if(module.hot) {
    module.hot.accept('../reducers/rootReducer', () => {
      store.replaceReducer(rootReducer)
    })
  }

  return store
};

export default configureStore;