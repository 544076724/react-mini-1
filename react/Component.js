
import {enqueueSetState} from "./enqueueSetState";
export default class Component { //类组件的父类,所有类组件继承自它
  constructor(props) {
    this.props = props //储存props
  }
  setState(state) { //获取state
    enqueueSetState(state,this)
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
