import { useReducer } from 'react';
import './App.css';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  ADD_DIGIT : 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  EVALUATE: 'evaluate',
  DELETE_DIGIT: 'delete-digit',
}
const evaluate = ({current, previouse, operation}) => {
  const p = parseFloat(previouse);
  const c = parseFloat(current);
  if(isNaN(p) && isNaN(c)) return "";
  let computation =''
  switch (operation) {
    case "+":
      computation = p + c;
      break;
    case "-":
      computation = p - c;
      break;
      case "*":
        computation = p * c;
        break;
      case "/":
        computation = p / c;
        break;
    default:
      break;
  }
  return computation.toString();
}
const reducer = (state, {type, payload}) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          current: payload.digit,
          overwrite: false
        }
      }
      if(payload.digit === '0' && state.current === '0') return state;
      if(payload.digit === '.' && state.current.includes('.')) return state;
      return {
        ...state,
        current: `${state.current || ''}${payload.digit}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if(state.current == null && state.previouse == null) return state;

      if(state.current == null){
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previouse == null ){
        return {
          ...state,
          operation: payload.operation,
          previouse: state.current,
          current: null
        }
      }

        return {
          ...state,
          previouse: evaluate(state),
          operation: payload.operation,
          current: null
        }
    case ACTIONS.CLEAR:
        return {}
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return {
          ...state,
          current: null,
          overwrite: false
        }
      }
      if(state.current == null) return state;
      if(state.current.length === 1){
        return {
          ...state,
          current: null,
        }
      }
        return {
          ...state,
          current: state.current.slice(0,-1)
        }
    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previouse == null || state.current == null) return state;
      return {
        ...state,
        overwrite: true,
        operation: null,
        previouse: null,
        current: evaluate(state),
      }
    default:
  }
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if(operand == null ) return
  const [integer, decimal] = operand.split(".")
  if( decimal == null ) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
function App() {
  const [{current, previouse, operation}, dispatch] = useReducer(reducer, {});

  return (
    <div className="calculator">
      <div className='output'>
        <div className='pre_operand'>{formatOperand(previouse)} {operation}</div>
        <div className='cur_operand'>{formatOperand(current)}</div>
      </div>
      <button className='span_two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} /> 
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className='span_two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default App;
