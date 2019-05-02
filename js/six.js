function solving6(){
	console.log("Solving 6x6...");
	creategrid();
	let count=document.getElementById('grid').value;
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
	let tblbody = tbl.getElementsByTagName("tbody")[0];
	let input=new Array();
	for(let i=0;i<count;i++){
		input[i]=[];
		for(let j=0;j<count;j++){
			if(tbl.rows[i].cells[j].innerHTML !=="")
				input[i][j]=Number(tbl.rows[i].cells[j].innerHTML);
			else
				input[i][j]=0;
		}
	}
	solveSudoku6(count,input);
}
function putvalue6(r,c,count,input){
	let a = new Array();
	let b = new Array();
	for(let i=0;i<count;i++){
		if(input[r][i] !== 0 && !Array.isArray(input[r][i])){
			console.log(input[r][i]);
            a.push(input[r][i]);
		}
    }
	for(let i=0;i<count;i++){
        if(input[i][c] !== 0 && !Array.isArray(input[i][c]))
            a.push(input[i][c]);
    }
	//console.log(r,c);
    let block_row = Math.floor(r/2)*2;
    let block_col = Math.floor(c/3)*3;
	//console.log(block_row,block_col);
    for(let i=block_row;i<block_row+2;i++){
        for(let j=block_col;j<block_col+3;j++){
			//console.log(i,j,input[i][j]);
			if(input[i][j] !== 0 && !Array.isArray(input[i][j]))
				a.push(input[i][j]);
        }
    }
    a.filter((v,i) => a.indexOf(v) === i).sort();
	for(let i=1;i<=count;i++){
		if(!a.includes(i))
			b.push(i);
	}
	return b;
}
function solveSudoku6(count,input){
	let solved=0;
	let a=new Array();
	let lonerow=[],lonecol=[],transpose=[];
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
    for(let i=0;i<count;i++){
		for(let j=0;j<count;j++){
			if(input[i][j]===0){
				a=putvalue6(i,j,count,input);
				//console.log(i,j,a);
				if(a.length === 1){
					tbl.rows[i].cells[j].innerHTML=a[0];
					input[i][j]=a[0];
					solveSudoku6(count,input);
				}
			}
		}
	}
	//console.log(...input);
	for(let i=0;i<count;i++){
		lonerow=[];
		for(let j=0;j<count;j++){
			if(input[i][j]===0){
				//console.log(i,j);
				a=putvalue6(i,j,count,input);
				//console.log(a);
				input[i][j]=a;
				lonerow=lonerow.concat(input[i][j]);
			}
		}
	//	console.log(lonerow);
		result = { };
		for(var k = 0; k < lonerow.length; ++k) {
			if(!result[lonerow[k]])
				result[lonerow[k]] = 0;
			++result[lonerow[k]];
		}
		//console.log(result);
		if(Object.keys(result).find(key => result[key] === 1)){
			uniqueval=Number(Object.keys(result).find(key => result[key] === 1));
			//console.log(i,uniqueval);
			for(let j=0;j<count;j++){
				if(Array.isArray(input[i][j])){
					if(input[i][j].includes(uniqueval)){
						tbl.rows[i].cells[j].innerHTML=uniqueval;
						input[i][j]=uniqueval;
						solveSudoku6(count,input);
					}
				}
			}
			
		}
	}
	
	
	for(let i=0;i<count;i++){
		lonecol=[];
		for(let j=0;j<count;j++){
			if(Array.isArray(input[j][i])){
				a=putvalue6(j,i,count,input);
				input[j][i]=a;
				lonecol=lonecol.concat(input[j][i]);
			}
		}
		//console.log(lonecol);
		result = { };
		for(var k = 0; k < lonecol.length; ++k) {
			if(!result[lonecol[k]])
				result[lonecol[k]] = 0;
			++result[lonecol[k]];
		}
		//console.log(result);
		if(Object.keys(result).find(key => result[key] === 1)){
			uniqueval=Number(Object.keys(result).find(key => result[key] === 1));
			//console.log(i,uniqueval);
			for(let j=0;j<count;j++){
				if(Array.isArray(input[j][i])){
					if(input[j][i].includes(uniqueval)){
						tbl.rows[j].cells[i].innerHTML=uniqueval;
						input[j][i]=uniqueval;
						//console.log(input1);
						solveSudoku6(count,input);
					}
				}
			}
			
		}
	}
	solved=1;
	if(solved)
		return;
}