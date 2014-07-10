/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-5-15
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */
THREE.Controller = function (object,domElement){
    var _this = this;
    var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2,           //mouse state
                TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 }; //touch state


    this.isNeedToLookAt = true;


    this.object = object;
    this.domElement =(domElement !== undefined)? domElement : document;

    this.enabled =true;

    this.screen = { width: 0, height: 0, offsetLeft: 0, offsetTop: 0 };
    this.radius = ( this.screen.width + this.screen.height ) / 4;


    this.type = true;


    //public attribute
    this.rotateSpeed = 1.0;
    this.zoomSpeed = 1.2;
    this.panSpeed = 0.3;

    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;

    this.staticMoving =false;
    this.dampingFactor = 0.2;   //阻尼系数

    this.minDistance = 0;
    this.maxDistance = Infinity;
//    _eye = new THREE.Vector3(),         //未完成

    this.target = new THREE.Vector3();      //目标原点 视点

    //private attribute

    var hasSelectedObject = false;              //是否有一个物体被选中
    var selectedObject=null;                     //把被选中的物体赋给obj

    var lastPosition = new THREE.Vector3(),
        _state = STATE.NONE,                    //初始状态为0
        _prevState = STATE.NONE,                //前一个状态
          _eye = new THREE.Vector3(),         //未完成

        _rotateStart = new THREE.Vector3(),    //旋转的初始向量
        _rotateEnd  = new THREE.Vector3(),

        _zoomStart = new THREE.Vector2(),
        _zoomEnd = new THREE.Vector2(),

        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,

        _touchZoomDistanceStart = 0,
        _touchZoomDistanceEnd = 0,

        _panStart = new THREE.Vector2(),
        _panEnd = new THREE.Vector2();


       //  for reset

    this.target0 = this.target.clone();
    this.position0 = this.object.position.clone();      //camera
    this.up0 = this.object.up.clone();

    //events

    var changeEvent = {tyepe:'change'};

    //methods

    this.handleResize = function (){
        this.screen.width = window.innerWidth;
        this.screen.height = window.innerHeight;

        this.screen.offsetLeft = 0;
        this.screen.offsetTop = 0;

        this.radius = (this.screen.width + this.screen.height ) /4;
    };

    this.handleEvent = function (event){

        if(typeof this[event.type] == 'function'){
            this[event.type](event);        //事件处理函数调用
        }

    };

    this.getMouseOnScreen = function (clientX,clientY){

        return new THREE.Vector2(
            (clientX- _this.screen.offsetLeft)/_this.radius *0.5,
            (clientY- _this.screen.offsetTop)/_this.radius *0.5
        );
    }


    this.getMouseProjectionOnBall = function (clientX,clientY){

        var mouseOnBall = new THREE.Vector3(
            (clientX - _this.screen.width *0.5 - _this.screen.offsetLeft)/_this.radius,
            (_this.screen.height * 0.5 + _this.screen.offsetTop - clientY)/_this.radius,
            0.0
        );

        var length = mouseOnBall.length();

        if(length > 1.0){
            mouseOnBall.normalize();            //单位化
                                             //触摸地方 在靠左或者靠右的位置则忽略z方向上的变化

        }else{
                                        //出没地方 靠中间点的位置怎把z方向上的变化+进去
            mouseOnBall.z = Math.sqrt(1.0 - length*length);   //x^2 + y^2 = length^2
        }

        _eye.copy(_this.object.position).sub(_this.target);


        //计算projection方向
        var projection =  _this.object.up.clone().setLength(mouseOnBall.y);
        projection.add(_this.object.up.clone().cross(_eye).setLength(mouseOnBall.x));
        projection.add(_eye.setLength(mouseOnBall.z));

        return projection;
    };

    this.rotateCamera = function(){
        //  a/b/c == a/(b*c)
        var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

        if(angle){
            var axis = (new THREE.Vector3()).crossVectors(_rotateStart,_rotateEnd).normalize(),
                quaternion = new THREE.Quaternion();

            angle *= _this.rotateSpeed;

            quaternion.setFromAxisAngle(axis,-angle);  //沿着axis轴选装 -angle角度

            _eye.applyQuaternion(quaternion);
            _this.object.up.applyQuaternion(quaternion);

            _rotateEnd.applyQuaternion(quaternion);

            if(_this.staticMoving){
                _rotateStart.copy(_rotateEnd);
            }else{

                quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
                _rotateStart.applyQuaternion( quaternion );
            }
        }
    };

    this.zoomCamera = function (){
        if(_state === STATE.TOUCH_ZOOM){
            var factor = _touchZoomDistanceStart/_touchZoomDistanceEnd;     //计算缩放因子
            _touchZoomDistanceStart = _touchZoomDistanceEnd;
            _eye.multiplyScalar(factor);
        }else{
            var  factor = 1.0 + (_zoomEnd.y - _zoomStart.y)* _this.zoomSpeed;

            if(factor !== 1.0 && factor >0.0 ){
                _eye.multiplyScalar(factor);

                if(_this.staticMoving){
                    _zoomStart.copy(_zoomEnd);
                }else {
                    _zoomStart.y += (_zoomEnd.y - _zoomStart.y )* this.dynamicDampingFactor;
                }

            }

        }

    };

    this.panCamera = function (){
        var mouseChange = _panEnd.clone().sub(_panStart);   //得到移动的方向向量

        if(mouseChange.lengthSq()){
            mouseChange.multiplyScalar(_eye.length()*_this.panSpeed);  //调整移动速度

            //获得移动方向向量
            var pan = _eye.clone().cross(_this.object.up).setLength(mouseChange.x);
            pan.add(_this.object.up.clone().setLength(mouseChange.y));

            //把移动效果添加到camera上
            _this.object.position.add(pan);
            _this.target.add(pan);


            //添加阻尼因子
            if(_this.staticMoving){
                _panStart = _panEnd;
            }else{
                _panStart.add(mouseChange.subVectors(_panEnd,_panStart).multiplyScalar(_this.dampingFactor));

            }
        }
    };


    this.checkDistances = function(){
        if(!_this.noZoom || !_this.noPan){
            //尽量减少开根号运算  性能优化
            if(_this.object.position.lengthSq() > _this.maxDistance * _this.maxDistance){
                _this.object.position.setLength(_this.maxDistance);
            }

            if(_eye.lengthSq() < _this.minDistance * _this.minDistance){
                _this.object.position.addVectors(_this.target,_eye.setLength(_this.minDistance));
            }
        }

    }


    this.update = function(){


        _eye.subVectors(_this.object.position , _this.target);
        if(!_this.noRotate){
            _this.rotateCamera();
        }

        if( !_this.noZoom){
            _this.zoomCamera();
        }
        if(!_this.noPan){
            _this.panCamera();
        }

        _this.object.position.addVectors(_this.target,_eye);

        _this.checkDistances();


       if(_this.isNeedToLookAt)
        _this.object.lookAt(_this.target);


        if( lastPosition.distanceToSquared(_this.object.position) > 0){
            _this.dispatchEvent(changeEvent);
            lastPosition.copy(_this.object.position);
        }
    };

    //还原
    this.reset = function(){
        _state = STATE.NONE;
        _prevState = STATE.NONE;

        _this.target.copy(_this.target0);
        _this.target.position.copy(_this.position0);
        _this.object.up.copy(_this.up0);

        _eye.subVectors( _this.object.position,_this.target );

        _this.object.lookAt(_this.target);

        _this.dispatchEvent(changeEvent);

        lastPosition(_this.objects.position);

    }



    function mousedown(event){
        if( _this.enabled == false) return;

        event.preventDefault();
        event.stopPropagation();

        if( _state === STATE.NONE){
            _state = event.button;
        }

        if(_state === STATE.ROTATE && !_this.noRotate){
            _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall(event.clientX,event.clientY);
        }else if(_state === STATE.ZOOM && !_this.noZoom){
            _zoomStart = _zoomEnd = _this.getMouseOnScreen(event.clientX,event.clientY);
        }else if(_state === STATE.PAN && !_this.noPan){
            _panStart = _panEnd =_this.getMouseOnScreen(event.clientX,event.clientY);
        }

        document.addEventListener('mousemove',mousemove,false);
        document.addEventListener('mouseup',mouseup,false);

};

    function mousemove(event){
        if(_this.enabled === false)return ;
        event.preventDefault();
        event.stopPropagation();


        if(_state === STATE.ROTATE  && !_this.noRotate){
            _rotateEnd = _this.getMouseProjectionOnBall(event.clientX,event.clientY);
        }else if(_state === STATE.ZOOM && !_this.noZoom){
            _zoomEnd = _this.getMouseOnScreen(event.clientX,event.clientY);
        }else if(_state ===STATE.PAN  && !_this.noPan){
            _panEnd = _this.getMouseOnScreen(event.clientX,event.clientY);
        }
    }

    function mouseup(event){
        if(_this.enabled ===false) return ;

        event.preventDefault();
        event.stopPropagation();

        _state = STATE.NONE;

        document.removeEventListener('mousemove',mousemove);
        document.removeEventListener('mouseup',mouseup);
    }

    function mousewheel(event){
        if(_this.enabled  ===false ) return ;

        event.preventDefault();
        event.stopPropagation();

        var delta = 0;      //滚轮的滚动值

        if(event.wheelDelta){       //webkit  opera explorer9
            delta = event.wheelDelta/40;
        }else if (event.detail){        //firefox
            delta= -event.detail /3;
        }

        _zoomStart.y +=delta * 0.01;

    }

    function touchstart(event){
        if(_this.enabled ===false) return;
   /*
        if(event.target.touched===true){
            return;
        }
    */
        switch(event.touches.length){
            case 1:
                _state = STATE.TOUCH_ROTATE;
                _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall(
                                event.touches[0].pageX,event.touches[0].pageY);
                break;
            case 2:
                _state = STATE.TOUCH_ZOOM;
                var dx = event.touches[0].pageX -event.touches[1].pageX;
                var dy = event.touches[0].pageY -event.touches[1].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart =  Math.sqrt(dx*dx +dy*dy);
                break;
            case 3:
                _state = STATE.TOUCH_PAN;
                _panStart = _panEnd = _this.getMouseOnScreen(event.touches[0].pageX,event.touches[0].pageY);
                break;

            default:
                _state = STATE.NONE;
        }
    }

    function touchmove(event){

        if(_this.enabled ===false) return;
        if(event.target.touchObject===true){
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        switch(event.touches.length){
            case 1:
                _rotateEnd = _this.getMouseProjectionOnBall(event.touches[0].pageX,event.touches[0].pageY);
                break;
            case 2:
                var dx = event.touches[0].pageX - event.touches[1].pageX;
                var dy = event.touches[0].pageY - event.touches[1].pageY;
                _touchZoomDistanceEnd = Math.sqrt(dx*dx + dy*dy);
                break;
            case 3:
                _panEnd = _this.getMouseOnScreen(event.touches[0].pageX,event.touches[0].pageY);
                break;
            default:
                _state = STATE.NONE;
        }
    }


    function touchend(event){
        if(_this.enabled===false)return;
        if(event.target.touchObject===true){
            return;
        }

        switch(event.touches.length){
            case 1:
                _rotateStart = _rotateEnd = _this.getMouseProjectionOnBall(event.touches[0].pageX,
                                                        event.touches[0].pageY);
                break;
            case 2:
                _touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
                break;
            case 3:
                _panStart = _panEnd = _this.getMouseOnScreen(event.touches[0].pageX,event.touches[0].pageY);
                break;


        }

        _state = STATE.NONE;
    }


    this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

    this.domElement.addEventListener( 'mousedown', mousedown, false );

    this.domElement.addEventListener( 'mousewheel', mousewheel, false );
    this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

    this.domElement.addEventListener( 'touchstart', touchstart, false );
    this.domElement.addEventListener( 'touchend', touchend, false );
    this.domElement.addEventListener( 'touchmove', touchmove, false );

    this.handleResize();


};

THREE.Controller.prototype = Object.create(THREE.EventDispatcher.prototype);