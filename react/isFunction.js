export default function isFunction(virtualDOM) { //判断当前tag是不是一个组件
  return virtualDOM && typeof virtualDOM.tag === "function"
}
