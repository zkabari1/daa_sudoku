function solving4(){
	creategrid();
	let count=document.getElementById('grid').value;
	let counter=0;
	console.log("solving 4x4");
	let result=[],rowi=[],colj=[],square=[],sol=[];
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
	let tblbody = tbl.getElementsByTagName("tbody")[0];
	for(let i=0;i<count;i++){
	row = tblbody.getElementsByTagName("tr")[i];
		result[i]=[];
		for(let j=0;j<count;j++){
			col = row.getElementsByTagName("td")[j];
			cellvalue=col.childNodes[0];
			if(cellvalue!==undefined){
				result[i][j]=cellvalue.data;
			}
		}
	}
	sol=result;
	for(let i=0;i<count;i++){
		for(let j=0;j<count;j++){
			if(sol[i][j] !== ''){
				counter++;
			}
		}
	}
	console.log(counter);
		while(counter<16){
			for(let i=0;i<count;i++){
				for(let j=0;j<count;j++){
					if(result[i][j] === ''){
						for(let k=0;k<count;k++){
							rowi[k]=result[i][k];
						}
						for(let k=0;k<count;k++){
							colj[k]=result[k][j];
						}
						if((i === 0 || i === 1) && (j === 0 || j === 1)) {
							for(let l=0,k=0;l<count/2;l++,k++){
								for(let m=0;m<count/2;m++,k++){
									square[k]=result[l][m];
								}
							}
						}
						else if((i === 0 || i === 1) && (j === 2 || j === 3)){
							for(let l=0,k=0;l<count/2;l++,k++){
								for(let m=2;m<count;m++,k++){
									square[k]=result[l][m];
								}
							}
						}
						else if((i === 2 || i === 3) && (j === 0 || j === 1)){
							for(let l=2,k=0;l<count;l++,k++){
								for(let m=0;m<count/2;m++,k++){
									square[k]=result[l][m];
								}
							}
						}
						else if((i === 2 || i === 3) && (j === 2 || j === 3)){
							for(let l=2,k=0;l<count;l++,k++){
								for(let m=2;m<count;m++,k++){
									square[k]=result[l][m];
								}
							}
						}
						function notincluded(value){
							return (!rowi.includes(value) && !colj.includes(value) && !square.includes(value));
						}
						tbl.rows[i].cells[j].setAttribute("data-sol","1");
						tbl.rows[i].cells[j].innerHTML=Array.from('1234').filter(notincluded);
						if(Array.from('1234').filter(notincluded).length === 1){
							sol[i][j]=Array.from('1234').filter(notincluded)[0];
							result[i][j]=Array.from('1234').filter(notincluded)[0];
							counter++;
							console.log(result[i][j]);
							console.log(counter);
						}
					}
				}
			}
		}
}
