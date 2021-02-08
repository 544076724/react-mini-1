import mountElement from "./mountElement"


import updateComponent from "./updateComponent"

/**
 * 该方法用来 对比更新组件
 * @param {*} virtualDOM  //虚拟dom
 * @param {*} oldComponent //旧的组件
 * @param {*} oldDOM //旧真实dom
 * @param {*} container //要渲染到的父级
 */
export default function diffComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  if (isSameComponent(virtualDOM, oldComponent)) {
    // 同一个组件 做组件更新操作
    updateComponent(virtualDOM, oldComponent, oldDOM, container)
  } else {
    // 不是同一个组件，直接用现在vnode 来渲染
    mountElement(virtualDOM, container, oldDOM)
  }
}
// 判断是否是同一个组件
function isSameComponent(virtualDOM, oldComponent) {
  return oldComponent && virtualDOM.type === oldComponent.constructor
}