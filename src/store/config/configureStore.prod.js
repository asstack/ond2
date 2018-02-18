import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from '../reducers/rootReducer';
import rootSaga from "../sagas/rootSaga";

const sagaMiddleware = createSagaMiddleware();
const configureStore = preloadedState => createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(sagaMiddleware),
  );

sagaMiddleware.run(rootSaga);

export default configureStore;