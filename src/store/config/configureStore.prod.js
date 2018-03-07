import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/rootReducer';
import rootSaga from "../sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();
const configureStore = preloadedState => {
  const store = createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;