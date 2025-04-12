<template>
	<view class="content">
		<web-view :src="address" :webview-styles="webviewStyles" @message="postMessage"></web-view>
	</view>
</template>  

<script>
	// var keepAlive = uni.requireNativePlugin('Ba-KeepAlive') 
	var wv;
	import {
		jiaoben,
		chazhao,
		getsubstr,
		searchContent
	} from '@/static/utils.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				webviewStyles:{
					top:80,
					bottom:0,
					progress: {
						color: '#ccc'
					}
				},
				content:'',//网页内容
				realmName:'',//域名
				cishu:1,//已执行次数
				tempjb:[],//临时脚本 
				fanhuigame:false,//返回游戏后判断补充粮草 比较low 先这样以后再说 
				xunhuan:1,//循环指令已循环次数 默认1
				shiquwupin:[],//拾取物品清单
				gongjiType:'普通攻击',
				maiyao:{diyu:100,mai:200,name:"万年灵芝"}, //买药设置
				qiangxian:'',
				tulong:'',
				wujiangarr:[],//近身武将
				wujiangarrIndex:-1,//已修理武将索引
				bianliang:{
					wjname:''
				},
				shuguai:{
					景阳左追风:{
						interval:90*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					黄泥左驾风:{
						interval:90*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					人字老大:{
						interval:90*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					和字老大:{
						interval:90*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					景阳右摘星:{
						interval:120*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					黄泥右观景:{
						interval:120*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					柴家上飞贼:{
						interval:120*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					地字老大:{
						interval:120*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					柴家下飞贼:{
						interval:85*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					天字老大:{
						interval:135*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					鱼鹰:{
						interval:60*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					巨兽:{
						interval:80*60*1000,//间隔时间
						lastTime:0//上次时间
					},
					蛇胆:{
						interval:20*60*1000,//间隔时间
						lastTime:0//上次时间
					},
				}//树怪时间
			}
		}, 
		onLoad() {    
			// console.log(this.address);
			uni.hideTabBar()
			var that=this
			var currentWebview = this.$scope.$getAppWebview() //此对象相当于html5plus里的plus.webview.currentWebview()。在uni-app里vue页面直接使用plus.webview.currentWebview()无效
			setTimeout(function() {
				wv = currentWebview.children()[2]
				wv.appendJsFile('static/uni.js')
				wv.appendJsFile('static/base.js')
			}, 900); //如果是页面初始化调用时，需要延时一下  
			
			uni.getSubNVueById('right').hide()
			setTimeout(e=>{
				uni.getSubNVueById('header').show();   
			},1000)
			uni.$on('jiaoben-status', (data) => {
				that.eventfn(data)
			})
			uni.$on('shuqian-change', (data) => {
				console.log(data);
				wv.loadURL(data)
				// that.eventfn(data)
			})
		}, 
		computed: {
			 ...mapState([
				'status','runStatus','jblist','jblistIndex','timer','xhcs','jbinit','address','luzhiStatus','myurl','jiaobenconfig','bclc','alljblist','alljblistindex'
			])
		},  
		methods: {
			
			//事件监听 
			eventfn(data){
				var that=this
				// console.log(data);
				if(data.name=='going'&&this.alljblist.length){
					this.xunhuan=1
					const jiaobenlist=this.alljblist[this.alljblistindex]
					if(jiaobenlist.name=='买药'){
						this.maiyao.diyu=jiaobenlist.xhcs
						this.maiyao.mai=jiaobenlist.bclc
						this.maiyao.name=jiaobenlist.gongjiType
						jiaobenlist.bclc=0
						jiaobenlist.xhcs=1
						// jiaobenlist.gongjiType='普通攻击'
					}
					//树怪脚本
					if(Object.hasOwnProperty.call(that.shuguai,jiaobenlist.name)){
						let obj=that.shuguai[jiaobenlist.name]
						//存在
						if(Date.now()-obj.lastTime<obj.interval){
							//不执行
							that.panduancishu()
							return
						}
						that.shuguai[jiaobenlist.name].lastTime=Date.now()
					}
					if(jiaobenlist.name=='屠龙'){
						let h=new Date().getHours()
						let d=new Date().getDate()						
						let m=new Date().getMinutes()
						let isTrue=false
						if(h==12&&this.tulong!=d+12&&m<29){
							this.tulong=d+12
							isTrue=true
						}else{
							//不执行
							that.panduancishu()
							return
						}
						if(!isTrue){
							if(h==20&&this.tulong!=d+20&&m<29){
								this.tulong=d+20
							}else{
								//不执行
								that.panduancishu()
								return
							}
						}
						
					}
					if(jiaobenlist.name=='抢仙'){
						let h=new Date().getHours()
						let d=new Date().getDate()
						let m=new Date().getMinutes()
						console.log(h,m);
						if(h>=18&&m>50&&this.qiangxian!=d&&h<20){
							this.qiangxian=d
						}else{
							//不执行
							that.panduancishu()
							return
						}
					}
					// console.log(this.maiyao);
					this.$store.commit('setbclc', jiaobenlist.bclc);
					this.$store.commit('setxhcs', jiaobenlist.xhcs);
					this.gongjiType=jiaobenlist.gongjiType??'普通攻击'
					this.requestjiaoben(jiaobenlist.name,jiaobenlist.type)
				}else{
					this.init() 
				}
				
			},
			//读取脚本
			requestjiaoben(src,type){
				var that=this
				// 内置脚本
				if(type==1){
					uni.request({
						url:'http://diwang.nestjs.vip/jiaoben/'+src+'.json',
						success(data) {
							let jiaoben=data.data
							that.$store.commit('setJblist', jiaoben);
							that.init()  
							
						}
					})
					return
				}
				//本地脚本
				if(type==2){
					plus.io.requestFileSystem(plus.io.PRIVATE_DOC, function(fs) {
						// fs.root是根目录操作对象DirectoryEntry
						let a = fs.root.toURL()
						
						fs.root.getFile(a + '/uniapp_save/'+src+'.json', {
							create: false
						}, function(fileEntry) {
							fileEntry.file(function(file) {
								var fileReader = new plus.io.FileReader();
								fileReader.readAsText(file, 'utf-8');
								fileReader.onloadend = function(evt) {
									var result = evt.target.result;
									that.$store.commit('setJblist', JSON.parse(result));
									that.init()
								}
							});
						});
					})
					return
				}
			},
			sendrequest(url,callback,method='GET',data={}){
				var that=this 
				if(url.indexOf('version=')!=-1){
					console.log(that.content);
				}
				uni.request({
					url: url,
					header:{
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
						'Accept-Encoding': 'gzip, deflate',
						'Content-Type': 'application/x-www-form-urlencoded',
						// 'User-Agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
					},
					method:method,
					data:data,
					success: function(res) {
						// console.log(res);
						that.$store.commit('setmyurl', url);
						that.content = res.data;
						
						wv.loadData(that.content.replace(/a/g, 'hh')) 
						setTimeout(()=>{
							callback()
						},that.timer)
						
					},
					fail(res) {
						console.log(res);
						uni.showToast({
							title: '请求失败，重连中。。。 '
						})
						setTimeout(() => {
							that.http()
						}, 10000)
					}
				})
				
			},
			init() {
				let str=this.alljblist.length?this.alljblist[this.alljblistindex].name:'开始执行'
				uni.showToast({
					title:str
				}) 
				if(this.alljblistindex==0){
					this.$store.commit('setmyurl', wv.getURL());
				}
				this.realmName = this.myurl.slice(0,this.myurl.indexOf('/',10)+1)
				// this.tempjb=['武将','供给粮草','返回游戏'];
				this.sendrequest(this.myurl,this.http) 
			},// 判断点击过快 和继续
			clickFast(){
				var that=this
				if (this.content.indexOf('>继续</a>') != -1&&this.content.indexOf('刷新') == -1) {
					console.log('点击过快'); 
					
					setTimeout(()=>{
						that.singleCommand('继续')
					},2000)  
					return 1
				}
				return 0
			},
			//执行结束 首位
			runStop(){ 
				this.$store.commit('setJblistIndex', 0);
				this.$store.commit('setalljblistindex', 0);
				this.cishu=1 
				this.xunhuan=1
				this.$store.commit('setStatus', 'stop');
				wv.loadURL(this.url)
				// this.$store.commit('setaddress', this.myurl);
				this.$store.commit('setmyurl', this.url);
				uni.showToast({
					title:'执行完毕'
				})
			},
			panduancishu(){
				var that=this
				if(that.alljblistindex>=that.alljblist.length-1){
					that.runStop()
				}else{
					let a=that.alljblistindex
					that.$store.commit('setalljblistindex', a+1);
					that.$store.commit('setJblistIndex', 0);
					that.eventfn({name:'going'})
				}
			},
			//执行脚本
			http() {
				const that = this
				if(!that.tempjb.length&&that.bclc==1&&that.jblistIndex>0&&that.jblist[that.jblistIndex-1].title=='返回游戏'&&that.fanhuigame){
					that.fanhuigame=false
					that.tempjb=['武将','供给粮草','返回游戏']; 
				}	
				//补充粮草逻辑
				if(that.tempjb.length){
					that.singleCommand(that.tempjb.shift())
					return
				}
				// console.log(that.jblistIndex); 
				//判断执行到最后-》判断次数-》判断总脚本执行完毕
				if(that.jblistIndex >= that.jblist.length){
					if(that.cishu>=that.xhcs){
						that.cishu=1
						if(that.alljblistindex>=that.alljblist.length-1){
							that.runStop()
						}else{
							let a=that.alljblistindex
							that.$store.commit('setalljblistindex', a+1);
							that.$store.commit('setJblistIndex', 0);
							that.eventfn({name:'going'})
						}
						return
					}else{
						that.$store.commit('setJblistIndex', 0);
						that.cishu++
					}
				}
				//停止
				if (that.status == 'stop') {
					that.runStop()
					return
				}
				//暂停
				if (that.status == 'going'&&that.runStatus == 'suspend') {
					// this.$store.commit('setaddress', this.myurl);
					wv.loadURL(this.url)
					this.$store.commit('setmyurl', this.url);
					uni.showToast({
						title:'暂停执行'
					})
					return
				}
				
				let data = that.jblist[that.jblistIndex].title
				//判断脚本类型
				let type = that.jblist[that.jblistIndex].type
				//如果title 不存在  脚本 index+1 
				if(!data){
					that.$store.commit('setJblistIndex', that.jblistIndex+1);
					that.http()
					return
				}
				// 点击过快判断
				if(that.clickFast()){
					return
				}
				//判断拾取物品 只存在第一行
				if(that.jblistIndex==0&&type==='shiquwupin'){
					that.shiquwupin=data.split('|')
					that.shiquwupin.concat(['御林剑客训练术','禁军侍卫训练术','神奇丹药','神奇丹药','天书油墨','高级锻造石','高级坐骑饲料'])
					that.$store.commit('setJblistIndex', that.jblistIndex+1);
					that.http()
					return
				}
				//判断近身武将
				if(type=="panduanwujiang"){
					let str=getsubstr('近身军队:','<br/>',that.content)
					that.wujiangarr=searchContent(str)
					console.log(that.wujiangarr);
					that.$store.commit('setJblistIndex', that.jblistIndex+1);
					that.http()
					return
				}
				//开始修理
				if(type=='xiulikaishi'){
					that.wujiangarrIndex++
					if(that.wujiangarrIndex<that.wujiangarr.length){
						let name=that.wujiangarr[that.wujiangarrIndex].data
						let name1=name.substring(0,name.indexOf('部'))
						that.bianliang.wjname=name1
						that.tempjb=[name,name1]
						that.$store.commit('setJblistIndex', that.jblistIndex+1);
					}else{
						that.$store.commit('setJblistIndex', that.jblist.length-1);
						that.wujiangarrIndex=-1
					}
					that.http()
					return
				}
				//他是一个变量
				if(type=='bianliang'){
					data=that.bianliang[data]?that.bianliang[data]:that.gongjiType
				}
				//循环次数指令
				if(type=='xunhuan'){
					let name = that.jblist[that.jblistIndex].name
					console.log('循环指令',data,name,this.xunhuan);
					if(this.xunhuan<name){
						//继续循环
						this.xunhuan++
						that.singleCommand(data)
						return
					}
					this.xunhuan=1
				}
				// 逻辑判断 前进和后退 
				if(type=='ljpd'){
					let name = that.jblist[that.jblistIndex].name
					//存在 就后退 否则执行下一步
					if(this.content.indexOf(data) != -1){
						that.$store.commit('setJblistIndex', name.cunzai*1);
						that.http()
					}else{						   
						// console.log('没找到',name);
						that.$store.commit('setJblistIndex', name.bucunzai*1);
						that.http()
					}
					return
					
				}
				//暂停 
				if(type=='stop'){
					//1表示暂停
					if(this.bclc){
						wv.loadURL(this.url)
						this.$store.commit('setRunStatus', 'suspend');
						this.$store.commit('setmyurl', this.url);
					}else{
						that.$store.commit('setJblistIndex', that.jblistIndex+1);
						that.http()
					}
					
					return
				}
				//逻辑判断-答题
				if(type=='luojipanduan'){
					console.log('逻辑判断答题',data);
					let name = that.jblist[that.jblistIndex].name
					//问题和结果都有
					if(this.content.indexOf(name) != -1&&this.content.indexOf(data) != -1){
						var resData=chazhao(that.content,data)
						if(resData){
							that.url = that.realmName + resData.replace(/amp;/g, '');
							that.sendrequest(that.url,()=>{
								that.$store.commit('setJblistIndex', 0);
								that.cishu++
								that.http()
							}) 
							return
						}
						// console.log(name);
						//找到了从头执行
					}
					that.$store.commit('setJblistIndex', that.jblistIndex+1);
					that.http()
					return
				}
				//买药判断
				if(type=="maiyao"){
					// 不存在 去买 存在 低于设置数值也去买
					if(that.content.indexOf(that.maiyao.name)!=-1){
						let num=getsubstr(that.maiyao.name+'x','</a>',that.content)
						console.log(num);
						if(num*1>that.maiyao.diyu){
							//不买药
							that.$store.commit('setJblistIndex', that.jblistIndex+11);
							that.http()
							return
						}
					}
					let newjiaobenlist=JSON.parse(JSON.stringify(that.jblist))
					newjiaobenlist[12].name.count=that.maiyao.mai
					newjiaobenlist[11].title=that.maiyao.name
					// console.log(newjiaobenlist); 
					that.$store.commit('setJblist',newjiaobenlist);
					that.$store.commit('setJblistIndex', that.jblistIndex+1);
					that.http()
					return
				}
				//逻辑判断-后退
				if(type=='ljhoutui'){
					console.log('逻辑判断后退',data);
					let name = that.jblist[that.jblistIndex].name
					//存在 就后退 否则执行下一步
					if(this.content.indexOf(data) != -1){
						that.$store.commit('setJblistIndex', that.jblistIndex-name);
						that.http()
					}else{						   
						// console.log('没找到',name);
						that.$store.commit('setJblistIndex', that.jblistIndex+1);
						that.http()
					}
					return
				}
				//逻辑判断-前进
				if(type=='ljqianjin'){
					console.log('逻辑判断前进',data);
					let name = that.jblist[that.jblistIndex].name
					//不存在 就后退 否则执行下一步
					if(this.content.indexOf(data) == -1){
						that.$store.commit('setJblistIndex', that.jblistIndex-name);
						that.http()
					}else{						   
						// console.log('没找到',name);
						that.$store.commit('setJblistIndex', that.jblistIndex+1);
						that.http()
					}
					return
				}
				//补充粮草只执行一次 临时解决办法   如果返回游戏 判断战场是否已结束 执行普通攻击
				if(data=='返回游戏'){
					that.fanhuigame=true
					//循环攻击执行
					if (this.content.indexOf('>允许他人加入战场</a>') != -1&&this.content.indexOf('>查看详情</a>') != -1&&this.content.indexOf('游戏首页') == -1) {
						console.log('循环指令',this.gongjiType);
						if(this.content.indexOf(this.gongjiType) == -1){
							uni.showModal({
								title:'提示',
								content:`攻击指令:${that.gongjiType}不存在,脚本暂停`,
								showCancel:false
							})
							wv.loadURL(this.url)
							this.$store.commit('setRunStatus', 'suspend');
							this.$store.commit('setmyurl', this.url);
						}else{
							that.singleCommand(this.gongjiType) 
						}
						return
					}
					// 拾取物品
					if(that.shiquwupin.length&&this.content.indexOf('查看详情') != -1&&that.content.indexOf('游戏首页') == -1&&that.content.indexOf('你的负载过重') == -1){
						for (var i = 0; i < that.shiquwupin.length; i++) {
							if(that.content.indexOf(that.shiquwupin[i]) != -1){
								//存在
								let resData=chazhao(that.content,that.shiquwupin[i])
								if(resData){
									that.url = that.realmName + resData.replace(/amp;/g, '');
									this.sendrequest(that.url,()=>{
										that.http()
									})
									return
								}
							}
							
						}
					}
				}
				var resData=''
				if(type=='post'){
					resData = chazhao(that.content,'post')
				}else{
					resData = chazhao(that.content,data)
				}
				if (!resData||resData.length < 20) {
					console.log('未找到',resData,data,that.jblist[that.jblistIndex]);
					that.$store.commit('setJblistIndex', that.jblistIndex+1);
					that.http()
					return
				}  
				  
				
				if(resData.indexOf('http')!=-1){
					that.realmName = resData.slice(0,resData.indexOf('/',10)+1)
					console.log(that.realmName);
					that.url=resData.replace(/amp;/g, '')
				}else{
					that.url = that.realmName + resData.replace(/amp;/g, '');
				}
				console.log(that.realmName,that.url,that.jblist[that.jblistIndex]);
				if(type=='post'){
					let name = that.jblist[that.jblistIndex].name
					if(this.content.indexOf('请输入') != -1&&this.content.indexOf('返回游戏') != -1&&this.content.indexOf('提交') != -1){
						if(this.content.indexOf('的结果') != -1){
							//计算
							let leftindex=this.content.indexOf('请输入:')
							let rightindex=this.content.indexOf('的结果')
							let res=this.content.substring(leftindex+4,rightindex)
							let arr=res.split('+')
							let count=0
							arr.forEach(e=>{
								count+=e*1
							})
							name.guaji_name=count+''
							console.log(leftindex,rightindex,name,arr);
						}else{
							let leftindex=this.content.indexOf('请输入文字:')
							let rightindex=this.content.indexOf('<br/>')
							let res=this.content.substring(leftindex+6,rightindex)
							name.guaji_name=res
							console.log(leftindex,rightindex,name);
						}
					}
					this.sendrequest(that.url,()=>{
						that.$store.commit('setJblistIndex', that.jblistIndex+1);
						that.http()
					},'POST',name) 
					
				}else{
					this.sendrequest(that.url,()=>{
						that.$store.commit('setJblistIndex', that.jblistIndex+1);
						that.http()
					})
				}
				
			},
			postMessage(event){
				if(this.luzhiStatus){
					let title=event.detail.data[0].title
					uni.showToast({
						title:title,
						duration:200
					})
					this.jblist.push({
						title:title
					})
					this.$store.commit('setJblist', this.jblist);
				}
				console.log(event.detail.data[0].href);
				this.$store.commit('setmyurl', event.detail.data[0].href);
				// this.$store.commit('setaddress', event.detail.data[0].href); 
			},
			singleCommand(data,searchType='right'){
				const that = this
				// console.log(data); 
				const resData = chazhao(that.content,data,searchType)
				if (resData.length < 2) {
					console.log('未找到++' + data,that.content); 
					that.http()
					return   
				}
				if(data=='供给粮草'&&this.content.indexOf('我的军队')!= -1){
					that.tempjb.unshift('供给粮草')
				}
				if(resData.indexOf('http')!=-1){
					that.realmName = resData.slice(0,resData.indexOf('/',10)+1)
					that.url=resData.replace(/amp;/g, '');
				}else{
					that.url = that.realmName + resData.replace(/amp;/g, '');
				}
				this.sendrequest(this.url,()=>{
					that.http()
				})
			},
			open() {
			  // console.log('open');
			},
			close() {
			  this.show = false
			  // console.log('close');  
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	
</style>