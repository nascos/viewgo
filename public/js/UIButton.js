//各个弄能Button



var UIButton = function(){

    var _this = this;


    _this.framesList= [];
    _this.currentObject=null;

    _this.infoList = [];
    _this.currentInfo = null;

    _this.background_url="earthmoonsun-small.jpg";


    _this._delayId=0;

    _this.infosLength = 0;
    _this.ObjectsLength= 0;


    this.currentObjectUp = function(){



        var x = _this.currentObject.scale().clone().x+0.1;
        var y = _this.currentObject.scale().clone().y+0.1;
        var z = _this.currentObject.scale().clone().z;

        _this.currentObject.scale(new THREE.Vector3(x,y,z));




        console.log("aaa");
    }


    this.currentObjectDown = function(){

        var x = _this.currentObject.scale().clone().x-0.1;
        var y = _this.currentObject.scale().clone().y-0.1;
        var z = _this.currentObject.scale().clone().z;

        _this.currentObject.scale(new THREE.Vector3(x,y,z));




        console.log("bbb");
    }




    this.JsonImport = function(object){


    }

    this.JsonExport = function(world){
        var w = world;





    }








    this.init=function(){

        var str="",url="";
        var path = "";



        if(window.location.host.length ===0){
            str =window.location.href.split('.htm')[0];
            str.replace(str.split('/').pop(),'');

            url=str+'_files/'+_this.background_url;
        }
        else{

            str=window.location.href.replace(window.location.pathname.split('/').pop(),'');

            url =str +'images/'+_this.background_url;
        }







    $("body").css("background","rgba(0, 0, 0, 0) url("+url+") no-repeat fixed 50% 50% / cover padding-box border-box");

//        document.body.style.background
//        background: url(images/earthmoonsun-small.jpg) no-repeat center center fixed;
//rgba(0, 0, 0, 0) url(http://127.0.0.1:3000/mycode/images/earthmoonsun-small.jpg) no-repeat fixed 50% 50% / cover padding-box border-box


    }



    this.MoveToNextFrame = function(){
        //直接跳转到下一帧动画

        var  index  = _this.currentObject.FrameIndex;
        //最后一帧 跳转到第一帧
        if(index==_this.framesList.length){

            _this.currentObject =  _this.framesList[0];
            _this.currentObject.VgMotion.animationStart();

        }else{

            _this.currentObject = _this.framesList[index];
            _this.currentObject.VgMotion.animationStart();
        }
        _this.updateCurrentIndex();

    }
    this.MoveToPrevFrame = function(){
            var index = _this.currentObject.FrameIndex;
        //如果为 第一帧 那么跳转到 最后一帧
        if(index == 1){
            _this.currentObject = _this.framesList[_this.framesList.length-1];
            _this.currentObject.VgMotion.animationStart();
        }else{
            _this.currentObject = _this.framesList[index-2];
            _this.currentObject.VgMotion.animationStart();
        }

        _this.updateCurrentIndex();
    }


    this.getObjInSceneById = function(id){
        var arr = _this.framesList;

        for(var i=0;i<arr.length;i++)
        {
            if(id ===arr[i]._lists[0].id)
                return arr[i];
        }


        return null;


    };

    this.getInfoInSceneById = function(id) {

        var arr = _this.infoList;

        for(var i=0;i<arr.length;i++)
        {
            if(id ===arr[i]._lists[0].id)
                return arr[i];
        }


        return null;

    };

    this.updateCurrentIndex = function(){

        document.getElementById("currentIndex").textContent = "当前帧为 "+uiBTN.currentObject.FrameIndex;

    }

    this.updateWord = function(event){

        e = event || window.event;

        e.stopPropagation();

        var obj = _this.currentInfo;

        //_this.infoList.pop(obj);

        var text = document.getElementById('text').value;
        var color = document.getElementById('color').value;
        var size = document.getElementById('size').value;
        var font = document.getElementById('font').value;


        var newObj = new VGWord().refreshWord(obj, obj.position(), text, size, font, color );
       // newObj._lists[0].id = obj._lists[0].id;

        _this.infoList.push(newObj);
        _this.currentInfo = newObj;
        _this.currentInfo.frameIndex = _this.currentObject.FrameIndex;

    };

    //options
    this.addInfoIntoScene = function(options) {

        _this.infosLength++;

        var opt = options||{};

        if(!options){
            console.log("no options");
        }

        var FrameType = !opt.FrameType?"word":opt.FrameType;

        var InfoPosition =opt.InfoPosition;
        if(!InfoPosition){    //undefined

            //_this.currentObject = _this.framesList[_this.framesList.length -1];

            InfoPosition = _this.currentObject.position().
            clone().setZ(_this.currentObject.position().z + 0.05);

        }

        var obj = null;

        switch(FrameType){

            case "word":

                obj = new VGWord().createWord();
                //console.log(_this.currentObject.material()._lists[0].color) ;
                new VGWord().createTool();

                obj.position( InfoPosition );
                obj.scale(0.01, 0.01, 0.01);
                //obj.VgMotion = new VgMotion( obj );
                //mesh.addWordEvenListener();
                //document.body.appendChild( tool );
                world.add( obj );

                obj.oldColor=obj.material()._lists[0].color.getHex();

                var valueElement = document.getElementById('text');
                var colorElement = document.getElementById('color');
                var fontElement = document.getElementById('font');
                var sizeElement = document.getElementById('size');

                /*var textarea = document.getElementById('text');

                if (typeof textarea.selectionStart == "number") {
                    textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                } else if (typeof textarea.createTextRange != "undefined") {
                    textarea.focus();
                    var range = textarea.createTextRange();
                    range.collapse(false);
                    range.select();
                }

                // Work around Chrome's little problem
                window.setTimeout(function() {
                    if (typeof textarea.selectionStart == "number") {
                        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
                    } else if (typeof textarea.createTextRange != "undefined") {
                        textarea.focus();
                        var range = textarea.createTextRange();
                        range.collapse(false);
                        range.select();
                    }
                }, 1);*/

                valueElement.addEventListener('keyup', _this.updateWord, false);
                colorElement.addEventListener('change', _this.updateWord, false);
                fontElement.addEventListener('change', _this.updateWord, false);
                sizeElement.addEventListener('change', _this.updateWord, false);

                break;

            case "image":

                obj = new VGImage();

                obj.position(InfoPosition);
                //geo.scale(0.5, 0.5, 0.5);
                //obj.VgMotion = new VgMotion(obj);

                world.add( obj );


                obj.oldColor=obj.material()._lists[0].color.getHex();



                break;

            case "video":

                obj = new VGVideo();


                obj.position(InfoPosition);
                //obj.scale(0.5, 0.5, 0.5);
                //obj.VgMotion = new VgMotion(obj);

                world.add( obj );

                obj.oldColor=obj.material()._lists[0].color.getHex();


                document.getElementById('playBtn').addEventListener('click', function(e) {

                    e.stopPropagation();

                    if(document.getElementById('playBtn').value === ">") {

                        document.getElementById('myVideo').pause();
                        document.getElementById('playBtn').value = "||";


                    }  else {

                        document.getElementById('myVideo').play();
                        document.getElementById('playBtn').value = ">";

                    }

                }, false);

                document.getElementById('timeBtn').addEventListener('change', function(e) {

                    e.stopPropagation();
                    var time = document.getElementById('timeBtn').value;
                    document.getElementById('myVideo').setCurrentTime(time);

                }, false);

                document.getElementById('volBtn').addEventListener('change', function(e) {

                    e.stopPropagation();
                    var vol = document.getElementById('timeBtn').value;
                    document.getElementById('myVideo').setVolume(vol);

                }, false);

                break;


            default:
                console.log("没有设置参数  默认的构造")
                break;

        }

        _this.infoList.push(obj);
        _this.currentInfo = obj;
        _this.currentInfo.frameIndex = _this.currentObject.FrameIndex;

        console.log(_this.currentInfo);
        _this.currentInfo.on("mousedown",function(event){

            event.origDomEvent.stopPropagation();


            console.log(event.offsetX, event.offsetY);
            if(_this.currentInfo._lists[0].id != event.target.id)
            //当前点击的对象和焦点对象不是同一个FRAME
            {

                if(!!_this.currentInfo._lists[0].touched){
                    //当前的物体被点击到  焦点已经被锁定了
                    //除非解除锁定焦点状态不然无法操作其他FRAME
                    return;
                }

                _this.currentInfo = _this.getInfoInSceneById( event.target.id);

            }else
            //现在点击的对象和焦点对象是同一个FRAME
            {
                if(!_this.currentInfo._lists[0].touched){
                    //当前的物体没有被点击到
                    //此次点击是第一次点击

                    world._tCameraControls.enabled=false;
                    event.origDomEvent.preventDefault();
                    //当前obj是否被touch到
                    event.target.touched = true;
                    //canvas  是否被触碰到
                    //          event.origDomEvent.target.touched = true;
                    var o = tQuery(event.target);
                    o.material()._lists[0].color.setRGB(1,0,0);


                    return;
                }else{
                    //当前点击的物体是焦点物体
                    //并也也被在之前的选择上有点击

                    _this._delayId=setTimeout(function(){

                        _this.currentInfo.material()._lists[0].color.setHex(!_this.currentInfo.oldColor?16777215:_this.currentInfo.oldColor);
                        world._tCameraControls.enabled=true;
                        _this.currentInfo._lists[0].touched=false;

                    },500);

                }

            }

        });
        _this.currentInfo.on("mousemove",function(event){
            event.origDomEvent.preventDefault();
            event.origDomEvent.stopPropagation();

            o = event.target;



            if(o.touched != true)
            //这种情况是互动场景的时候碰到的
                return;


            event.stopPropagation();

            var pp = new THREE.Vector3();
            pp.subVectors(event.intersect.point,event.intersect.face.centroid);

            //鼠标出发 mousemove事件但是鼠标没有移动
            if((o.position.x-pp.x)===0&&(o.position.y-pp.y)===0)
                return;
            clearTimeout(_this._delayId);

            o.position.setX(pp.x);
            o.position.setY(pp.y);
        });

    };

    this.addFrameIntoScene= function(options){

        _this.ObjectsLength ++;



        var isFirstOne=false;
        var opt = options||{};

        if(!options){
            console.log("no options");
        }

        //检查参数的代码

        var FrameType = !opt.FrameType?"plane":opt.FrameType;//创建CUBE
        var FrameColor =!opt.FrameType? Math.random() * 0xffffff:opt.FrameColor;
        var MotionType = !opt.MotionType?1:opt.MotionType;
 /*       var ObjectPosition = !opt.ObjectPosition?opt.ObjectPosition:
                        (framesList[framesList.length-1]?framesList[framesList.length-1].position().clone():
                                    new THREE.Vector3(0,0,0));
    */

        var ObjectPosition =opt.ObjectPosition;
        if(!ObjectPosition){    //undefined
            if(_this.framesList.length===0){
                //表示当前加入的帧为第一个帧
                isFirstOne = true;
                ObjectPosition = new THREE.Vector3(0,0,0);
            }else{
                //////////
                //  不是第一个 找到当前的Frame 然后添加到下面去

                _this.currentObject = _this.framesList[_this.framesList.length -1];
                ObjectPosition = _this.currentObject.position().
                            clone().setX(_this.currentObject.position().x+_this.currentObject.scaleX()+1);

            }

        }


        var obj = null;
        switch(FrameType){

            case "plane":

                obj = tQuery.createCube().scale(3,2,0.01).position(ObjectPosition)
                                .material(new THREE.MeshBasicMaterial()).addTo(world);
                obj.VgMotion = new VgMotion(obj);


                obj.material(new THREE.MeshBasicMaterial({color:Math.random() * 0xffffff}));
                obj.oldColor=obj.material()._lists[0].color.getHex();





                break;

            case "cube":
                obj = tQuery.createCube().position(ObjectPosition).material(new THREE.MeshBasicMaterial()).addTo(world);
                obj.VgMotion = new VgMotion(obj);
                obj.oldColor=obj.material()._lists[0].color.getHex();
                //obj.oldColor=


   //             _this.currentObject.index = _this.framesList.length;

                break;

            default:

                console.log("没有设置参数  默认的构造")
                break;

        }

        obj.on("mousedown",function(event){
            // alert(event.type, obj.position(), event);
            event.origDomEvent.stopPropagation();


            if(_this.currentObject._lists[0].id != event.target.id)
            //当前点击的对象和焦点对象不是同一个FRAME
            {

                    if(!!_this.currentObject._lists[0].touched){
                        //当前的物体被点击到  焦点已经被锁定了
                        //除非解除锁定焦点状态不然无法操作其他FRAME
                        return;
                    }

                    _this.currentObject = _this.getObjInSceneById( event.target.id);

                    _this.updateCurrentIndex();

                    console.log(_this.currentObject._lists[0].id+"  "+event.target.id);
            }else
            //现在点击的对象和焦点对象是同一个FRAME
            {
                if(!_this.currentObject._lists[0].touched){
                    //当前的物体没有被点击到
                    //此次点击是第一次点击

                    world._tCameraControls.enabled=false;
                    event.origDomEvent.preventDefault();
                    //当前obj是否被touch到
                    event.target.touched = true;
                    //canvas  是否被触碰到
                    //          event.origDomEvent.target.touched = true;
                    var o = tQuery(event.target);
                    o.material()._lists[0].color.setRGB(1,0,0);


                    return;
                }else{
                    //当前点击的物体是焦点物体
                    //并也也被在之前的选择上有点击

                    _this._delayId=setTimeout(function(){
                        console.log("!!!!");

                        _this.currentObject.material()._lists[0].color.setHex(!_this.currentObject.oldColor?16777215:_this.currentObject.oldColor);
                        world._tCameraControls.enabled=true;
                        _this.currentObject._lists[0].touched=false;

                    },500);

                }

            }

        });
        obj.on("mousemove",function(event){
            event.origDomEvent.stopPropagation();
            event.origDomEvent.preventDefault();

                o = event.target;



            if(o.touched != true)
                //这种情况是互动场景的时候碰到的
                return;


            event.stopPropagation();

            var pp = new THREE.Vector3();
            pp.subVectors(event.intersect.point,event.intersect.face.centroid);

            //鼠标出发 mousemove事件但是鼠标没有移动
            if((o.position.x-pp.x)===0&&(o.position.y-pp.y)===0)
                    return;
            clearTimeout(_this._delayId);

            for(var key in _this.infoList) {

                if(_this.infoList[key].frameIndex === _this.currentObject.FrameIndex) {
                    _this.infoList[key].position().setX(_this.infoList[key].position().x - o.position.x + pp.x);
                    _this.infoList[key].position().setY(_this.infoList[key].position().y - o.position.y + pp.y);
                }
            }
            o.position.setX(pp.x);
            o.position.setY(pp.y);
        });

        _this.framesList.push(obj);
        _this.currentObject = obj;

        _this.currentObject.FrameIndex = _this.ObjectsLength;
        _this.currentObject.VgMotion.animationStart();

        _this.updateCurrentIndex();




    }

}
