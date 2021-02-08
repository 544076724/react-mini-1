import diff from "./diff"//对比新旧vnode更新

export default class Component { //类组件的父类,所有类组件继承自它
  constructor(props) {
    this.props = props //储存props
  }
  setState(state) { //获取state
    
    this.state = Object.assign({}, this.state, state) //合并state
    // 获取最新的要渲染的 virtualDOM 对象
    let virtualDOM = this.render()
    // 获取旧的 virtualDOM 对象 进行比对
    let oldDOM = this.getDOM()
    // 获取容器
    let container = oldDOM.parentNode
    // 实现对象
    diff(virtualDOM, container, oldDOM)
  }
  setDOM(dom) { //设置 当前组件对应的真实dom
    this._dom = dom
  }
  getDOM() {//获取
    return this._dom
  }
  updateProps(props) { //更新props
    this.props = props
  }

  // 生命周期函数
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {}
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps != this.props || nextState != this.state
  }
  componentWillUpdate(nextProps, nextState) {}
  componentDidUpdate(prevProps, preState) {}
  componentWillUnmount() {}
}
