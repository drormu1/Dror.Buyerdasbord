import React, {useRef,useState, useContext, useEffect } from 'react';

const useStateWithCallback = (initialValue) => {
    const [state, _setState] = useState(initialValue);
    const callbackQueue = useRef([]);
  
    useEffect(() => {
      callbackQueue.current.forEach((cb) => cb(state));
      callbackQueue.current = [];
    }, [state]);
  
    const setState = (newValue, callback) => {
      _setState(newValue);
      if (callback && typeof (callback === 'function')) {
        callbackQueue.current.push(callback);
      }
    };
  
    return [state, setState];
  };

  export default useStateWithCallback;