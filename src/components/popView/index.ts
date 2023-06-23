const styles =require('./css/index.css')

//参数的定义
interface iView {
  width?: string,
  height?: string,
  title?: string,
  pos?: string,
  mask?: boolean,
  content?: (dom:HTMLElement) => void
}
//组件的定义
interface iComponents {
  tempContainer: HTMLElement
  //初始化
  init()
  template()
  //写哪种格式都可以
  // template:()=>void,
  handle()
}

function popView(options:iView){
  return new view(options)
}

class view implements iComponents{
  //虚拟dom对象
  tempContainer;
  //遮罩层对象
  mask;
  //构造函数
  constructor(private settings:iView) {
    //写好默认值，如果后面有参数，用assign复制就可以覆盖默认值
    // this.settings = Object.assign({
    //   width: '100%',
    //   height: '100%',
    //   title: '',
    //   pos: 'center',
    //   mask: true,
    //   content: function () { }
    // }, this.settings)
    this.settings = {
      width: settings.width || '100%',
      height: settings.height || '100%',
      title: settings.title || '',
      pos: settings.pos || 'center',
      mask: settings.mask !== undefined ? settings.mask : true,
      content: settings.content || (() => console.log(''))
    };
    this.init()
  }
  init() {
    this.template()
    this.handle()
    this.createContent()
  }
  //模板创建
  template() {
    this.tempContainer = document.createElement('div')
    //样式添加
    this.tempContainer.style.width = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.className = styles.popup
    this.tempContainer.innerHTML =
      `
      <div class="${styles['popup-title']}">
        <h3>${this.settings.title}</h3>
        <i class="iconfont player-icon_close"></i>
      </div>
      <div class="${styles['popup-content']}">
      </div>
      `
    //挂载
    document.body.appendChild(this.tempContainer)
    //使pos生效
    switch (this.settings.pos) {
      case 'left':
        this.tempContainer.style.left = 0
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px'
        break;
      case 'right':
        this.tempContainer.style.right = 0
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px'
        break;
      default:
        this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 + 'px'
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px'
        break;
    }
    if(this.settings.mask){
      this.mask = document.createElement('div')
      this.mask.className = styles.mask
      this.mask.style.width = '100%'
      this.mask.style.height = '100vh'
      document.body.appendChild(this.mask)
    }
  }
  //事件操作
  handle() {
    //监听关闭按钮
    let popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} i`)
    popupClose.addEventListener('click',()=>{
      document.body.removeChild(this.tempContainer)
      this.settings.mask && document.body.removeChild(this.mask)
    })
  }
  //回调使用content创建视频（根据对应需求，如果是表格等就创建表格。）
  createContent(){
    let popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`)
    this.settings.content(popupContent)
  }
}

export default popView
