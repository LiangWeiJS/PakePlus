const jiaoben = [{
	name: '树怪+日常',
	title: 'shuguai'
}]
//在 str中查找data  并获取其对应的 href值  只能双引号   _index
const chazhao = function(str, data, searchType = 'right') {
	// 如果是post说明是表单提交
	if (data == 'post') {
		let srctype = 'action'
		//第二 查找 data 位置 
		let hrefindex = str.indexOf('action="')
		// console.log(hrefindex);
		//没找到 return
		if (hrefindex == -1) return ''
		//第四 查找href="后边的第一个"
		let ortherindex = str.indexOf('"', hrefindex + 8)
		if (ortherindex == -1) {
			ortherindex = str.indexOf("'", hrefindex + 8)
		}
		return str.substring(hrefindex + 8, ortherindex)
	} else {

		// let srctype='href'
		// //第二 查找 data 位置 如果 left right center
		// if(searchType=='left'){
		// 	data=">"+data
		// }
		// if(searchType=='right'){
		// 	data=data+"</a>"
		// }

		// let dataindex=str.indexOf(data)
		// //
		// //没找到 return
		// if(dataindex==-1)return ''
		// //第三 倒序查找href="位置
		// let hrefindex=str.lastIndexOf(srctype+'="',dataindex)
		// if(hrefindex==-1){
		// 	hrefindex=str.lastIndexOf(srctype+"='",dataindex)
		// }
		// if(str.charAt(hrefindex-2)!='a'){

		// }
		// str.charAt(hrefindex-2)=='a'
		// //第四 查找href="后边的第一个"
		// let ortherindex=str.indexOf('"',hrefindex+6)
		// if(ortherindex==-1){
		// 	ortherindex=str.indexOf("'",hrefindex+6)
		// }
		// let url=str.substring(hrefindex+6,ortherindex)
		// // 点击过快会出现/
		// if(url.charAt(0)=='/'){
		// 	url=url.substring(1)
		// }
		// console.log(url);
		// return url
		if (!str || !data) return ''
		let url = searchHref(str, data)
		return url ? url : ''
	}

}
//查找href
const searchHref = (str, data) => {
	var arr = str.match(/<a\b[^>]+\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)
	if (!arr) {
		arr = str.match(/<a\b[^>]+\bhref='([^']*)'[^>]*>([\s\S]*?)<\/a>/g)
	}
	//大柳虫 第一个  柳虫 第二个
	let arr1=data.split('&')
	data=arr1[0]
	for (var i = 0; i < arr.length; i++) {
		// console.log(arr[i]);
		if (arr[i].indexOf(data) != -1) {
			str = arr[i]
			let url = str.match(/href="([^"]*)"/)
			if (!url) {
				let url = str.match(/href='([^']*)'/)
			}
			return url ? url[1] : ''
			
		}
	}
}
//拿到所有 包含内容的 a标签  和 hef  有 2个 选第一个  allindex=0是不计算 有几个 comMatch是否完全匹配
const searchHaveContent = (str,title,allindex=0,index,comMatch=false) => {
	var arr = str.match(/<a\b[^>]+\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)
	if (!arr) {
		arr = str.match(/<a\b[^>]+\bhref='([^']*)'[^>]*>([\s\S]*?)<\/a>/g)
	}
	let res = []
	if(comMatch)title='>'+title+'<'
	for (var i = 0; i < arr.length; i++) {
		str = arr[i]
		if(str.indexOf(title)!=-1){
			let url = str.match(/href="([^"]*)"/)[1]
			if (!url) {
				let url = str.match(/href='([^']*)'/)[1]
			}
			res.push({
				url
			})
		}
	}
	if(!res.length)return ''
	if(allindex){
		if(res.length==allindex){
			console.log(res,allindex,res[index].url,title,index);
			return res[index].url
		}else{
			return ''
		}
	}else{
		return res[index]?res[index].url:''
	}
	
}
//拿到 所有 a标签 内容 和 hef
const searchContent = (str) => {
	var arr = str.match(/<a\b[^>]+\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)
	if (!arr) {
		arr = str.match(/<a\b[^>]+\bhref='([^']*)'[^>]*>([\s\S]*?)<\/a>/g)
	}
	let res = []
	for (var i = 0; i < arr.length; i++) {
		str = arr[i]
		let url = str.match(/href="([^"]*)"/)[1]
		if (!url) {
			let url = str.match(/href='([^']*)'/)[1]
		}
		let data = getsubstr('>', '<', str)
		res.push({
			data,
			url
		})
	}
	return res
}
// 获取两段文字之间的内容
const getsubstr = (leftstr, rightstr, str) => {
	let leftindex = str.indexOf(leftstr)
	let rightindex = str.indexOf(rightstr, leftindex + leftstr.length)
	if(leftindex==-1||rightindex==-1)return -1
	return str.substring(leftindex + leftstr.length, rightindex)
}
//
const isTimeBetween=(startTime, endTime)=>{
	const now = new Date();
	const start = new Date(now.toDateString() + ' ' + startTime);
	const end = new Date(now.toDateString() + ' ' + endTime);
	return now >= start && now <= end;
}
//获取某段文字后边的第一个a标签并返回 url和data
const wenbenHou = (str,msg) => {
		let leftindex = str.indexOf(msg)
		if(leftindex==-1)return ''
		str=str.substring(leftindex)
		str=str.match(/<a\b[^>]+\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/)
		if(!str.length)return ''
		str=str[0]
		let url = str.match(/href="([^"]*)"/)
		if(!url.length)return ''
		url=url[1]
		let data = getsubstr('>', '<', str)
		return {
			url,data
		}
}
//数组随机打乱
const shuffleArray=(array)=>{
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // 交换位置
  }
  return array
}

const findPath=(matrixName,target)=>{
	console.log(matrixName,target)
	if(['百兽山岭','狂盗山谷','万剑宝塔'].includes(matrixName))matrixName='千年古墓'
	let matrix=uni.getStorageSync('map').filter(item=>item.title==matrixName)[0]
	console.log(matrix) 
	if(!matrix)return[] 
	//拿到起始点坐标
	let startX=0,startY=0;
	for (var i = 0; i < matrix.map.length; i++) {
		for (var j = 0; j < matrix.map[i].length; j++) {
			let str=matrix.map[i][j]
			if((str+'').split("&")[0]==matrix.enter){
				startX=i;
				startY=j;
			}
		}
	}
	matrix=matrix.map
	const rows = matrix.length;
	const cols = matrix[0].length;
	const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
	function isValid(x, y) {
		return x >= 0 && x < rows && y >= 0 && y < cols && matrix[x][y] !== 1 && !visited[x][y];
	}

	function dfs(x, y, path,type) {
		if (x < 0 || x >= rows || y < 0 || y >= cols || matrix[x][y] === 1 || visited[x][y]) {
			return false;
		}

		path.push({x, y,type});
		visited[x][y] = true;
		let arr=matrix[x][y].split('&')
		let directionsTem=[]
		if(arr.includes('上'))directionsTem.push([-1, 0])
		if(arr.includes('下'))directionsTem.push([1, 0])
		if(arr.includes('左'))directionsTem.push([0, -1])
		if(arr.includes('右'))directionsTem.push([0, 1])
		if (arr[0] === target) {
			return true;
		}

		for (const [dx, dy] of directionsTem) {
			let type=''
			if(dx==-1&&dy==0)type='上'
			if(dx==1&&dy==0)type='下'
			if(dx==0&&dy==-1)type='左'
			if(dx==0&&dy==1)type='右'
			const newX = x + dx;
			const newY = y + dy;

			if (isValid(newX, newY)) {
				if (dfs(newX, newY, path,type)) {
					return true;
				}
			}
		}

		path.pop();
		return false;
	}

	const path = [];
	dfs(startX, startY, path);
	return path;
}
//寻路算法结束
//获取简书html内容
const getHtml=(code,callback)=>{
	function decodeUnicode(str) {
	  // 使用正则表达式匹配 Unicode 转义序列
	  return str.replace(/\\u([0-9a-fA-F]{4})/g, function(match, codePoint) {
	    // 将十六进制码点转换为对应的字符
	    return String.fromCharCode(parseInt(codePoint, 16));
	  });
	}
	uni.request({
	  url: 'https://www.jianshu.com/p/'+code,
	  method: 'GET',
	  success: function(res) {  
		  let htmlContent=res.data
		  htmlContent=decodeUnicode(htmlContent)
		  const codeRegex = /<code>(.*?)<\/code>/g; 
		  const matches = htmlContent.match(codeRegex); 
		  if (matches) {
		    matches.forEach(match => {
		      // 移除<code>和</code>标签
		      let codeContent = match.replace('<code>', '');
		      codeContent = codeContent.replace('<\/code>', '');
		      codeContent = codeContent.replace(/\\n/g, '');
			  codeContent=codeContent.replace(/\\/g, '');
			  // console.log('codeContent', codeContent);
			  callback(JSON.parse(JSON.parse(JSON.stringify(codeContent)))) 
		    });
		  }else{
			  console.log("No <code> tags found.");
		  }
	  }
	});
}
export {
	getHtml,
	shuffleArray,
	wenbenHou,
	jiaoben,
	chazhao,
	getsubstr,
	searchContent,
	isTimeBetween,
	searchHaveContent,
	findPath
}
