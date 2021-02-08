import mountNativeElement from "./mountNativeElement"
import isFunction from "./isFunction"
import mountComponent from "./mountComponent"
/**
 * 该方法用来区分是组件还是 普通元素,普通元素就生成dom挂载到界面
 * @param {*} virtualDOM 虚拟dom,当前的vnode
 * @param {*} container 要放入的容器元素
 * @param {*} oldDOM 旧的 真实dom,上面储存了老的vnode，参数可选，首次渲染界面时不存在
 */

export default function mountElement(virtualDOM, container, oldDOM) {
  if (isFunction(virtualDOM)) { //是组件
    // Component
    mountComponent(virtualDOM, container, oldDOM)
  } else {//不是组件，根据虚拟dom生成真实dom挂载
    // NativeElement
    mountNativeElement(virtualDOM, container, oldDOM)
  }
}