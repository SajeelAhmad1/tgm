/* eslint-env jest */
require('react-native-gesture-handler/jestSetup');

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({children}) => children,
    Screen: ({children}) => children,
  }),
}));

const asyncStorageStore = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(key =>
      Promise.resolve(
        Object.prototype.hasOwnProperty.call(asyncStorageStore, key)
          ? asyncStorageStore[key]
          : null,
      ),
    ),
    setItem: jest.fn((key, value) => {
      asyncStorageStore[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn(key => {
      delete asyncStorageStore[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      for (const k of Object.keys(asyncStorageStore)) {
        delete asyncStorageStore[k];
      }
      return Promise.resolve();
    }),
  },
}));
