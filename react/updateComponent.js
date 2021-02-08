import diff from "./diff"
/**
 * 同一个组件更新操作
 * @param {*} virtualDOM 
 * @param {*} oldComponent 组件实例
 * @param {*} oldDOM 真实dom
 * @param {*} container 
 */
export default function updateComponent(
  virtualDOM,
  oldComponent,
  oldDOM,
  container
) {
  oldComponent.componentWillReceiveProps(virtualDOM.props) //生命周期函数，props变化
  if (oldComponent.shouldComponentUpdate(virtualDOM.props,oldComponent.prevState)) { //查看是否要更新
    // 未更新前的props
    let prevProps = oldComponent.props 
    oldComponent.componentWillUpdate(virtualDOM.props)//即将更新
    // 组件更新props
    oldComponent.updateProps(virtualDOM.props)
    oldComponent.prevState = oldComponent.state //更新prevState
    // 获取组件返回的最新的 virtualDOM，都更新了获取最新vnode
    let nextVirtualDOM = oldComponent.render()
    // 更新 component 组件实例对象,给最新的vnode来赋值 component
    nextVirtualDOM.component = oldComponent
    // 比对 更新
    diff(nextVirtualDOM, container, oldDOM) 
    oldComponent.componentDidUpdate(prevProps) 
  }
}
