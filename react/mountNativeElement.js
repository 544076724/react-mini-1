import createDOMElement from "./createDOMElement"
import unmountNode from "./unmountNode"

/**
 * 该方法根据虚拟vnode 来获取真实dom然后在父节点中进行 更新或添加
 * @param {*} virtualDOM 虚拟dom
 * @param {*} container  挂载的父级节点
 * @param {*} oldDOM 老的真实dom
 */
export default function mountNativeElement(virtualDOM, container, oldDOM) {
  
  let newElement = createDOMElement(virtualDOM) //获取真实dom
  // 将转换之后的DOM对象放置在页面中
  if (oldDOM) { //如果老的dom存在
    container.insertBefore(newElement, oldDOM) //插入它之前
  } else {
    container.appendChild(newElement) //直接添加
  }
  // 判断旧的DOM对象是否存在 如果存在 删除
  if (oldDOM) {
    unmountNode(oldDOM)
  }

  // 获取类组件实例对象
  let component = virtualDOM.component
  // 如果类组件实例对象存在
  if (component) {
    // 将DOM对象存储在类组件实例对象中，setState时要获取 真实dom，然后获取对应信息更新
    component.setDOM(newElement)
  }
}
