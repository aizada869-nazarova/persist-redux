import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import favouritesReducer from "./reducers/favourites";
import jobsReducer from "./reducers/jobs";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { encryptTransform } from 'redux-persist-transform-encrypt'

export const initialState = {
  favourites: {
    elements: [],
  },
  jobs: {
    elements: [],
  },
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const mainReducer = combineReducers({
  favourites: favouritesReducer,
  jobs: jobsReducer,
});


const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    encryptTransform({
      secretKey: process.env.REACT_APP_SECRET_KEY, // this is mandatory
      onError: (error) => {
        // this is optional
        console.log('encryption error', Error)
      },
    }),
  ],
}

const persistedReducer = persistReducer(persistConfig, mainReducer)

export let configureStore = createStore(
  persistedReducer ,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
);


export const persistor = persistStore(configureStore)
