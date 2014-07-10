
var VG_Video= function(object){
    var _this = this;

    this.type="video";
    this.parentObject = object;
    //地址
    this.videoURL = this.videoURL = "video/sintel.mp4" || "video/sintel.ogv" || "video/sintel.webm";
    //透明
    this.opacity =1;
    //长宽
    this.width =6;
    this.height =4;
    this.position = this.parentObject.position().clone();

    this.createVideo = function(options){
        var obj = tQuery.createPlane();
        var opt = options||{};
        obj.options= {};
        obj.options.type= _this.type;
        obj.options.videoURL = !opt.url?_this.videoURL:opt.url;
        obj.options.width = !opt.w?_this.width:opt.w;
        obj.options.height = !opt.h?_this.height:opt.h;
        obj.options.position = !opt.position?this.position.clone():opt.position;

        obj.video = {};
        obj.video.videoURL = obj.options.videoURL;
        obj.video.width  = obj.options.width;
        obj.video.height = obj.options.height;
        obj.video.position = obj.options.position;


        var videoDom= document.createElement('video');
        videoDom.width =  obj.options.width;
        videoDom.height = obj.options.height;
        videoDom.controls = false;
        videoDom.autoplay = false;
        videoDom.loop = true;
        videoDom.src = obj.options.videoURL;
        videoDom.crossOrigin = "";



        var texture = new THREE.Texture(videoDom);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;




        var material = new THREE.MeshBasicMaterial({map:texture,overdraw:true});
        material.needsUpdate = true;
        obj._lists[0].scale=new THREE.Vector3(obj.options.width,obj.options.height,0.01);
        obj.material(material);
        obj.position(obj.options.position);
        obj.options.videoDom = videoDom;


        _this.parentObject.infoLists.push(obj);
        obj.infoIndex  = _this.parentObject.infoLists.length - 1;
        vg.currentInfo = obj;
        obj.position().z +=(obj.infoIndex/100+0.2);


        tQuery.world.loop().hook(function(){
            if ( videoDom.readyState === videoDom.HAVE_ENOUGH_DATA ) {
               texture.needsUpdate = true;
            }
            document.getElementById('timeBtn').max = obj.options.videoDom.duration;
            document.getElementById('timeBtn').value = obj.options.videoDom.currentTime;

        });

        obj.parentObject = _this.parentObject;




        return obj;
    };
    //点中的物体
    this.play = function(o){
        o.options.videoDom.play();
    };
    this.pause = function(o){
        o.options.videoDom.pause();
    };
    this.setCurrentTime = function(o,time){
        o.options.videoDom.currentTime = time;
    };
    this.setVolume = function(o,vol){
        o.options.videoDom.volume = vol;
    };

};