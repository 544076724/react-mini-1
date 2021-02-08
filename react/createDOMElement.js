import mountElement from "./mountElement"
import updateNodeElement from "./updateNodeElement"
/**
 * 
 * @param {*} virtualDOM 根据虚拟dom生成真实dom 
 * 这个函数,当前项 virtualDOM.tag 不会是一个方法,也就是说，函数组件不会直接走到这里
 * 这里处理ref 不是组件上的ref而是  <div ref={方法()}></div> 这种,在这里ref的回调传入的不会是组件的引用
 */
export default function createDOMElement (virtualDOM) {
  let newElement = null
  if (virtualDOM.tag === "text") {
    //文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent) //取出我们赋值到props里的内容
  } else {
    newElement = document.createElement(virtualDOM.tag)
    updateNodeElement(newElement, virtualDOM) //设置props属性 到真实dom
  }
  newElement._virtualDOM = virtualDOM //把当前的vnode对象,挂载到真实dom上，用来做新旧vnode对比使用,下次更新它就是旧的vnode了
  // 这回我们才创建了第一层节点，要递归创建子节点
  virtualDOM.children.forEach(child => {
    mountElement(child, newElement) //该方法会区分 当前节点是 组件还是元素
  })
  //处理ref属性,如果要是 有ref的话,调用ref传入的函数,把当前创建的newElement dom传递给它
  if (virtualDOM.props && virtualDOM.props.ref) {
    virtualDOM.props.ref(newElement)
  }
  return newElement  //最后返回新建的 dom元素
}