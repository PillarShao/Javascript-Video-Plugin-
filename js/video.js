// pillar
function Video(ele){
    this.ele = document.getElementById(ele);
    var childs = this.ele.children;
    for (let i = 0; i < childs.length; i++) {
        if(childs[i].classList.contains('video')){
            this.videoBox = childs[i]
        }
    }
    //创建方法
    function creatEle(node,clas,html){
        var e = document.createElement(node);
        e.className = clas;
        if(arguments.length==3){
            e.innerHTML = html;
        }        
        return e;
    }
    
    if(this.videoBox){
        var btnHtml = `<div class="play_btn"><i class="fa fa-play-circle" aria-hidden="true"></i></div>
        <div class="loading"><i class="fa fa-spinner" aria-hidden="true"></i></div>`;
        var controlsHtml = `<div class="palyOrpause">
                                <i class="fa fa-play" aria-hidden="true"></i>
                            </div> 
                            <div class="line_box">
                                <div class="time_line">
                                    <div class="line_over"></div>
                                    <em class="move_btn" style="left:-6px;"></em>
                                </div>
                            </div>
                            <div class="expand_box">
                                <div class="voice">
                                    <i class="fa fa-volume-up" aria-hidden="true"></i>
                                    <div class="voice_box">
                                        <span class="on"></span>
                                        <span class="on"></span>
                                        <span class="on"></span>
                                        <span class="on"></span>
                                        <span class="on"></span>
                                        <span class="on"></span>
                                    </div>
                                </div>
                                <div class="auto"><i class="fa fa-expand" aria-hidden="true"></i></div>
                            </div>`;
        var btnBox = creatEle('div','btn_box',btnHtml);
        var layTop = creatEle('div','lay_top');  
        layTop.append(btnBox); 
        layControls = creatEle('div','lay_controls',controlsHtml)        
        var lay = creatEle('div','video_lay');
        lay.append(layTop);
        lay.append(layControls);
        this.videoBox.append(lay);

        //referrence
        var btnBox = this.ele.getElementsByClassName('btn_box')[0];
        var layControl = this.ele.getElementsByClassName('lay_controls')[0];
        var video = this.ele.getElementsByTagName('video')[0];
        var playBtn = this.ele.getElementsByClassName('play_btn')[0];
        var lineBox = this.ele.getElementsByClassName('line_box')[0];
        var palyOrpause = this.ele.getElementsByClassName('palyOrpause')[0];
        var loading = this.ele.getElementsByClassName('loading')[0];
        var moveBtn = this.ele.getElementsByClassName('move_btn')[0];
        var lineOver = this.ele.getElementsByClassName('line_over')[0];
        var timeLine = this.ele.getElementsByClassName('time_line')[0];
        var timer;
        var params={
                    play:false,
                    flag:false,//状态
                    x:0,      //初始X坐标      
                    left:0,   //left  
                    index:0  //暂停次数             
                };
        //play
        function videoPlay(){     
            //修改状态
            params.play=true;      
            playBtn.style.display='none';
            btnBox.classList.add('play');
            palyOrpause.getElementsByClassName('fa-play')[0].className='fa fa-pause';  
            video.play();

            var alltime = video.duration//视屏总时长 
            var allwidth = timeLine.offsetWidth;
            var timeEle;  
            timer = setInterval(function(){
                //当前播放时间                            
                var timeE = video.currentTime;
                var left = timeE/alltime*allwidth;
                //console.log(timeE)
                moveBtn.style.left = left + 'px'
                lineOver.style.width = left + 'px' 
            },100)
        }
        //pause
        function videoPause(){ 
            //修改状态
            params.play=false;          
            playBtn.style.display='block';
            btnBox.classList.remove('play');
            palyOrpause.getElementsByClassName('fa-pause')[0].className='fa fa-play';
            clearInterval(timer);
            video.pause();
        }
        //中间点击播放
        playBtn.onclick = function(e){
            e.stopPropagation()
            videoPlay();
        }
        //中间点击停止
        btnBox.onclick = function(e){
            if(this.classList.contains('play')){
                e.stopPropagation()
                videoPause();
            }            
        }
        //控制区点击播放\暂停
        palyOrpause.getElementsByClassName('fa')[0].onclick = function(e){
            e.stopPropagation()
            if(this.classList.contains('fa-play')){
                videoPlay();
            }else{
                videoPause();
            }
        }

        // 拖动开始
        moveBtn.onmousedown = function(event){  
            //推动期间暂停播放
           
            if(params.play){
                videoPause();
                clearInterval(timer);
            }
            params.flag = true;
            if(!event){
                event = window.event;
                //防止IE文字选中
                bar.onselectstart = function(){
                    return false;
                }  
            }
            var e = event;
            //设置初始值                
            params.x = e.clientX;
            params.left = parseInt(moveBtn.style.left) 
            params.index = params.index + 1
        };
        //拖动中
        lineBox.onmousemove = function(event){                
            var e = event ? event: window.event;
            var allwidth = parseInt(document.getElementsByClassName('time_line')[0].offsetWidth)                         
            if(video.duration){
                if(params.flag){                        
                    var nowX = e.clientX
                    var disX = nowX - params.x
                    var newLeft = params.left + disX  
                    var newTime =   newLeft/allwidth*video.duration   
                    //限制最大最小值      
                    if(newLeft<-6){
                        newLeft = -6
                        lineOver.style.width='0px'
                        video.currentTime=0;
                    }else if(newLeft>allwidth){
                        newLeft =allwidth
                        lineOver.style.width = allwidth + 'px'
                        video.currentTime= video.duration;
                    }
                    moveBtn.style.left = newLeft + "px";  
                    lineOver.style.width = newLeft + "px"; 
                    video.currentTime = newTime;                       
                    return false;
                }
            }             
        }

        //拖动结束
        document.onmouseup = function(e){ 
            if(params.flag){
                params.flag = false;               
                params.left = parseInt(moveBtn.style.left)
                videoPlay();
            } 
        };
       

        //voice
        var voice = this.ele.getElementsByClassName('voice')[0];
        var voiceIcon = voice.getElementsByClassName('fa')[0];
        var voiceBox = voice.getElementsByClassName('voice_box')[0];
        var voiceBtn = voiceBox.getElementsByTagName('span');
        voice.onmousemove = function(){
            if(!voiceIcon.classList.contains('silent')){
                voiceBox.style.display='block';
            }            
        }
        voice.onmouseout = function(){
            voiceBox.style.display='none';
        }
        voiceIcon.onclick = function(e){
            e.stopPropagation();
            if(this.classList.contains('silent')){
                this.classList.remove('silent');
                this.style.opacity= 1; 
                voiceBox.style.display='block';
                var on = voiceBox.getElementsByClassName('on');
                var n = on.length;
                video.volume = n/6;
            }else{  
                this.classList.add('silent'); 
                voiceBox.style.display='none';           
                this.style.opacity= 0.5;
                video.volume = 0; 
            }
        }
        // voiceBox.onclick = function(e){
        //     var target = e.target;
        //     //click on span
        //     if(target.matches('span')){
        //         var span = e.srcElement;
        //         span.classList.add('on')
        //         console.log(e.srcElement.index)
        //     } 
        // }
        //
        for (var i = 0;i < voiceBtn.length; i++) {
            voiceBtn[i].index = i;
            voiceBtn[i].onclick=function(){
                var j= this.index;
                for (var s = 0;s < voiceBtn.length; s++) {
                    if(voiceBtn[s].index >= j){
                        voiceBtn[s].className = 'on';
                        video.volume = (6-j)/6;                       
                    }else{
                        voiceBtn[s].className = ''
                    }
                }
            }
        }

        //auto
        var auto = this.ele.getElementsByClassName('auto')[0];
        var parent = this.ele;
        auto.onclick = function(){
            if(this.classList.contains('full')){
                this.classList.remove('full');
                parent.classList.remove('full');
                parent.style.cssText = "width:auto;height:auto;"
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }else{
                this.classList.add('full');
                parent.classList.add('full');
                var X = window.screen.width;
                var Y = window.screen.height;
                parent.style.cssText = "width:"+X+"px;height:"+Y+"px;"
                var docElm = document.documentElement;
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                else if (docElm.msRequestFullscreen) {
                    docElm.msRequestFullscreen();
                }
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
            }            
        }
        window.onkeydown = function (event){
            console.log(2)
            switch(event.keyCode) {
            case 27:
            if(parent.classList.contains('full')){
                auto.classList.remove('full');
                parent.classList.remove('full');
                parent.style.cssText = "width:auto;height:auto;"
               
            }           
            case 96:
                if(parent.classList.contains('full')){
                    console.log(1)
                    auto.classList.remove('full');
                    parent.classList.remove('full');
                    parent.style.cssText = "width:auto;height:auto;"                   
                }               
            }
        };
        document.onkeyup = function(event){
            switch(event.keyCode) {
            case 27:
            alert("ESC");
            case 96:
            alert("ESC");
            }
           };

        
    }else{
        return console.log('video has no className video');
    }
        
}