### 🙋‍♂️ fork by [react-hanger](https://github.com/kitze/react-hanger)

# gm-react-hanger

[![npm version](https://badge.fury.io/js/gm-react-hanger.svg)](https://badge.fury.io/js/gm-react-hanger)

Set of a helpful hooks, for different specific to some primitives types state changing helpers.
Has two APIs:

- [First](#Example) and original from v1 is based on object destructuring e.g. `const { value, toggle } = useBoolean(false)` (Docs below)
- [Second API](./README-ARRAY.md) (recommended [why?](./README-ARRAY.md#migration-from-object-to-array-based)) is based on more idiomatic to React hooks API, e.g. like `useState` with array destructuring
  `const [value, actions] = useBoolean(false)` [(Docs)](./README-ARRAY.md)

## Install

```bash
yarn add gm-react-hanger
```

## Usage

```jsx
import React, { Component } from 'react';

import { useInput, useBoolean, useNumber, useArray, useOnMount, useOnUnmount } from 'react-hanger';

const App = () => {
  const newTodo = useInput('');
  const showCounter = useBoolean(true);
  const limitedNumber = useNumber(3, { lowerLimit: 0, upperLimit: 5 });
  const counter = useNumber(0);
  const todos = useArray(['hi there', 'sup', 'world']);

  const rotatingNumber = useNumber(0, {
    lowerLimit: 0,
    upperLimit: 4,
    loop: true,
  });

  return (
    <div>
      <button onClick={showCounter.toggle}> toggle counter </button>
      <button onClick={() => counter.increase()}> increase </button>
      {showCounter.value && <span> {counter.value} </span>}
      <button onClick={() => counter.decrease()}> decrease </button>
      <button onClick={todos.clear}> clear todos </button>
      <input type="text" value={newTodo.value} onChange={newTodo.onChange} />
    </div>
  );
};
```

### Example

[Open in CodeSandbox](https://codesandbox.io/s/44m70xm70)

## API reference (object destructuring)

### How to import?

```
import { useBoolean } from 'react-hanger' // will import all of functions
import useBoolean from 'react-hanger/useBoolean' // will import only this function
```

### useStateful

Just an alternative syntax to `useState`, because it doesn't need array destructuring.  
It returns an object with `value` and a `setValue` method.

```jsx
const username = useStateful('test');

username.setValue('tom');
console.log(username.value);
```

### useBoolean

```jsx
const showCounter = useBoolean(true);
```

Methods:

- `toggle`
- `setTrue`
- `setFalse`

### useNumber

```jsx
const counter = useNumber(0);
const limitedNumber = useNumber(3, { upperLimit: 5, lowerLimit: 3 });
const rotatingNumber = useNumber(0, {
  upperLimit: 5,
  lowerLimit: 0,
  loop: true,
});
```

Methods:

Both `increase` and `decrease` take an optional `amount` argument which is 1 by default, and will override the `step` property if it's used in the options.

- `increase(amount = 1)`
- `decrease(amount = 1 )`

Options:

- `lowerLimit`
- `upperLimit`
- `loop`
- `step` - sets the increase/decrease amount of the number upfront, but it can still be overriden by `number.increase(3)` or `number.decrease(5)`

### useInput

```jsx
const newTodo = useInput('');
```

```jsx
<input value={newTodo.value} onChange={newTodo.onChange} />
```

```jsx
<input {...newTodo.eventBind} />
<Slider {...newTodo.valueBind} />
```

Methods:

- `clear`
- `onChange`
- `eventBind` - binds the `value` and `onChange` props to an input that has `e.target.value`
- `valueBind` - binds the `value` and `onChange` props to an input that's using only `value` in `onChange` (like most external components)

Properties:

- `hasValue`

### useArray

```jsx
const todos = useArray([]);
```

Methods:

- `add`
- `clear`
- `removeIndex`
- `removeById` - if array consists of objects with some specific `id` that you pass
  all of them will be removed
- `move` - moves item from position to position shifting other elements.

```
    So if input is [1, 2, 3, 4, 5]

    from  | to    | expected
    3     | 0     | [4, 1, 2, 3, 5]
    -1    | 0     | [5, 1, 2, 3, 4]
    1     | -2    | [1, 3, 4, 2, 5]
    -3    | -4    | [1, 3, 2, 4, 5]
```

### useMap

```jsx
const { value, set } = useMap([['key', 'value']]);
const { value: anotherValue, remove } = useMap(new Map([['key', 'value']]));
```

Actions:

- `set`
- `remove`
- `clear`
- `initialize` - applies tuples or map instances
- `setValue`

### useSetState

```jsx
const { state, setState } = useSetState({ loading: false });
setState({ loading: true, data: [1, 2, 3] });
```

Methods:

- `setState(value)` - will merge the `value` with the current `state` (like this.setState works in React)

Properties:

- `state` - the current state

### usePrevious

Use it to get the previous value of a prop or a state value.  
It's from the official [React Docs](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).  
It might come out of the box in the future.

```jsx
const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return (
    <h1>
      Now: {count}, before: {prevCount}
    </h1>
  );
};
```

### useActions

return bound dispatch actions

```ts
const { action1, action2 } = useActions(actions);
// dispatch action
action1();
```

### useDebounce

see [lodash debounce](https://lodash.com/docs/4.17.11#debounce)

```ts
  const fetch = () {...};
  const debounceFetch = useDebounce(fetch);
```

### useShallowEqualSelector

see [react-redux hooks api](https://react-redux.js.org/api/hooks#recipe-useshallowequalselector)

### useRestore

```ts
/**
 * save the current application state to top.history.state
 * restore the status of the application when refreshing or rebounding
 */
  const App = () => {
    /**
     * react-router history, In general: stateContainer._history
     */
    useRestore(history);
     ...
  }

```

### useInterval

see [Making setInterval Declarative with React Hooks](https://overreacted.io/zh-hans/making-setinterval-declarative-with-react-hooks/)

### useCountdown

```ts
  const { rt, start } = useCountdown(SECOND);

  const [text, setText] = useState('发送验证码');

  useEffect(() => {
    if (rt > 0) {
      setText(`${rt}秒后重试`);
    } else {
      setText('发送验证码');
    }
  }, [rt]);

  // button click -> start
```
