/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-7-25
 * Time: 下午2:31
 * To change this template use File | Settings | File Templates.
 */









var isCrossDomain = function(){



    if(window.location.host.length ===0){


       var filename =$("body").css("background").split(')')[1].split('/').pop();
       var path =window.location.pathname.split('/').pop().split('.')[0]; //路径

    }
    return;

}





//用来完成在viewGo增加内容的js
/*
param:  world 当前场景
        options 修饰当前帧的属性
        options


return:true 表示添加成功 false 表示失败
*/
function addFrameIntoWorld(world,options){





    return ture;
}

/*
param camera  当前场景的camera
        type  control 的类型
return  controler
 */
const DEFAULT_CAMERA_CONTROL = 1;
function getCameraControl(camera,type){
    var _type = !type?1:type;//camera控制的类型

    switch(_type){
        case 1:
            var control = new THREE.Controller(camera);
            control.rotateSpeed = 1.0;
            control.zoomSpeed = 1.2;
            control.panSpeed = 0.8;
            control.noZoom = false;
            control.noPan = false;
            control.staticMoving = true;
            control.dampingFactor = 0.3;
            return control;
            break;
        defalut:

            alert("function.js的getCameraControl中出错")
            return null;
            break;
    }
    alert("function.js的getCameraControl");

}

/*


*/
    const MOVE_CAMERA = 1;
    const MOVE_OBJECT = 2;
    const ROTATE_CAMERA = 3;

//object 是上一个object
var VgMotion = function(object,type){
    //if(!camera) {alert("no camera in VgMotion  "+this.URL);return;}
    if(!object) {alert("no object in VgMotion " +this.URL);return;}



    var _this = this;

    this._object = object;
    //  this._camera =  world.camera().get(0).clone();
    this._type = !type?1:type;





    if(!this._object.options){
        console.log("object has no options attr in VgMotion"+this.URL);

    }

    /*
    * options 包括 xyz ，rotation
    *
    *
    * */


    this._duration = !this._object.animationDuration?1500:this._object.animationDuration;

    /*
    this.getObjectPosition = function(){



        return THREE.Vector3();
    }
    */


    this.animationStart = function(){
        var cameraControl = world._tCameraControls;
        cameraControl.isNeedToLookAt=false;

      //      cameraControl.
        var _cameraPosition = world._tCamera.position.clone();
        var position ={
            x:_cameraPosition.x,
            y:_cameraPosition.y,
            z:_cameraPosition.z
        };

        var destination ={
            x:_this._object.position().x,
            y:_this._object.position().y,
            z:_this._object.position().z+3
        }
       _this.tween = new TWEEN.Tween(position)
                .to(destination ,this._duration)
                .easing(TWEEN.Easing.Elastic.InOut)
                .onStart(function(){
                    world._tCamera.up = _this._object._lists[0].up.clone();
                    world._tCamera.quaternion = _this._object._lists[0].quaternion.clone();

                }).onUpdate(
                 function(){
                    world._tCamera.position=new THREE.Vector3(this.x,this.y,this.z);

                   }).onComplete(
                function(){

                    cameraControl.target.set(destination.x,destination.y,destination.z-(window.innerWidth/window.innerHeight)*2 - 0.55);
//                    cameraControl._eye.copy(new THREE.Vector3(position.x,position.y,position.z))
//                                            .sub(cameraControl.target);
                    cameraControl.isNeedToLookAt = true;
                }).start();
    }
}