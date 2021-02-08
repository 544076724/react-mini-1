import mountElement from "./mountElement"
import createDOMElement from "./createDOMElement"
import diffComponent from "./diffComponent"
import updateTextNode from "./updateTextNode"
import updateNodeElement from "./updateNodeElement"
import unmountNode from "./unmountNode"
/**
 * 该方法用来做新旧vnode的比对，以及首次挂载的处理
 * setState时会调用，或者render(<div>sss</div) 更改render(<span>lll</span>)
 * @param {*} virtualDOM 虚拟dom
 * @param {*} container 挂载的父级节点
 * @param {*} oldDOM 虚拟dom对应的真实dom,更新时才会有，初始创建时 是没有的, 更新时它也是老的真实dom
 */
export default function diff (virtualDOM, container, oldDOM) {
  
  const oldVirtualDOM = oldDOM && oldDOM._virtualDOM //首次创建时是不存在的
  const oldComponent = oldVirtualDOM && oldVirtualDOM.component //查看该节点是否是 组件
  if (!oldDOM) { //如果它不存在是首次挂载 直接执行mountElement方法

    mountElement(virtualDOM, container)
  }
  else if (//老的存在，要对比更新
    // 如果要比对的两个节点类型不相同
    virtualDOM.tag !== oldVirtualDOM.tag &&
    // 并且节点的类型不是组件 因为组件要单独处理
    typeof virtualDOM.tag !== "function"
  ) {
    // 新旧的标签不同,不需要对比
    // 直接使用新的 virtualDOM 对象生成真实 DOM 对象
    const newElement = createDOMElement(virtualDOM)
    // 使用新的 DOM 对象替换旧的 DOM 对象
    oldDOM.parentNode.replaceChild(newElement, oldDOM)
  } else if (typeof virtualDOM.tag === "function") {
    // 是组件
    diffComponent(virtualDOM, oldComponent, oldDOM, container)
  } else if (oldVirtualDOM && virtualDOM.tag === oldVirtualDOM.tag) {
    //如果旧的vnode存在 并且 两个标签一样 进行节点更新

    if (virtualDOM.tag === "text") {//文本节点
      // 更新内容
      updateTextNode(virtualDOM, oldVirtualDOM, oldDOM)
    } else {
      // 更新元素节点属性
      updateNodeElement(oldDOM, virtualDOM, oldVirtualDOM)
    }

    //最后是key的对比


    // 1. 将拥有key属性的子元素放置在一个单独的对象中
    let keyedElements = {}
    for (let i = 0, len = oldDOM.childNodes.length; i < len; i++) {
      let domElement = oldDOM.childNodes[i]
      if (domElement.nodeType === 1) {
        let key = domElement.getAttribute("key")
        if (key) {
          keyedElements[key] = domElement
        }
      }
    }

    let hasNoKey = Object.keys(keyedElements).length === 0
    if (hasNoKey) {//无key
      // 没有key，直接逐级比对,一个一个更新
      virtualDOM.children.forEach((child, i) => {
        diff(child, oldDOM, oldDOM.childNodes[i]) //更新比对
      })
    } else {//html有key
      // 2. 循环 virtualDOM 的子元素 获取子元素的 key 属性
      virtualDOM.children.forEach((child, i) => {
        let key = child.props.key
        if (key) {
          let domElement = keyedElements[key] //获取对应的真实dom
          if (domElement) {
            // 3. 看看当前位置的元素是不是我们期望的元素
            //如果当前坐标的元素在 上一次操作就存在,然后查看两个是不是相等
            //不相等的话，证明当前位置的元素不是 我们要的这个domElement元素,那就直接把它插入到这个位置
            if (oldDOM.childNodes[i] && oldDOM.childNodes[i] !== domElement) {
              oldDOM.insertBefore(domElement, oldDOM.childNodes[i])
            }
          } else {
            // domElement不存在证明 原来就少这个元素 直接进行新增元素操作
            mountElement(child, oldDOM, oldDOM.childNodes[i])
          }
        }
      })
    }


    //子集对比完了，查看旧的节点是不是比新的长，长的话证明新的没有，需要删除操作
    // 获取旧节点
    let oldChildNodes = oldDOM.childNodes
    // 判断旧节点的数量比新的长
    if (oldChildNodes.length > virtualDOM.children.length) {
      if (hasNoKey) { //没有key，直接删除
        // 有节点需要被删除
        for ( //没有key时证明,到从开头到virtualDOM.children的结尾都已经被更新过了，所以我们从后往前删除
          //删除到virtualDOM.children 的结尾处就可以了,代码如下
          let i = oldChildNodes.length - 1;
          i > virtualDOM.children.length - 1;
          i--
        ) {
          unmountNode(oldChildNodes[i]) //删除新的vnode上面不存在的节点
        }
      } else {//有key
        // 通过key属性删除节点,把老的节点里的key从新的vnode.children里查找,如果找不到就删除
        for (let i = 0; i < oldChildNodes.length; i++) {
          let oldChild = oldChildNodes[i]
          let oldChildKey = oldChild._virtualDOM.props.key
          let found = false
          for (let n = 0; n < virtualDOM.children.length; n++) {
            if (oldChildKey === virtualDOM.children[n].props.key) { //找到了，退出本次循环
              found = true
              break
            }
          }
          if (!found) { //没找到，新的vnode.children不存在，删除
            unmountNode(oldChild)
          }
        }
      }
    }

  }
}