class Vue{
  // private $data: any;
  constructor(obj){
    //把参数的数据赋给实例
    this.$data = obj.data
    //通过参数的选择器el，得到dom，dom赋给实例
    this.$dom = document.querySelector(obj.el)
    //进行数据劫持，传入实例上的数据
    Observer(this.$data)
    //进行模板编译，传入实例
    Compile(this)
  }
}

//数据劫持函数
function Observer(data){
  //递归出口
  if(!data||typeof data !== 'object') return
  
  //使用Object.keys用数组返回对象内的属性，属性内的属性可递归
  // console.log(Object.keys(data));
  Object.keys(data).forEach(key => {
    //保存数据，否则进入ObjectProperty会被undefined
    let val = data[key]
    //递归调用，得到属性内的属性
    Observer(val)
    //参数：操作对象、操作属性、进行的操作（对象包装）
    Object.defineProperty(data, key, {
      //属性可枚举
      enumerable: true,
      //属性描述符可改变
      configurable: true,
      //数据被改能监听，参数是新值
      set(newVal) {
        val = newVal
        //进入递归为新值加监听。
        Observer(val)
        console.log('改成'+val);
      },
      get() {
        console.log(val+'被读啦！');
        return val
      }
    })
  })
}

//解析dom模板，创建临时dom，一次性更替真实dom，减少消耗
function Compile(vm){
  //创建临时dom
  const fragment = document.createDocumentFragment()
  //把未解析的dom放入临时dom中
  let child
  while(child = vm.$dom.firstChild){
    fragment.append(child)
  }
  //对临时dom内的元素进行解析，查找胡子语法等等
  fragment_compile(fragment)
  //把临时dom替换真实dom
  vm.$dom.appendChild(fragment)

  //解析临时dom
  function fragment_compile(node){
    //筛出文本节点，存在span等换行，所以需要进一步用正则筛选
    const regExp = /{{\s*(\S+)\s*}}/ //正则判断胡子语法
    //nodeType 3是文本节点
    if(node.nodeType===3){
      const res = regExp.exec(node.nodeValue)
      //正则匹配不过就是空，所以需要判是否空
      if(res){
        //匹配到的胡子语法可能是一个对象里面的属性，他的形式会是'xxx.xxx.xxx'这种字符的形式，所以要把它拆分
        //把字符串转换为数组（以.为间断），再拆分数组的元素
        const arr = res[1].split('.')
        //数组累加器。以下参数是： (回调函数(上一次回调返回值,数组当前被处理的元素),第一次调用回调的参数)
        //得到val内对象属性的形式是data[info[adr]]
        const val = arr.reduce((total,current)=>total[current],vm.$data)
        //查找节点值里和正则匹配的节点，把处理过的val值替入
        node.nodeValue = node.nodeValue.replace(regExp,val)
      }
    }
    node.childNodes.forEach(child=>fragment_compile(child))
  }
}
