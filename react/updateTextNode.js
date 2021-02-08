export default function updateTextNode(virtualDOM, oldVirtualDOM, oldDOM) {//更新textNode节点
  if (virtualDOM.props.textContent !== oldVirtualDOM.props.textContent) {
    oldDOM.textContent = virtualDOM.props.textContent
    oldDOM._virtualDOM = virtualDOM  //更新完了之后因为用了新的vnode,所以要更新一下
  }
}
