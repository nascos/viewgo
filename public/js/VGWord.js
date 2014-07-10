/**
 * Created with JetBrains WebStorm.
 * User: luyi
 * Date: 13-8-24
 * Time: 下午4:04
 * To change this template use File | Settings | File Templates.
 */

var VGWord = function(){

    var _this = this;

    _this.frameIndex = 0;

    _this.text = "你若不离不弃，我便生死相依";
    _this.size = 12;
    _this.font = "KaiTi";
    _this.color = "#000000";

    _this.mesh = null;
    _this.texture = null;
    _this.material = null;
    _this.plane = null;

    _this.canvas = document.createElement("canvas");
    _this.canvas.setAttribute("id", "myCanvas");
    document.body.appendChild(_this.canvas);

    _this.showTool = true;

    this.setSize = function(size) {

        _this.size = size;
        return this;

    };

    this.setText = function(text) {

        _this.text = text;
        return this;

    };

    this.setFont = function(font) {

        _this.font = font;
        return this;

    };

    this.setColor = function(color) {

        _this.color = color;
        return this;

    };

    this.getMesh = function() {

        return tQuery(_this.mesh);

    };

    this.refreshWord = function( currentObj, currentPos, text, size, font, color ) {

        currentObj.removeEventListener("mousedown", false);
        currentObj.removeEventListener("mousemove", false);

        world.remove(currentObj);

        var obj = new VGWord().setText(text).setSize(size).setColor(color).setFont(font).createWord();

        obj.position( currentPos );
        obj.scale(0.01, 0.01, 0.01);
        //obj.VgMotion = new VgMotion( obj );
        //mesh.addWordEvenListener();
        //document.body.appendChild( tool );
        world.add( obj );

        obj.oldColor=obj.material()._lists[0].color.getHex();

        return obj;

    };

    this.createWord = function(backGroundColor, backgroundMargin) {

        if(!backgroundMargin)
            backgroundMargin = 0;

        //_this.canvas = document.createElement("canvas");
        //_this.canvas.id = "myCanvas";
        $(document).ready(function(){

            var canvas = document.getElementById('myCanvas');

            var context = canvas.getContext("2d");

            //context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = _this.size + "px " + _this.font;

            var textWidth = context.measureText(_this.text).width;

            canvas.width = textWidth + backgroundMargin;
            canvas.height = 12 + backgroundMargin;
            context = canvas.getContext("2d");
            context.font = _this.size + "px " + _this.font;

            console.log(context.font);



            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = _this.color;
            context.fillText(_this.text, canvas.width / 2, canvas.height / 2);

            if(!backGroundColor) {

                context.globalAlpha = 0;
                context.fillStyle = backGroundColor;

                context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2,
                    canvas.height / 2 - _this.size / 2 - backgroundMargin / 2,
                    textWidth + backgroundMargin, _this.size + backgroundMargin);

            } else {

                context.fillStyle = backGroundColor;

                context.fillRect(canvas.width / 2 - textWidth / 2 - backgroundMargin / 2,
                    canvas.height / 2 - _this.size / 2 - backgroundMargin / 2,
                    textWidth + backgroundMargin, _this.size + backgroundMargin);

            }
            console.log(canvas);
            _this.texture = new THREE.Texture(canvas);
            _this.texture.needsUpdate = true;

            _this.material = new THREE.MeshBasicMaterial({
                map : _this.texture
            });

            _this.plane = new THREE.PlaneGeometry(canvas.width, canvas.height);

        });

        // context.strokeStyle = "black";
        // context.strokeRect(0, 0, canvas.width, canvas.height);
        _this.mesh = new THREE.Mesh(_this.plane, _this.material);
        // mesh.overdraw = true;
        _this.mesh.doubleSided = true;


        return tQuery(_this.mesh);

    };

    this.createTool = function() {

        var fonts = {

            '宋体': "SimSun",
            '黑体': 'SimHei',
            '微软雅黑': 'Microsoft YaHei',
            '仿宋': 'FangSong',
            '楷体': 'KaiTi',
            'Arial': "Arial",
            'Sans-serif':  "Sans serif",
            'Cursive ':  "Cursive",
            'Times': 'Times',
            'Fantasy': 'Fantasy'

        };

        var sizes = {

            '小号': 12,
            '中号': 24,
            '大号': 48

        };

        var container = document.createElement( 'div' );
        container.style.position =  'absolute';
        container.style.right =  '0px';
        container.style.bottom =  '0px';
        container.style.fontSize = '12px';
        container.style.backgroundColor = '#fff';
        container.style.opacity =  '0.5';

        document.body.appendChild( container );

        if( _this.showTool ) {

            // value

            var textRow = document.createElement( 'div' );
            var textArea = document.createElement( 'textarea' );
            textArea.id = "text";
            textArea.value =  _this.text;

            textRow.appendChild( textArea );

            container.appendChild( textRow );

            //color

            var colorRow = document.createElement( 'div' );
            var color = document.createElement( 'input' );
            color.id = 'color';
            color.value = _this.color;
            color.style.width = '64px';
            color.style.height = '16px';
            color.style.border = '0px';
            color.style.padding = '0px';
            color.style.backgroundColor = 'transparent';

            try { color.type = 'color'; } catch ( exception ) {}

            colorRow.appendChild( color );
            container.appendChild( colorRow );

            // font

            var fontRow = document.createElement( 'div' );

            var font = document.createElement( 'select' );
            font.id = 'font';
            font.value = fonts[_this.font];
            font.style.width = '64px';
            font.style.height = '16px';
            font.style.border = '0px';
            font.style.padding = '0px';

            for ( var key in fonts ) {

                var option = document.createElement( 'option' );
                option.value = fonts[ key ];
                option.innerHTML =  key;
                font.appendChild( option );

            }

            fontRow.appendChild( font );
            container.appendChild( fontRow );

            // size

            var sizeRow = document.createElement( 'div' );
            var size = document.createElement( 'select' );
            size.id = 'size';
            size.value = sizes[_this.size];
            size.style.width = '64px';
            size.style.height = '16px';
            size.style.border = '0px';
            size.style.padding = '0px';

            for ( var key in sizes ) {

                var option = document.createElement( 'option' );
                option.value = sizes[ key ];
                option.innerHTML = key;
                size.appendChild( option );

            }

            sizeRow.appendChild( size );
            container.appendChild( sizeRow );

        }

    };

    this.addWordEvenListener = function() {

        var valueElement = document.getElementById('text');
        var colorElement = document.getElementById('color');
        var fontElement = document.getElementById('font');
        var sizeElement = document.getElementById('size');


        var textarea = document.getElementById('text');

        if (typeof textarea.selectionStart == "number") {
            textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
        } else if (typeof textarea.createTextRange != "undefined") {
            textarea.focus();
            var range = textarea.createTextRange();
            range.collapse(false);
            range.select();
        }

        // Work around Chrome's little problem
        window.setTimeout(function() {
            if (typeof textarea.selectionStart == "number") {
                textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
            } else if (typeof textarea.createTextRange != "undefined") {
                textarea.focus();
                var range = textarea.createTextRange();
                range.collapse(false);
                range.select();
            }
        }, 1);


        valueElement.addEventListener('keyup', update, false);
        colorElement.addEventListener('change', update, false);
        fontElement.addEventListener('change', update, false);
        sizeElement.addEventListener('change', update, false);

    };


    this.removeWordEvenListener = function() {

        var valueElement = document.getElementById('text');
        var colorElement = document.getElementById('color');
        var fontElement = document.getElementById('font');
        var sizeElement = document.getElementById('size');

        valueElement.removeEventListener('keyup', update);
        colorElement.removeEventListener('keyup', update);
        fontElement.removeEventListener('keyup', update);
        sizeElement.removeEventListener('keyup', update);

    };

};
