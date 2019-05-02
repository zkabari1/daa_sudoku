function solving16(){
	console.log("Solving 16x16...");
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
	solveSudoku(count,input);
	//console.log(input);
}

function putvalue(r,c,count,input){
	let a = new Array();
	let b = new Array();
	let rt=Math.sqrt(count);
    for(let i=0;i<count;i++){
        if(input[r][i] !== 0 && !Array.isArray(input[r][i])){
			//console.log(input[r][i]);
            a.push(input[r][i]);
		}
    }
	for(let i=0;i<count;i++){
        if(input[i][c] !== 0 && !Array.isArray(input[i][c]))
            a.push(input[i][c]);
    }
    let block_row = (Math.floor(r/rt))*rt;
    let block_col = (Math.floor(c/rt))*rt;
    for(let i=block_row;i<block_row+rt;i++){
        for(let j=block_col;j<block_col+rt;j++){
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
function solveSudoku(count,input){
	//console.log("called");
	let solved=1;
	let a=new Array();
	let lonerow=[],lonecol=[];
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
    for(let i=0;i<count;i++){
		for(let j=0;j<count;j++){
			if(input[i][j]===0 || Array.isArray(input[i][j])){
				a=putvalue(i,j,count,input);
				if(a.length === 1){
					//console.log(i,j,a);
				
					tbl.rows[i].cells[j].innerHTML=a[0];
					input[i][j]=a[0];
					//setTimeout(solveSudoku,100,count,input);
					solveSudoku(count,input);
				}
			}
		}
	}
	
	//console.log("col");
	for(let i=0;i<count;i++){
		lonecol=[];
		for(let j=0;j<count;j++){
			if(input[j][i]===0 || Array.isArray(input[j][i])){
				a=putvalue(j,i,count,input);
				input[j][i]=a;
				lonecol=lonecol.concat(input[j][i]);
			//	console.log(lonecol);
			}
		}
		//console.log(lonecol);
		if(lonecol.length!==0){
			result = { };
			for(let k = 0; k < lonecol.length; ++k) {
				if(!result[lonecol[k]])
					result[lonecol[k]] = 0;
				++result[lonecol[k]];
			}
			//console.log(i,result);
			if(Object.keys(result).find(key => result[key] === 1)){
				uniqueval=Number(Object.keys(result).find(key => result[key] === 1));
				//console.log(i,uniqueval);
				for(let j=0;j<count;j++){
					if(Array.isArray(input[j][i])){
						if(input[j][i].includes(uniqueval)){
							tbl.rows[j].cells[i].innerHTML=uniqueval;
							input[j][i]=uniqueval;
							//console.log("uni=",uniqueval);
							//setTimeout(solveSudoku,100,count,input);
							solveSudoku(count,input);
						}
					}
				}
			}
		}
	}
	
	//console.log("row");

	for(let i=0;i<count;i++){
		lonerow=[];
		for(let j=0;j<count;j++){
			if(input[i][j]===0 || Array.isArray(input[i][j])){
				a=putvalue(i,j,count,input);
				input[i][j]=a;
				lonerow=lonerow.concat(input[i][j]);
			}
		}
		//console.log(lonerow);
		if(lonerow.length!==0){
		result = { };
		for(let k = 0; k < lonerow.length; ++k) {
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
						//setTimeout(solveSudoku,100,count,input);
						solveSudoku(count,input);
					}
				}
			}
			
		}
		}
	}
	
	for(let k=0;k<count;k+=4){
		for(let l=0;l<count;l+=4){
			lonecol=[];
			for(let i=k;i<k+4;i++){
				for(let j=l;j<l+4;j++){
					if(input[i][j]===0 || Array.isArray(input[i][j])){
						a=putvalue(i,j,count,input);
						input[i][j]=a;
						lonecol=lonecol.concat(input[i][j]);
						//console.log(i,j,lonecol);
					}
				}
			}
		if(lonecol.length!==0){	
			result = { };
			for(let k = 0; k < lonecol.length; ++k) {
				if(!result[lonecol[k]])
					result[lonecol[k]] = 0;
				++result[lonecol[k]];
			}
			//console.log(k,l,result);
			if(Object.keys(result).find(key => result[key] === 1)){
				uniqueval=Number(Object.keys(result).find(key => result[key] === 1));
				//console.log(i,uniqueval);
				if(Array.isArray(input[k][l])){
					if(input[k][l].includes(uniqueval)){
						tbl.rows[k].cells[l].innerHTML=uniqueval;
						input[k][l]=uniqueval;
						//console.log(input1);
						//setTimeout(solveSudoku,100,count,input);
						solveSudoku(count,input);
					}
				}
			}
			
		}
		}
		
	}
	//console.log("D",!solved);
	/*for(let i=0;i<count;i++){
		for(let j=0;j<count;j++){
			if(input[i][j]===0 || Array.isArray(input[i][j])){
				//console.log(i,j);
				solved=0;
				break;
			}
		}
	}
	//console.log("D",!solved);
	if(!solved)
		solveSudoku(count,input);
	else
		return;
	//console.log(solved);*/
}