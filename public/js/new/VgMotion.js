/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-9-6
 * Time: 下午2:00
 * To change this template use File | Settings | File Templates.
 */
var VG_Motion = function(object){
    if(!object){
        console.log("没有父对象传进来！将默认使用currentobj");
        return null;
    }
    var _this = this;
    this.parentObject = object;
    this.type = "motion";

    this._duration = 1600;//动画延迟


    this.startAnimation = function(){
        var cameraControl = vg.world._tCameraControls;
        cameraControl.isNeedToLookAt = false;

        var cameraPosition = vg.world._tCamera.position.clone();
        var cameraUp = vg.world._tCamera.up.clone();
        var cameraQuaternion = vg.world._tCamera.quaternion.clone();


        var pointTo = _this.parentObject.pointTo.clone().multiplyScalar(20);

        //camera下面的属性都是camera动画初始和结束的状态

        var startStatus = {
            coord_x : cameraPosition.x,
            coord_y : cameraPosition.y,
            coord_z : cameraPosition.z,
            up_x : cameraUp.x,
            up_y : cameraUp.y,
            up_z : cameraUp.z,
            quaternion_x : cameraQuaternion._x,
            quaternion_y : cameraQuaternion._y,
            quaternion_z : cameraQuaternion._z,
            quaternion_w : cameraQuaternion._w
        };

        //先使用直线测试
        var destinationStatus = {
            coord_x : _this.parentObject._lists[0].position.x + pointTo.x,
            coord_y : _this.parentObject._lists[0].position.y + pointTo.y,
            coord_z : _this.parentObject._lists[0].position.z + pointTo.z,
            up_x : _this.parentObject._lists[0].up.x,
            up_y : _this.parentObject._lists[0].up.y,
            up_z : _this.parentObject._lists[0].up.z,
            quaternion_x : _this.parentObject._lists[0].quaternion._x,
            quaternion_y : _this.parentObject._lists[0].quaternion._y,
            quaternion_z : _this.parentObject._lists[0].quaternion._z,
            quaternion_w : _this.parentObject._lists[0].quaternion._w
        }

        _this.tween = new TWEEN.Tween(startStatus)
            .to(destinationStatus , this._duration)
            //TODO : 还需要在这里增加拓展接口
            .easing(TWEEN.Easing.Elastic.InOut)
            .onStart(function(){

            }).onUpdate(function(){
                vg.world._tCamera.position = new THREE.Vector3(this.coord_x,this.coord_y,this.coord_z);
                vg.world._tCamera.up = new THREE.Vector3(this.up_x,this.up_y,this.up_z);
                vg.world._tCamera.quaternion._x = this.quaternion_x;
                vg.world._tCamera.quaternion._y = this.quaternion_y;
                vg.world._tCamera.quaternion._z = this.quaternion_z;
                vg.world._tCamera.quaternion._w = this.quaternion_w;
            }).onComplete(function(){

                cameraControl.target.set(_this.parentObject._lists[0].position.x ,
                    _this.parentObject._lists[0].position.y , _this.parentObject._lists[0].position.z);
                cameraControl.isNeedToLookAt = true;
                vg.plane.position.copy(_this.parentObject.position().clone())
                vg.plane.lookAt( vg.world._tCamera.position);
            }).start();
    }







//
//    this.startAnimation = function(){
//
//        var cameraControl = vg.world._tCameraControls;
//        cameraControl.isNeedToLookAt = false;
//
//        var cameraPosition = vg.world._tCamera.position.clone();
//
//        //camera下面的属性都是camera动画初始和结束的状态
//
//        var startStatus = {
//            x : cameraPosition.x,
//            y : cameraPosition.y,
//            z : cameraPosition.z
//        };
//
//
//        //先使用直线测试
//        var destinationStatus = {
//            x : _this.parentObject.position().x,
//            y : _this.parentObject.position().y,
//            z : _this.parentObject.position().z +3
//        }
//
//
//        var tween = new TWEEN.Tween(startStatus)
//            .to(destinationStatus , this._duration)
//            //TODO : 还需要在这里增加拓展接口
//            .easing(TWEEN.Easing.Elastic.InOut)
//            .onStart(function(){
//                vg.world._tCamera.up = _this.parentObject._lists[0].up.clone();
//                vg.world._tCamera.quaternion = _this.parentObject._lists[0].quaternion.clone();
//
//
//            }).onUpdate(function(){
//                vg.world._tCamera.position = new THREE.Vector3(this.x,this.y,this.z);
//
//            }).onComplete(function(){
//
//                cameraControl.target.set(destinationStatus.x , destinationStatus.y , destinationStatus.z);
//                cameraControl.isNeedToLookAt = true;
//            }).start();
//
//
//    }
////
//    this.createAnimation = function(){
//
//
//        var cameraControl = vg.world._tCameraControls;
//        cameraControl.isNeedToLookAt = false;
//
//        var cameraPosition = vg.world._tCamera.position.clone();
//       var cameraUp = vg.world._tCamera.up.clone();
//        var cameraQuaternion = vg.world._tCamera.quaternion.clone();
//
//        //camera下面的属性都是camera动画初始和结束的状态
//
//        var startStatus = {
//            coord_x : cameraPosition.x,
//            coord_y : cameraPosition.y,
//            coord_z : cameraPosition.z,
//            up_x : cameraUp.x,
//            up_y : cameraUp.y,
//            up_z : cameraUp.z,
//            quaternion_x : cameraQuaternion._x,
//            quaternion_y : cameraQuaternion._y,
//            quaternion_z : cameraQuaternion._z,
//            quaternion_w : cameraQuaternion._w
//        };
//
//
//        //先使用直线测试
//        var destinationStatus = {
//            coord_x : _this.parentObject._lists[0].position.x,
//            coord_y : _this.parentObject._lists[0].position.y,
//            coord_z : _this.parentObject._lists[0].position.z +3,
//            up_x : _this.parentObject._lists[0].up.x,
//            up_y : _this.parentObject._lists[0].up.y,
//            up_z : _this.parentObject._lists[0].up.z,
//            quaternion_x : _this.parentObject._lists[0].quaternion._x,
//            quaternion_y : _this.parentObject._lists[0].quaternion._y,
//            quaternion_z : _this.parentObject._lists[0].quaternion._z,
//            quaternion_w : _this.parentObject._lists[0].quaternion._w
//        }
//
//
//        _this.tween = new TWEEN.Tween(startStatus)
//            .to(destinationStatus , this._duration)
//            //TODO : 还需要在这里增加拓展接口
//            .easing(TWEEN.Easing.Elastic.InOut)
//            .onStart(function(){
//
//            }).onUpdate(function(){
//                vg.world._tCamera.position = new THREE.Vector3(this.coord_x,this.coord_y,this.coord_z);
//                vg.world._tCamera.up = new THREE.Vector3(this.up_x,this.up_y,this.up_z);
//                vg.world._tCamera.quaternion._x = this.quaternion_x;
//                vg.world._tCamera.quaternion._y = this.quaternion_y;
//                vg.world._tCamera.quaternion._z = this.quaternion_z;
//                vg.world._tCamera.quaternion._w = this.quaternion_w;
//            }).onComplete(function(){
//
//                cameraControl.target.set(destinationStatus.coord_x , destinationStatus.coord_y , destinationStatus.coord_z);
//                cameraControl.isNeedToLookAt = true;
//
//
//            }).start();
//
//    }
}