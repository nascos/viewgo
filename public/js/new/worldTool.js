/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-9-6
 * Time: 下午1:21
 * To change this template use File | Settings | File Templates.
 */

var VG = function (){
    var _this = this;
    this.world = null;
    this.camera = null;
    this.vgFrame = null;
    this.framesList= [];
    //辅助计算位置的
    this.plane = null;
    this.projector = new THREE.Projector();

    //当前操作的帧
    this.currentFrame = null;
    this.currentFrameIndex = -1;
    //当前操作的信息
    this.currentInfo = null;
    this.selectedObject = null;
    this.selectedInfo = null;
    this.delayId = 0;
    this.delayId1 = 0;
    this.freeMode = false;


    //计算移动的mousemove
    function onMouseMove(event){
      event.preventDefault();
      var mouse = {};
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
      _this.projector.unprojectVector(vector,_this.camera);
      var raycaster = new THREE.Raycaster( _this.camera.position, vector.sub( _this.camera.position ).normalize() );
      var intersects = raycaster.intersectObjects( _this.plane );

        if(intersects.length > 0){
      _this.selectedObject.position.copy(intersects[0].position);
      }

      console.log(intersects[0]);

    }
//
//    function onMouseUp(event){
//        vg.world._tCameraControls.enabled =true;
//        vg.world._tRenderer.domElement.addEventListener("mousemove",onMouseMove,false);
//        //vg.world._tRenderer.domElement.addEventListener("mouseup",onMouseUp,false);
//    }

    this.addFrame = function(options){
        var opt = options || {};
        var frame = _this.vgFrame.createFrame(opt);
        frame.on("mousedown",function(event){
            /*if(_this.selectedObject){
                //存在一个被选择的物体
                return;
            }else{
            }
            */
            if((!!_this.selectedObject)&&(_this.selectedObject != event.target)){
                //之前存在一个对象并且还不是当前选中的对象
                return;
            }

            if(_this.selectedObject == event.target){
                //上次已经选中了
                _this.delayId=setTimeout(function(){
                    world._tCameraControls.enabled=true;
                    _this.selectedObject = null;
                    },500);
            }else{

                //TODO 这个是需要加入定位代码的
                _this.selectedObject = event.target;

            }
            if(!_this.selectedObject){
                return;
            }

            //有物体被点击到
            vg.world._tCameraControls.enabled =false;

            _this.currentFrame = vg.getTQueryByMeshId(event.target.id);

            //改变水平面的位置
            _this.plane.position.copy( event.target.position );
            //并把水平面指向到相机的方向
            _this.plane.lookAt( _this.world._tCamera.position );
        });
        frame.on("mousemove",function(event){

            if(_this.selectedObject == event.target){
                clearTimeout(_this.delayId);
            }

             //var mouse = {};
            if(_this.selectedObject == event.target){

            //指向焦点的vector3
            //var vector = event.intersect.point.sub(_this.camera.position);
            var vector = event.intersect.point.clone().sub(_this.camera.position);

            var raycaster = new THREE.Raycaster( _this.camera.position, vector.normalize() );
            var intersects =   raycaster.intersectObject( _this.plane );
            if(intersects.length > 0){
                var offset = intersects[0].point.clone().sub(_this.selectedObject.position);

                _this.selectedObject.position.copy(intersects[0].point);
                //父对象的位置发生了变化 当前frame所包含的的infolists都跟随着位置发生变化
                vg.vgFrame.updateInfoPosition(offset);
            }



            console.log("mousemove");


            }
        });
        frame.on("mouseup",function(event){
        //此处代码为了PC端访问
        //    alert("mouseup");
            if(!!_this.selectedObject){
                //存在一个被选择的物体
                //那么需要释放这个对象
                _this.selectedObject = null;
            }

            vg.world._tCameraControls.enabled =true;
            //vg.world._tRenderer.domElement.removeEventListener("mousemove",onMouseMove);
            //vg.world._tRenderer.domElement.removeEventListener("mouseup",onMouseUp);

            console.log("mouseup");


        });




        _this.currentFrame = frame;
        _this.framesList.push(frame);
        _this.currentFrameIndex++;
        frame.frameIndex = _this.currentFrameIndex



        if(vg.freeMode){
            console.log(frame._lists[0].quaternion);
            frame.pointTo = _this.camera.position.clone().sub(frame.position().clone()).normalize();
            frame.lookAt(_this.camera.position);
            console.log(frame._lists[0].quaternion);
        }else{
            frame.pointTo = new THREE.Vector3(0,0,1);
        }



//        frame.pointTo = _this.camera.position.clone().sub(frame.position().clone()).normalize()
        //TODO 更新当前的  frameIndex

        frame.addTo(_this.world);
        frame.vgMotion.startAnimation();

//        frame.lookAt(_this.camera.position);

    }







    this.createWorld = function(){
        if(true){
            //是否有载入的内容

        }

        var world = tQuery.createWorld().boilerplate({
            stats:false
        }).start();
        _this.world = world;
        _this.camera = world._tCamera;

        return world;
    }

    this.initWorld = function(){

        _this.vgFrame = new VG_Frame(_this);
        var control = new THREE.Controller(_this.world._tCamera,_this.world._tRenderer.domElement);
        control.rotateSpeed = 1.0;
        control.zoomSpeed = 1.2;
        control.panSpeed = 0.8;
        control.noZoom = false;
        control.noPan = false;
        control.staticMoving = true;
        control.dampingFactor = 0.3;

        _this.world.setCameraControls(control);
        _this.world.tRenderer().setClearColor(0x000000,0.2);
        _this.world.enableDomEvent();

        _this.plane = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
        _this.plane.visible = false;
        _this.world.add( _this.plane );





    }

    this.deleteFrame = function(id){
        //id 为 frameIndex
        //
       var  index = id||vg.currentFrameIndex;



        for(;vg.currentFrame.infoLists.length>0;){
            var t=vg.framesList[index].infoLists.pop();
            t.off("mousemove");
            t.off("mousedown");
            t.off("mouseup");
            vg.world.remove(t);
        }
        var tt=vg.framesList.pop(index);
        tt.off("mousemove");
        tt.off("mousedown");
        tt.off("mouseup");
        vg.world.remove(tt);
        vg.updateFrameIndex();
        if(index >= vg.framesList.length){
            index = vg.framesList.length -1 ;
        }
        vg.currentFrameIndex = index;
        vg.currentFrame = vg.framesList[index];
    }


    this.moveNextFrame = function (){
        if(_this.currentFrameIndex == _this.framesList.length-1){
            //最后一个frame 跳转到第一个frame
            _this.currentFrameIndex = 0;
        }else{
            _this.currentFrameIndex++;
        }
        _this.currentFrame = _this.framesList[_this.currentFrameIndex];
        _this.currentFrame.vgMotion.startAnimation();

    }
    this.movePrevFrame = function(){
        if(_this.currentFrameIndex == 0){
            //第一个frame 跳转到 最后一个frame
            _this.currentFrameIndex = _this.framesList.length-1;
        }else{
            _this.currentFrameIndex--;
        }
        _this.currentFrame = _this.framesList[_this.currentFrameIndex];
        _this.currentFrame.vgMotion.startAnimation();
    }
    this.moveFirstFrame = function(){
        _this.currentFrameIndex = 0;
        _this.currentFrame = _this.framesList[_this.currentFrameIndex];
        _this.currentFrame.vgMotion.startAnimation();
    }
    this.moveLastFrame = function(){
        _this.currentFrameIndex = _this.framesList.length-1;
        _this.currentFrame = _this.framesList[_this.currentFrameIndex];
        _this.currentFrame.vgMotion.startAnimation();
    }
    this.getTQueryByMeshId = function(id){
        var length = _this.framesList.length;
        for(var i = 0; i< length; i++){
            if(_this.framesList[i]._lists[0].id === id){
                return _this.framesList[i];
            }

        }
        console.log("没有找到对于frame");
        return null;



    }



    this.scaleUp = function(){

        var scale = _this.currentFrame.scale().clone();

        scale.x +=0.1;
        scale.y +=0.1;
        _this.currentFrame.scale(scale.x,scale.y,scale.z);
    }

    this.scaleDown = function(){

        var scale = _this.currentFrame.scale().clone();

        scale.x -=0.1;
        scale.y -=0.1;
        _this.currentFrame.scale(scale.x,scale.y,scale.z);
    }

    this.updateFrameIndex = function(){
        var length = _this.framesList.length;
        var i=0;
        for(i =0;i<length;i++){
            _this.framesList[i].frameIndex =i;
        }
    }

//    this.


    this.initInfoEvent = function(){

        document.getElementById('wordText').addEventListener("keyup",function(event){
            var o = event;
            _this.currentFrame.vgWord.update({

            },_this.currentInfo)

        },false);
    }


    this.exporter=function(){
        //把场景里面的输出出来
        //return sceneObject as a json

        var  outObject = [];
        for(var i = 0;i < vg.framesList.length; i++){
            vg.framesList[i].frame.position = vg.framesList[i].position()
            outObject.push(vg.framesList[i].frame);
            for(var j =0;j < vg.framesList[i].infoLists.length;j++)
                switch(vg.framesList[i].infoLists[j].type){
                    case "word":
                        vg.framesList[i].infoLists[j].word.position = vg.framesList[i].infoLists[j].position()
                        outObject.push(vg.framesList[i].infoLists[j].word);

                        break;
                    case "image":
                            vg.framesList[i].infoLists[j].image.position = vg.framesList[i].infoLists[j].position()
                            outObject.push(vg.framesList[i].infoLists[j].image);
                        break;
                    case "video":
                            vg.framesList[i].infoLists[j].video.position = vg.framesList[i].infoLists[j].position()
                            outObject.push(vg.framesList[i].infoLists[j].video);
                        break;

                    default:
                        break;
           }

        }

        return outObject;
    }



    this.importer = function(sceneObject){
        //把传入的JSON对象
        //加载到场景里面

        vg.freeMode = false;
        for(var i =0;i<sceneObject.length ; i++){
            sceneObject[i].position = new THREE.Vector3(sceneObject[i].position.x,sceneObject[i].position.y,sceneObject[i].position.z);
        }

        for(var i = 0 ; i< sceneObject.length ; i++){
            switch(sceneObject[i].type){
                case "frame":
                    vg.addFrame(sceneObject[i]);
                    break;
                case "word":
                    vg.currentFrame.createWord(sceneObject[i]);
                    break;
                case "image":
                    vg.currentFrame.createImage(sceneObject[i]);
                    break;
                case "video":
                    vg.currentFrame.createVideo(sceneObject[i]);
                    break;
                default:
                    break;

            }

        }



    }

    this.readFILE = function(url){
        //json的地址
        //解析后返回一个sceneObject

    }

    this.updateJsonObjct = function (type,options){




    }



}


var status = function(){
    var _this = this;

    //true为可控制场景 false为不可以控制场景
    this.worldControl=true;

    this.cameraControl = true;

}

