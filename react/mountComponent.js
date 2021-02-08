import isFunctionComponent from "./isFunctionComponent"
import mountNativeElement from "./mountNativeElement"
import isFunction from "./isFunction"
/**
 * 该方法 用来 获取组件的虚拟domvnode
 * @param {*} virtualDOM 虚拟dom
 * @param {*} container  挂载的父级节点
 * @param {*} oldDOM 真实dom
 */
export default function mountComponent (virtualDOM, container, oldDOM) {
  let nextVirtualDOM = null
  let component = null
  // 判断组件是类组件还是函数组件
  if (isFunctionComponent(virtualDOM)) {
    // 函数组件
    nextVirtualDOM = buildFunctionComponent(virtualDOM)
  } else {
    // 类组件
    nextVirtualDOM = buildClassComponent(virtualDOM)
    component = nextVirtualDOM.component
  }

  if (isFunction(nextVirtualDOM)) { //如果组件调用解析以后返回的 还是一个 组件的话，就继续解析它
    //例如function App(){ return <Demo / >} 这种
    mountComponent(nextVirtualDOM, container, oldDOM)
  } else {
    //否则 当前节点已经解析成 元素或者文本节点了,调用mountNativeElement真实dom，挂载或更新
    mountNativeElement(nextVirtualDOM, container, oldDOM)
  }


  if (component) { //走到这里时 组件已经加载完成了，执行它的生命周期函数
    component.componentDidMount()
    if (component.props && component.props.ref) {
      component.props.ref(component) //传递组件实例给ref引用
      
    }
  }
}

function buildFunctionComponent(virtualDOM) {//函数组件返回虚拟dom
  return virtualDOM.tag(virtualDOM.props || {}) 
}


function buildClassComponent(virtualDOM) {//class组件调用render 返回虚拟dom
  const component = new virtualDOM.tag(virtualDOM.props || {})
  const nextVirtualDOM = component.render()
  nextVirtualDOM.component = component //把当前组件实例挂载到虚拟dom上，方便后续执行 生命周期函数
  return nextVirtualDOM
}