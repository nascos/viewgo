var VgImage = function(object){
    //object 当前对象 加入VgImage的对象
    // options 当前对象的选项
    var _this = this;
    this.type="image";
    this.parentObject = object;
    //地址
    this.imageURL = "images/earthmoonsun-small.jpg";
    //透明
    this.opacity =1;
    //长宽
    this.width =2;
    this.height =1;
    this.position = this.parentObject.position().clone();




    this.createImage=function(url,w,h,position,opacity){
        var obj = tQuery.createPlane();
        obj.options= [];
        obj.options.type= _this.type;
        obj.options.imageURL = !url?_this.imageURL:url;
        obj.options.width = !w?_this.width:w;
        obj.options.height = !h?_this.height:h;
        obj.options.position = !position?this.position.clone():position;
        obj.options.opacity = !opacity?this.opacity:opacity;



        var material = new THREE.MeshBasicMaterial({
            map:THREE.ImageUtils.loadTexture(obj.options.imageURL),
            opacity:obj.options.opacity
        });
        material.needsUpdate = true;
        obj._lists[0].scale=new THREE.Vector3(obj.options.width,obj.options.height,0.01);
        obj.material(material);
        obj.position(obj.options.position);



//        obj.geometry().overdraw = ture;
//        这段代码?
//        obj.geometry().overdraw = true;


        obj.infoIndex = ++_this.parentObject.totalInfoIndex;
        return obj;
    }



   /*
    this.update=function(options,imageObject){

    //读取options里面的数据 对象进行修改
    }
    */

}