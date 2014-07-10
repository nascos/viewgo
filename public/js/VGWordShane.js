/**
 * Created with JetBrains WebStorm.
 * User: Shane
 * Date: 13-9-4
 * Time: 下午2:59
 * To change this template use File | Settings | File Templates.
 */

var VgWord = function(object){

    var _this = this;
    this.type = "word";
    this.parentObject = object;

    //默认内容
    this.text ="这是一段文字，请输入。";
    //字大小
    this.size = 12;
    //字体
    this.font = "KaiTi";
    //字体颜色
    this.fontColor = "#000000";
    this.backgroundColor = this.parentObject.material()._lists[0].color.getHexString();
    this.margin = 10;

    this.position = this.parentObject.position().clone();


    this.createWord = function(opt){
        var options = opt||{};


        var word = {};
        word.type = _this.type;
        word.margin =  !options.margin?
                    _this.margin:options.margin;

        word.font = !options.font?_this.font:options.font;
        word.size = !options.size?_this.size:options.size;
        word.text = !options.text?_this.text:options.text;
        word.fontColor = !options.fontColor?_this.fontColor:options.fontColor;
        word.backgroundColor = !options.backgroundColor?
                        _this.backgroundColor:options.backgroundColor;


        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        var textWidth = context.measureText(word.text).width;

        //先画背景
        context.fillStyle = word.backgroundColor;
        context.fillRect(canvas.width/2 - textWidth/2 - word.margin/2,
                canvas.height/2 - word.size / 2 - word.margin/2,
                textWidth + word.margin,word.size + word.margin);





        context.font = _this.size+"pt" + _this.font;
        context.textAlign = "center";
        context.textBaseLine = 'middle';
        context.fillStyle = word.fontColor;
        context.fillText(word.text,canvas.width/2,canvas.height/2);


        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({
            map : texture
        });
        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width,canvas.height),material);
        mesh.doubleSided = true;

        var obj = tQuery(mesh);
        obj.word = word;
        obj.infoIndex = ++_this.parentObject.totalInfoIndex;
        obj.scale(0.01,0.01,0.01);

        return obj;
    };



}
