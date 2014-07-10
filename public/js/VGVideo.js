/**
 * Created with JetBrains WebStorm.
 * User: luyi
 * Date: 13-8-23
 * Time: 上午10:29
 * To change this template use File | Settings | File Templates.
 */
/**
 * Create Video
 */

var VGVideo = function(){

    var _this = this;

    _this.video = null;
    _this.mesh = null;

    _this.frameIndex = 0;

    createVideo("video/sintel.mp4");

    function createVideo(opts) {

        var texture, material, plane;

        // handle parameters
        if( arguments.length === 1 && typeof opts === 'string' ){
            opts	= { url : arguments[0] };
        }
        opts	= tQuery.extend(opts, {
            loop	: tQuery.world.loop()
        });
        console.assert( opts.url, "url MUST be specified" );

        // create the video element
        _this.video	= document.createElement('video');
        _this.video.id = "myVideo";
        document.body.appendChild(_this.video);
        _this.video.width	= 3;
        _this.video.height	= 2;
        _this.video.controls = false;
        _this.video.autoplay	= true;
        _this.video.loop	= true;
        _this.video.src	= opts.url;

        // create the texture
        texture	= new THREE.Texture( _this.video );

        material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

        plane = new THREE.PlaneGeometry( 3, 2, 4, 4 );

        _this.mesh = new THREE.Mesh( plane, material );

        opts.loop.hook(function(){
            if ( _this.video.readyState === _this.video.HAVE_ENOUGH_DATA ) {

                texture.needsUpdate = true;

            }
        });

    }

    this.play = function() {

        _this.video.play();

    };

    this.pause = function() {

        _this.video.pause();

    };

    this.setCurrentTime = function(time) {

        _this.video.currentTime = time;

    };

    this.setVolume = function(vol) {

        _this.video.volume = vol;
    };

    return tQuery(_this.mesh);

};
