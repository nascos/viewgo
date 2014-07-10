/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-8-31
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */

var VgVideo= function(object){
    var _this = this;

    this.type="video";
    this.parentObject = object;
    //地址
    this.videoURL = "video/sintel.mp4";
    //透明
    this.opacity =1;
    //长宽
    this.width =2;
    this.height =1;
    this.position = this.parentObject.position().clone();

    this.createVideo = function(url,w,h,position,opacity){
        var video= document.createElement('video');
        video.width = !w?_this.width:w;
        video.height = !h?_this.height:h;
        video.controls = false;
        video.autoplay = true;
        video.loop = true;
        video.src = !url?_this.videoURL:url;

        var texture = new THREE.Texture(video);
        var material = new THREE.MeshBasicMaterial({map:texture,overdraw:true});
        var plane = new THREE.PlaneGeometry(video.width,video.height,1,1);
        var mesh = new THREE.Mesh(plane,material);

        tQuery.world.loop().hook(function(){
            if(video.readyState === video.HAVE_ENOUGH_DATA){
                texture.needsUpdate = true;
            }

        });

       var obj =tQuery(mesh);
        obj.vidoe = video;
        obj.infoIndex = ++_this.parentObject.totalInfoIndex;


    };

    //点中的物体
    this.play = function(o){
        o.video.play();
    };
    this.pause = function(o){
        o.vidoe.pause();
    };
    this.setCurrentTime = function(o,time){
        o.video.currentTime = time;
    };
    this.setVolume = function(o,vol){
        o.video.volume = vol;
    };
};

