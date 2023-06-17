import './assets/css/index.css'
import './assets/css/iconfont.css'
import popView from './components/popView'
import videoView from './components/videoView'
let view = document.querySelector(".view div")

view.addEventListener('click',function (){
  let url = this.dataset.url
  let title = this.dataset.title

  popView({
    width:'880px',
    height:'556px',
    title,
    pos:'center',
    mask:true,
    content:(dom)=>{
      //el是容器所在的dom，作为参数传给video绑定
      videoView({
        url,
        dom,
        autoplay:false
      })
    }
  })
})
