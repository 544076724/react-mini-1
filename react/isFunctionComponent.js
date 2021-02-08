import isFunction from "./isFunction"
/**
 *  该方法用来判断是函数组件还是类组件，组件原型有render方法就认为是类组件
 * @param {*} virtualDOM 虚拟dom
 */
export default function isFunctionComponent(virtualDOM) {
  const type = virtualDOM.tag
  return (
    type && isFunction(virtualDOM) && !(type.prototype && type.prototype.render)
  )
}
