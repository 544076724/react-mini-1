/**
 * 该函数用来生成虚拟dom,其他类react框架中也会叫h函数,我们配置了babel 会把jsx转换成React.createElement("div", null, "123")这种形式
 * @param {*} tag 标签类型标记是 元素标签还是文本元素text 还是组件  为组件是 tag 是一个函数
 * @param {*} props  标签 props 属性
 * @param  {...any} children 当前元素的下级元素 前两个之后的都是 子元素
 */
export default function createElement (tag, props, ...children) {

  //在这里把 所有的 布尔值和null去掉，这是不需要在界面展示的
  // children 里会有如下 children 这种格式 也就是子元素有是文本元素的, 这样会类型不统一
  //一会是字符串一会是对象所以在这里给它统一一下,子节点都转换成对象
  // { tag: "div", props: null, children: Array(4) }
  //   children: Array(4)
  //       0: "hello"
  //       1: { tag: "span", props: null, children: Array(1) }
  //       2: "react"
  //       3: { tag: "span", props: null, children: Array(1) }
  //   length: 4
  //   __proto__: Array(0)
  //   props: null
  //   tag: "div"
  
  const childElement = [].concat(...children).reduce((result, child) => {
    // 通过reduce处理
    if (child !== false && child !== true && child !== null) {
      if (child instanceof Object) {
        result.push(child);
      } else {
        result.push(createElement("text", { textContent: child }));
      }
    }
    return result;
  },[])


  //通过这样我们就做了一个类型统一
  return {
    tag,
    props:Object.assign({ children: childElement }, props), //react中props属性也有childern属性这里我们也加上
    children:childElement
  }
}