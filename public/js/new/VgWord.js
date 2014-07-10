
var VG_Word = function(object){
    var _this = this;
    this.type = "word";
    this.parentObject = object;

    //默认内容
    this.text ="这是一段文字，请输入...";
    //字大小
    this.size = 24;
    //字体
    this.font = "KaiTi";
    //字体颜色
    this.fontColor = "#000000";

    //字体加粗
    this.fontBold = " ";
    //字体倾斜
    this.fontItalic = " ";

    this.backgroundColor = this.parentObject.material()._lists[0].color.getHexString();

    this.position = this.parentObject.position().clone();

    this.createWord = function(options){
        var opt = options||{};
        var word = {};
        word.type = _this.type;
        word.font = !opt.font?_this.font:opt.font;
        word.size = !opt.size?_this.size:opt.size;
        word.text = !opt.text?_this.text:opt.text;
        word.fontColor = !opt.fontColor?_this.fontColor:opt.fontColor;
        word.fontBold = !opt.fontBold ? _this.fontBold : opt.fontBold;
        word.fontItalic = !opt.fontItalic ? _this.fontItalic : opt.fontItalic;
        word.backgroundColor = !opt.backgroundColor ? _this.backgroundColor : opt.backgroundColor;


        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        //context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = word.size + "px " + word.font;

        var textWidth = context.measureText(word.text).width;

        canvas.width = textWidth;
        canvas.height = word.size;

        //先画背景
        context.fillStyle = word.backgroundColor;
        context.fillRect(canvas.width/2 - textWidth/2, canvas.height/2 - word.size / 2, textWidth, word.size);

        context = canvas.getContext("2d");
        context.font = word.size + "px " + word.font;

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = word.fontColor;
        context.fillText(word.text, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;


        var material = new THREE.MeshBasicMaterial({
            map : texture
        });
        var mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.width,canvas.height),material);
        mesh.doubleSided = true;

        var obj = tQuery(mesh);
        obj.position(this.position);
        obj.word = word;

        _this.parentObject.infoLists.push(obj);
        obj.infoIndex  = _this.parentObject.infoLists.length - 1;
        vg.currentInfo = obj;


        obj.scaleX(canvas.width/10000 );
        obj.scaleY(canvas.height/1000);
        obj.scaleZ(0.01);
        obj.position().z +=(obj.infoIndex/100+0.1);


        obj.parentObject = _this.parentObject;
        return obj;
    };

    this.update = function(options, wordObject) {

        var font = !options.font?wordObject.word.font:options.font;
        var size = !options.size?wordObject.word.size:options.size;
        var text = !options.text?wordObject.word.text:options.text;
        var fontColor = !options.fontColor?wordObject.word.fontColor:options.fontColor;
        var backgroundColor = wordObject.word.backgroundColor;

        wordObject.word.font = font;
        wordObject.word.size = size;
        wordObject.word.text = text;
        wordObject.word.fontColor = fontColor;

        var canvas = document.createElement("canvas");

        var context = canvas.getContext("2d");

        //context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = size + "px " + font;

        var textWidth = context.measureText(text).width;

        canvas.width = textWidth;
        canvas.height = size;

        //先画背景
        context.fillStyle = backgroundColor;
        context.fillRect(canvas.width/2 - textWidth/2, canvas.height/2 - size / 2, textWidth, size);

        context = canvas.getContext("2d");
        context.font = size + "px " + font;

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = fontColor;
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;

        var material = new THREE.MeshBasicMaterial({
            map : texture
        });

        wordObject.material(material);
        wordObject.scaleX(canvas.width/10000);
        wordObject.scaleY(canvas.height/1000);
        wordObject.scaleZ(0.01);
    }
}