/**
 * Created with JetBrains WebStorm.
 * User: luyi
 * Date: 13-8-24
 * Time: 下午3:42
 * To change this template use File | Settings | File Templates.
 */

var VGImage = function(){

    var _this = this;


    _this.image = null;
    _this.plane = null;
    _this.mesh = null;

    _this.frameIndex = 0;

    createImage("images/earthmoonsun-small.jpg");

    function createImage(opts) {



        // handle parameters
        if( arguments.length === 1 && typeof opts === 'string' ){
            opts	= { url : arguments[0] };
        }

        console.assert( opts.url, "url MUST be specified" )

        // create the image element
        _this.image = new THREE.MeshBasicMaterial({
            map:THREE.ImageUtils.loadTexture( opts.url )
        });
        _this.image.map.needsUpdate = true;

        _this.plane = new THREE.PlaneGeometry( 2, 1, 4, 4 );
        _this.plane.overdraw = true;

        _this.mesh = new THREE.Mesh( _this.plane, _this.image );

    };

    return tQuery(_this.mesh);

};

