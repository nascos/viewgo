/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-9-6
 * Time: 下午1:51
 * To change this template use File | Settings | File Templates.
 */

var VG_Frame = function(object){


    var _this = this;
    //当前的Frame对象属于哪个场景对象
    //默认只有一个Scene对象
    this.parentObject = object;
    this.type = "frame";
    this.ObjectsLength = 0;
    this.width = 9
    this.height = 13;
    this.color = Math.random()*0xffffff;
    this.position = new THREE.Vector3(0,0,0);



    //options 创建VG_Frame一个实力的可能选项
    this.createFrame = function(options){
        var opt = options||{};
        var frame = {};
        frame.type = _this.type;
        frame.color = !opt.color ? Math.random()* 0xffffff : opt.color;
        frame.width = !opt.width ? _this.width : opt.width;
        frame.height = !opt.height ? _this.height : opt.height;
        if(!_this.parentObject.freeMode){
            //不是自由模式
            if(_this.parentObject.currentFrameIndex ==-1){
                frame.position = !opt.position ? _this.position.clone() :opt.position.clone();
            }else{

                frame.position = !opt.position ? _this.parentObject.currentFrame.position().clone() : opt.position.clone();
                if(!opt.position){
                  frame.position.x += 3*5;
                }
            }
        }else{
            var cam = _this.parentObject.world._tCamera.position.clone();
            var tar = _this.parentObject.world._tCameraControls.target.clone();
            var offset = tar.sub(cam).normalize().multiplyScalar(3);
            frame.position = cam.add(offset).clone();
        }


        var object = tQuery.createCube().scale(frame.width,frame.height,0.01)
            .position(frame.position)
            .material(new THREE.MeshBasicMaterial({"color":frame.color}));
        object.type = frame.type;
        object.frame = frame;
        object.vgMotion = new VG_Motion(object);
        object.infoLists = [];
        object.vgWord = new VG_Word(object);
        object.vgImage = new VG_Image(object);
        object.vgVideo = new VG_Video(object);
        object.createWord = function(options){
            var word = object.vgWord.createWord(options);
            word.on("mousedown",function(event){
                if((!!_this.parentObject.selectedObject)&&(_this.parentObject.selectedObject != event.target)){
                    //之前存在一个info并且不是当前选中的对象
                    return;
                }

                if(_this.parentObject.selectedObject == event.target){
                    //上次已经选中了
                    _this.parentObject.delayId1 = setTimeout(function(){
                        _this.parentObject.selectedObject = null;
                        vg.world._tCameraControls.enabled = true;

                    },500);
                }else{
                    _this.parentObject.selectedObject = event.target;
                }

                _this.parentObject.currentInfo = word;

                if(_this.parentObject.selectedObject){
                    return ;
                }






                document.getElementById("wordText").value = _this.parentObject.currentInfo.word.text;

                vg.world._tCameraControls.enabled = false;



                _this.parentObject.plane.position.copy( _this.parentObject.currentFrame.position());
                _this.parentObject.plane.lookAt( vg.world._tCamera.position);
            });
            word.on("mousemove",function(event){

                if((_this.parentObject.selectedObject == event.target)
                        &&!(_this.parentObject.currentInfo.position() == event.target.position)){
                    clearTimeout(_this.parentObject.delayId1);
                }
                if(_this.parentObject.selectedObject == event.target){


                    _this.parentObject.plane.position.copy( _this.parentObject.currentFrame.position());
                    _this.parentObject.plane.lookAt( vg.world._tCamera.position);


                    vg.world._tCameraControls.enabled =false;
                    //指向焦点的vector3
                    //var vector = event.intersect.point.sub(_this.camera.position);
                    var vector = event.intersect.point.clone().sub(_this.parentObject.camera.position);

                    var raycaster = new THREE.Raycaster( _this.parentObject.camera.position, vector.normalize() );
                    var intersects =   raycaster.intersectObject( _this.parentObject.plane );
                    _this.parentObject.selectedObject.position.copy(intersects[0].point);
                    _this.parentObject.selectedObject.position.z =_this.parentObject.currentFrame.position().z+_this.parentObject.currentInfo.infoIndex/100 +0.01;
                }
            });
            word.on("mouseup",function(event){
                if(!!_this.parentObject.selectedObject){
                        _this.selectedObject = null;
                }
                vg.world._tCameraControls.enabled = true;
                //时间问题
                //_this.parentObject.currentInfo = null;
            })


            word.type="word";
            vg.currentInfo = word;
            var offset = vg.camera.position.clone().sub(word.parentObject.position().clone());

            word.lookAt(word.position().clone().add(offset));
            _this.parentObject.world.add(word);
            document.getElementById("wordText").value = word.word.text;

        }
        object.createImage = function(options){
            var image = object.vgImage.createImage(options);
            image.on("mousedown",function(event){
                if((!!_this.parentObject.selectedObject)&&(_this.parentObject.selectedObject != event.target)){
                    //之前存在一个info并且不是当前选中的对象
                    return;
                }

                if(_this.parentObject.selectedObject == event.target){
                    //上次已经选中了
                    _this.parentObject.delayId1 = setTimeout(function(){
                        _this.parentObject.selectedObject = null;
                        vg.world._tCameraControls.enabled = true;

                    },500);
                }else{
                    _this.parentObject.selectedObject = event.target;
                }
                if(_this.parentObject.selectedObject){
                    return ;
                }

                _this.parentObject.currentInfo = image;

                vg.world._tCameraControls.enabled = false;



                _this.parentObject.plane.position.copy( _this.parentObject.currentFrame.position());
                _this.parentObject.plane.lookAt( vg.world._tCamera.position);
            });
            image.on("mousemove",function(event){

                if((_this.parentObject.selectedObject == event.target)
                    &&!(_this.parentObject.currentInfo.position() == event.target.position)){
                    clearTimeout(_this.parentObject.delayId1);
                }
                if(_this.parentObject.selectedObject == event.target){


                    _this.parentObject.plane.position.copy( _this.parentObject.currentFrame.position());
                    _this.parentObject.plane.lookAt( vg.world._tCamera.position);


                    vg.world._tCameraControls.enabled =false;
                    //指向焦点的vector3
                    //var vector = event.intersect.point.sub(_this.camera.position);
                    var vector = event.intersect.point.clone().sub(_this.parentObject.camera.position);

                    var raycaster = new THREE.Raycaster( _this.parentObject.camera.position, vector.normalize() );
                    var intersects =   raycaster.intersectObject( _this.parentObject.plane );
                    _this.parentObject.selectedObject.position.copy(intersects[0].point);
                    _this.parentObject.selectedObject.position.z =_this.parentObject.currentFrame.position().z+_this.parentObject.currentInfo.infoIndex/100 +0.01;
                }
            });
            image.on("mouseup",function(event){
                if(!!_this.parentObject.selectedObject){
                    _this.selectedObject = null;
                }
                vg.world._tCameraControls.enabled = true;
                //时间问题
                //_this.parentObject.currentInfo = null;
            })

            var offset = vg.camera.position.clone().sub(image.parentObject.position().clone());

            image.type = "image";
            vg.currentInfo = image;


            image.lookAt(image.position().clone().add(offset));
            _this.parentObject.world.add(image);
        }

        object.createVideo = function(options){
            var video = object.vgVideo.createVideo(options);
            video.on("mousedown",function(event){
                if((!!_this.parentObject.selectedObject)&&(_this.parentObject.selectedObject != event.target)){
                    //之前存在一个info并且不是当前选中的对象
                    return;
                }

                if(_this.parentObject.selectedObject == event.target){
                    //上次已经选中了
                    _this.parentObject.delayId1 = setTimeout(function(){
                        _this.parentObject.selectedObject = null;
                        vg.world._tCameraControls.enabled = true;

                    },500);
                }else{
                    _this.parentObject.selectedObject = event.target;
                }
                if(_this.parentObject.selectedObject){
                    return ;
                }

                _this.parentObject.currentInfo = video;



                tQuery.world.loop().hook(function () {

                    document.getElementById('timeBtn').max = _this.parentObject.currentInfo.options.video.duration;
                    document.getElementById('timeBtn').value = _this.parentObject.currentInfo.options.video.currentTime;
                });
                document.getElementById('playBtn').value = _this.parentObject.currentInfo.options.video.paused ? "||" : ">";
                document.getElementById('volBtn').value = _this.parentObject.currentInfo.options.video.volume;




                vg.world._tCameraControls.enabled = false;



                _this.parentObject.plane.position.copy( _this.parentObject.currentFrame.position());
                _this.parentObject.plane.lookAt( vg.world._tCamera.position);
            });
            video.on("mousemove",function(event){

                if((_this.parentObject.selectedObject == event.target)
                    &&!(_this.parentObject.currentInfo.position() == event.target.position)){
                    clearTimeout(_this.parentObject.delayId1);
                }
                if(_this.parentObject.selectedObject == event.target){


                    _this.parentObject.plane.position.copy( _this.parentObject.currentFrame.position());
                    _this.parentObject.plane.lookAt( vg.world._tCamera.position);


                    vg.world._tCameraControls.enabled =false;
                    //指向焦点的vector3
                    //var vector = event.intersect.point.sub(_this.camera.position);
                    var vector = event.intersect.point.clone().sub(_this.parentObject.camera.position);

                    var raycaster = new THREE.Raycaster( _this.parentObject.camera.position, vector.normalize() );
                    var intersects =   raycaster.intersectObject( _this.parentObject.plane );
                    _this.parentObject.selectedObject.position.copy(intersects[0].point);
                    _this.parentObject.selectedObject.position.z =_this.parentObject.currentFrame.position().z+_this.parentObject.currentInfo.infoIndex/100 +0.01;
                }
            });
            video.on("mouseup",function(event){
                if(!!_this.parentObject.selectedObject){
                    _this.selectedObject = null;
                }
                vg.world._tCameraControls.enabled = true;
                //时间问题
                //_this.parentObject.currentInfo = null;
            })

            var offset = vg.camera.position.clone().sub(video.parentObject.position().clone());

            video.type = "video";
            vg.currentInfo = video;

            video.lookAt(video.position().clone().add(offset));
            _this.parentObject.world.add(video);
        }




//        object.material().color.setHex(frame.color);
        return object;
    }



    this.updateInfoPosition = function(offset){
        //offset 三维的偏移量

        if(vg.currentFrame.infoLists.length<=0){
            return ;
        }


        for(var k in vg.currentFrame.infoLists){
            vg.currentFrame.infoLists[k].position().add(offset);
        }
    }


//
//    this.bindControlEvent = function(object){
//        var obj = object;
//        obj.on("mousedown",function(event){
//
//
//
//
//
//        })
//
//        return obj;
//    }

    //frame: which frame
    this.getInfoById = function(frame,id){
        var length = frame.infoLists.length;
        for(var i=0;i<length;i++){
            if(frame.infoLists[i]._lists[0].id === id){
                //
                console.log("成功找到！");
                return frame.infoLists[i];
            }

        }
        return null;

    }
}