/*
 var swfVersionStr = "11.1.0";
 var xiSwfUrlStr = '';
 var flashvars = {};
 var params = {
 quality:'high',
 bgcolor:'#ffffff',
 allowscriptaccess:'sameDomain',
 allowfullscreen:'false'
 };
 var attributes = {
 id:'Main',
 name:'Main'
 };
 swfobject.embedSWF("Main.swf", _containerId, _width, _height, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
 */
/*
 _paramObj:
 name:String //just a name
 baseDir:String //a dir to set flash player

 type:pre:'flash||html5',post:'audio'||'video' //type:{flash:{audio,video},html5:{audio,video}};
 controls:boolean //
 */
(function(){
	
    var UA = {};
    var ua = navigator.userAgent.toLowerCase(),s;
    
    UA.android  = (s = ua.match(/android/))?!!s:false;
    UA.iphone   = (s = ua.match(/iphone os/))?!!s:false;
    UA.ipad     = (s = ua.match(/ipad/))?!!s:false;
    UA.ios      = UA.ipad || UA.iphone;
    UA.isWeixin = (s=ua.match(/MicroMessenger/i))?!!s:false;  //判断是否是在微信浏览器里面
    
    UA.mobile   = UA.android || UA.ios || UA.isWenxin;
    
    document.write(navigator.userAgent);
    
    window.UA=UA;
})();
( function() {

		this.Zplayer = function(_paramObj) {

			this.typesArr = {
				    a:'audio',
				audio:'audio',
				    v:'video',
				video:'video'
			};
			this.obj = null;

			return this;
		};
		Zplayer.prototype.setEvents = function(_callbacks){

			var eventsArr;

			if(typeof _callbacks != 'object'){
				throw new Error('callbacks is not a Object');
				return;
			};
			
			eventsArr = new Array();
			
			if(this.type[0] == 'H'){
				
				eventsArr = ['canplay','timeupdate','pause','ended','error'];
				
				for(var i=0;i<eventsArr.length;i++){
					(function(){
						var evt = eventsArr[i];
						this.obj.addEventListener(evt,function(_e){
							_callbacks[evt] && _callbacks[evt].call(this,_e);
						});
					}.call(this));
				}
			}
			if(this.type[0] == 'F'){
				
				eventsArr = ['playerStart','playerProcess','playerEnd'];

				for(var i=0;i<eventsArr.length;i++){
					(function(){
						var evt = eventsArr[i];
						this[evt] = function(){
							_callbacks[evt] && _callbacks[evt].apply(this,arguments);
						};
					}.call(this));
				}
			}
		};
		Zplayer.prototype.createHaudio = function() {

			document.write('ha');

			var mediaId = this.name + '_audio';
			var aObj = document.createElement('audio');
			aObj.setAttribute('id',mediaId);

			this.obj.parentNode.replaceChild(aObj,this.obj);
			this.obj = document.getElementById(mediaId);

			for(var k in this.css){
				aObj.style[k] = this.css[k];
			}
			
			return this;
		};
		Zplayer.prototype.createHvideo = function() {
			document.write('hv');
			
			var mediaId = this.name + '_video';
			var vObj = document.createElement('video');
			vObj.setAttribute('id',mediaId);

			this.obj.parentNode.replaceChild(vObj,this.obj);
			this.obj = document.getElementById(mediaId);
			
			for(var k in this.css){
				vObj.style[k] = this.css[k];
			}
			
			this.obj.parentNode.replaceChild(vObj,this.obj);

			return this;
		};
		Zplayer.prototype.createFaudio = function() {
			document.write('fa');
			
 			var swfVersionStr = "11.1.0";
 			var xiSwfUrlStr = '';
 			var flashvars = {};
 			var params = {
 				quality:'high',
 				bgcolor:'#ffffff',
 				allowscriptaccess:'sameDomain',
 				allowfullscreen:'false'
 			};
			var attributes = {
				id:this.obj.id,
				name:this.obj.id
 			};
		    swfobject.embedSWF(this.baseDir+"Main.swf", this.obj.id, this.css.width, this.css.height, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);

			return this;
		};
		Zplayer.prototype.createFvideo = function() {

			document.write('hv');
			var o = this;

 			var swfVersionStr = "11.1.0";
 			var xiSwfUrlStr = '';
 			var flashvars = {};
 			var params = {
 				quality:'high',
 				bgcolor:'#ffffff',
 				allowscriptaccess:'sameDomain',
 				allowfullscreen:'false'
 			};
			var attributes = {
				id:this.obj.id,
				name:this.obj.id
 			};
		    swfobject.embedSWF("Main.swf", this.obj.id, this.css.width, this.css.height, swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);

			return this;
		};
		Zplayer.prototype.pause = function(){
			this.obj.pause();
		};
		Zplayer.prototype.play = function(_url){
			this.obj.play();
		};
		Zplayer.prototype.setUrl = function(_url,_isautoPlay,_controls){

			var o = this;
			
			if(o.type[0] == 'H'){
				
				o.obj.src = _url;
				o.obj.load();
				
				if(_controls){
					o.obj.setAttribute('controls','true');
				}
				if(_isautoPlay){
					o.obj.play();
				}
				return o;
			}
			if(o.type[0] == 'F'){

				if(o.obj.nodeName == 'OBJECT'){
					o.obj.setUrl(_url);
				}else{
					setTimeout(function(){
						o.obj = document.getElementById(o.obj.id);
					},0);
					if(_isautoPlay || _isautoPlay==undefined){
						var si = setInterval(function(){
							if(o.obj.setUrl){
								clearInterval(si);
								o.obj.setNamespace(o.name+'.');
								o.obj.setUrl(_url,o.type.substring(1,o.type.length),true);
							}
						},100);
					}else{
						var si = setInterval(function(){
							if(o.obj.setUrl){
								clearInterval(si);
								o.obj.setNamespace(o.name+'.');
								o.obj.setUrl(_url,o.type.substring(1,o.type.length),false);
							}
						},100);
					}
				}
			}
		};
//		Zplayer.prototype.init = function(_containerId,_type, _css) {
		Zplayer.prototype.init = function(_arg) {
			
			this.name = _arg.name || (function(){
				throw new Error('name of property is null');
			}());
			this.baseDir = _arg.baseDir || '';


			this.obj = document.getElementById(_arg.id) || (function() {
				throw new Error('can not find the document object according to the Id');
			})();

			this.css = (typeof _arg.css == 'object')?_arg.css:null;

			this.type = this.typesArr[_arg.type] || 'audio';
			
			if(UA.mobile){
				this.type = 'H' + this.type;
			}else{
				this.type = 'F' + this.type;
			}

			this['create'+this.type].call(this).setEvents.call(this,_arg.callbacks);

			return this;
		};
		
	}.call(window));
