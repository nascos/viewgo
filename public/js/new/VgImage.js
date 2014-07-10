
var VG_Image = function(object){

    //object 当前对象 加入VgImage的对象
    // options 当前对象的选项
    var _this = this;
    this.type="image";
    this.parentObject = object;
    //地址
    this.imageURL = "img/1.jpg";
    //透明
    this.opacity =1;
    //长宽
    this.width =5;
    this.height =3;
    this.position = this.parentObject.position().clone();


    this.createImage=function(options){
        var opt = options ||{};
        var obj = tQuery.createPlane();

        obj.options= {};

        obj.options.type= _this.type;
        obj.options.imageURL = !opt.url?_this.imageURL:opt.url;
        obj.options.width = !opt.w?_this.width:opt.w;
        obj.options.height = !opt.h?_this.height:opt.h;
        obj.options.position = !opt.position?this.position.clone():opt.position;
        obj.options.opacity = !opt.opacity?this.opacity:opt.opacity;

        obj.image = {};
        obj.image = obj.options;


        var texture = THREE.ImageUtils.loadTexture(obj.options.imageURL);

        texture.crossOrigin = '';
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.LinearMipMapLinearFilter;

        var material = new THREE.MeshBasicMaterial({
            map:texture,
            opacity:obj.options.opacity
        });
        material.needsUpdate = true;
        obj._lists[0].scale=new THREE.Vector3(obj.options.width,obj.options.height,0.01);
        obj.material(material);
        obj.position(obj.options.position);

        _this.parentObject.infoLists.push(obj);
        obj.infoIndex  = _this.parentObject.infoLists.length - 1;
        vg.currentInfo = obj;
        obj.position().z +=(obj.infoIndex/100+0.1);
        obj.parentObject = _this.parentObject;

        return obj;
    };
};
