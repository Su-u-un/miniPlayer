const styles = require('./index.css')

interface iVideo{
  url:string
  dom:HTMLElement
  
  width?:string
  height?:string
  autoplay?:boolean
}

interface iComponents{
  tempContainer
  init()
  template()
  handle()
}

function videoView(options:iVideo){
  return new video(options)
}

class video implements iComponents{
  tempContainer
  constructor(private settings:iVideo) {
    // this.settings = Object.assgin({
    //   width:'100%',
    //   height:'100%',
    //   autoplay:false
    // },settings)
    this.settings = {
      url:settings.url,
      dom:settings.dom,
      width:settings.width||'100%',
      height:settings.height||'100%',
      autoplay:settings.autoplay||false
    }
    this.init()
  }
  init() {
    this.template()
    this.handle()
  }
  template() {
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styles.video
    this.tempContainer.style.width = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.innerHTML = `
      <video class="${styles['video-content']}" src="${this.settings.url}"></video>
      <div class="${styles['video-controls']}">
        <!--进度条-->
        <div class="${styles['video-progress']}">
          <!--当前进度-->
          <div class="${styles['video-progress-now']}"></div>
          <!--缓冲进度-->
          <div class="${styles['video-progress-suc']}"></div>
          <!--进度球-->
          <div class="${styles['video-progress-bar']}"></div>
        </div>
        <!--播放按钮-->
        <div class="${styles['video-play']}">
          <i class="iconfont player-24gf-play"></i>
        </div>
        <!--当前播放进度-->
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <!--全屏按钮-->
        <div class="${styles['video-full']}">
          <i class="iconfont player-24gf-fullScreenEnter3"></i>
        </div>
        <!--音量区域-->
        <div class="${styles['video-volume']}">
          <i class="iconfont player-24gf-volumeMiddle"></i>
          <div class="${styles['video-volumeProgress']}">
            <!--当前音量-->
            <div class="${styles['video-volumeProgress-now']}"></div>
            <!--音量进度球-->
            <div class="${styles['video-volumeProgress-bar']}"></div>
          </div>
        </div>
        
      </div>
    `
    this.settings.dom.appendChild(this.tempContainer)
  }
  handle() {
    //视频事件
    let video = document.querySelector('video')
    //播放暂停按钮
    let videoPlay = document.querySelector(`.${styles['video-play']} i`)
    //全屏按钮
    let videoFull = document.querySelector(`.${styles['video-full']}`)
    //音量按钮
    let videoVolume = document.querySelector(`.${styles['video-volume']} i`)
    let volumeKey = true
    //播放进度相关
    let videoTime = document.querySelectorAll(`.${styles['video-time']} span`)
    //读取进度
    let playTimer
    //读取双击单击
    let clickTimer
    //整体进度条
    let videoProgress = this.tempContainer.querySelector(`.${styles['video-progress']}`)
    //进度条相关
    let videoProgressAll = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`)
    //音量进度条相关
    let volumeProgressAll = this.tempContainer.querySelectorAll(`.${styles['video-volumeProgress']} div`)
    //静音前记录之前的声音
    let nowVolume = 0.5
  
  
    //监听视频缓存完毕事件
    video.addEventListener('canplay',()=>{
      videoTime[1].innerHTML = formateTime(video.duration)
      //判断自动播放
      if(this.settings.autoplay){
        video.play()
      }
    })
    //监听视频播放事件
    video.addEventListener('play',()=>{
      videoPlay.className = 'iconfont player-24gf-pause2'
      //0.05秒更新一次当前进度
      playTimer = setInterval(playing,50)
    })
    //监听视频暂停事件
    video.addEventListener('pause',()=>{
      videoPlay.className = 'iconfont player-24gf-play'
      clearInterval(playTimer)
    })
    //监听视频双击事件
    video.addEventListener('dblclick',()=>{
      clearTimeout(clickTimer)
      video.requestFullscreen()
    })
    //监听视频点击事件
    video.addEventListener('click',()=>{
      //防止双击触发单击
      let clickTimer = setTimeout(turn,10)
    })
    //监听播放按钮点击事件
    videoPlay.addEventListener('click',()=>{
      turn()
    })
    //监听全屏按钮点击事件
    videoFull.addEventListener('click',()=>{
      video.requestFullscreen()
    })
    //监听音量按钮点击事件
    videoVolume.addEventListener('click',()=>{
      if(volumeKey){
        videoVolume.className = "iconfont player-24gf-volumeCross"
        video.volume = 0;
        //伴随音量条改变
        volumeProgressAll[0].style.width = 0
        volumeProgressAll[1].style.left = 0
        volumeKey = false
      }else {
        videoVolume.className = "iconfont player-24gf-volumeMiddle"
        video.volume = nowVolume
        //伴随音量条改变
        volumeProgressAll[0].style.width = nowVolume*100+'%'
        volumeProgressAll[1].style.left = nowVolume*100+'%'
        volumeKey = true
      }
    })
    //监听进度条拖动事件
    videoProgressAll[2].addEventListener('mousedown',function (e:MouseEvent){
      //得到按下的点
      let downX = e.pageX
      //得到当前组件的定位点
      let downL = this.offsetLeft
      //鼠标移动时
      document.onmousemove = (e:MouseEvent)=>{
        let scale = (e.pageX-downX+downL+8)/this.parentNode.offsetWidth
        if(scale<0) scale = 0
        if(scale>1) scale = 1
        videoProgressAll[0].style.width = scale * 100 + '%'
        videoProgressAll[1].style.width = scale * 100 + '%'
        videoProgressAll[2].style.left = scale * 100 + '%'
        //应用到video上快进快退
        video.currentTime = scale*video.duration
      }
      //鼠标放开后
      document.onmouseup = ()=>{
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })
    //监听点击进度条事件
    // videoProgress.addEventListener('mousedown',function (e:MouseEvent){
    //   //得到按下的点
    //   let downX = e.pageX
    //   //得到当前进度点
    //   let
    // })
    //监听音量大小拖动
    //监听音量条拖动事件
    volumeProgressAll[1].addEventListener('mousedown',function (e:MouseEvent){
      //得到按下的点
      let downX = e.pageX
      //得到当前组件的定位点
      let downL = this.offsetLeft
      //鼠标移动时
      document.onmousemove = (e:MouseEvent)=>{
        let scale = (e.pageX-downX+downL+8)/this.parentNode.offsetWidth
        if(scale<0) scale = 0
        if(scale>1) scale = 1
        volumeProgressAll[0].style.width = scale * 100 + '%'
        volumeProgressAll[1].style.left = scale * 100 + '%'
        //应用到video上音量变化
        nowVolume = video.volume = scale
        videoVolume.className = "iconfont player-24gf-volumeMiddle"
      }
      //鼠标放开后
      document.onmouseup = ()=>{
        document.onmousemove = document.onmouseup = null
      }
      e.preventDefault()
    })
    
    //播放暂停
    function turn(){
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
    //时间格式化
    function formateTime(number:number):string {
      number = Math.round(number);
      let min = Math.floor(number/60);
      let sec = number%60
      return setZero(min)+ ':'+setZero(sec)
    }
    //个位数前加0
    function setZero(number:number):string {
      return number <10 ?`0${number}` : `${number}`
    }
    //播放中
    function playing() {
      videoTime[0].innerHTML = formateTime(video.currentTime)
      let videoScale = video.currentTime / video.duration
      let videoScaleSuc = video.buffered.end(0) / video.duration
      //视频进度
      videoProgressAll[0].style.width = videoScale*100 + '%'
      videoProgressAll[1].style.width = videoScaleSuc*100 + '%'
      videoProgressAll[2].style.left = videoScale*100 + '%'
    }
  }
}

export default videoView
