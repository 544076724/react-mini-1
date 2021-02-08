import diff from "./diff"
/**
 * 
 * @param {*} virtualDOM 虚拟dom
 * @param {*} container 挂载的父级节点
 * @param {*} oldDOM 虚拟dom对应的真实dom,更新时才会有，初始创建时是没有的, 我们在创建完 真实dom之后 会把当前用的vnode
 * 挂载到真实dom一个属性上 方便后续做新旧vnode对比 
 */
export default function render (
  virtualDOM,
  container,
  oldDOM = container.firstChild
) {
  
  diff(virtualDOM, container, oldDOM) // 虚拟dom diff算法,该方法 初始会生成dom新建, 之后会做新旧vnode对比
}