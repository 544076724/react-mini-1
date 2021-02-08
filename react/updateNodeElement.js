/**
 * 该方法设置或更新真实dom上的属性
 * @param {*} newElement 真实dom对象
 * @param {*} virtualDOM  新的vnode
 * @param {*} oldVirtualDOM  老的vnode
 * 
 */

export default function updateNodeElement(
  newElement,
  virtualDOM,
  oldVirtualDOM = {}
) {
  // 获取节点对应的属性对象
  const newProps = virtualDOM.props || {} //获取新的props属性
  const oldProps = oldVirtualDOM.props || {} //旧的vnode上props属性
  Object.keys(newProps).forEach(propName => {
    // 获取属性值
    const newPropsValue = newProps[propName] 
    const oldPropsValue = oldProps[propName]
    if (newPropsValue !== oldPropsValue) {
      // 判断属性是否是否事件属性 onClick -> click
      if (propName.slice(0, 2) === "on") {
        // 事件名称
        const eventName = propName.toLowerCase().slice(2)
        // 为元素添加事件
        newElement.addEventListener(eventName, newPropsValue)
        //已经挂载过新的处理函数了要删除原有的事件的事件处理函数
        if (oldPropsValue) {
          newElement.removeEventListener(eventName, oldPropsValue)
        }
      } else if (propName === "value" || propName === "checked") {//如果要是input属性
        newElement[propName] = newPropsValue  //直接设置值
      } else if (propName !== "children") { //排除子集 属性
        // 其他属性都通过setAttribute处理
        if (propName === "className") {
          newElement.setAttribute("class", newPropsValue)
        } else {
          newElement.setAttribute(propName, newPropsValue)
        }
      }
    }
  })
  // 判断属性被删除的情况,遍历旧的属性在新的props里查找,要是找不到证明被删除了,就也要对应删除
  Object.keys(oldProps).forEach(propName => {
    const newPropsValue = newProps[propName]
    const oldPropsValue = oldProps[propName]
    if (!newPropsValue) { //没找到，删除了
      // 属性被删除了
      if (propName.slice(0, 2) === "on") { //删除事件
        const eventName = propName.toLowerCase().slice(2)
        newElement.removeEventListener(eventName, oldPropsValue)
      } else if (propName !== "children") { //排除children，其他都用removeAttribute方法处理
        newElement.removeAttribute(propName)
      }
    }
  })
}
