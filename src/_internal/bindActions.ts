import { bindActionCreators, Dispatch } from 'redux';

export default function<AS>(actions: AS, dispatch: Dispatch<any>) {
  const boundActionCreators = {};
  // 遍历 actions, 为了绑定 async action
  // eslint-disable-next-line no-restricted-syntax
  for (const key in actions) {
    if (Object.prototype.hasOwnProperty.call(actions, key)) {
      const actionCreator = actions[key];
      // @ts-ignore
      boundActionCreators[key] = bindActionCreators(actionCreator, dispatch);
    }
  }
  return boundActionCreators as AS;
}
