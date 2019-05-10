var cnstrt = new Array(81);
for(var x = 0; x < 81; x++)	
	cnstrt[x] = new Array(10);
var defineblock = new Array(9);
defineblock[0] = [0,1,2,9,10,11,18,19,20];
defineblock[1] = [3,4,5,12,13,14,21,22,23];
defineblock[2] = [6,7,8,15,16,17,24,25,26];
defineblock[3] = [27,28,29,36,37,38,45,46,47];
defineblock[4] = [30,31,32,39,40,41,48,49,50];
defineblock[5] = [33,34,35,42,43,44,51,52,53];
defineblock[6] = [54,55,56,63,64,65,72,73,74];
defineblock[7] = [57,58,59,66,67,68,75,76,77];
defineblock[8] = [60,61,62,69,70,71,78,79,80];
var constraintorder = new Array(81);
var ptr = new Array(81);
var no_of_iter = 4000;
var sleeptime = 500;
var tcount = 0;

function solving9(){
	console.log("Solving 9x9...");
	creategrid();
	let count=document.getElementById('grid').value;
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
	let tblbody = tbl.getElementsByTagName("tbody")[0];
	let input=new Array(81);
	for(let i=0,k=0;i<count;i++){
	row = tblbody.getElementsByTagName("tr")[i];
		for(let j=0;j<count;j++,k++){
			col = row.getElementsByTagName("td")[j];
			cellvalue=col.childNodes[0];
			if(cellvalue!==undefined){
				input[k]=cellvalue.data;
			}
		}
	}
	var x;
	do {
		x = fillemptycells(input);
	} while(x > 0);
	backtrack();
}

function fillemptycells(pos)	{
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
	var solved = 0;
	var sum = 0;
	var num = 0;

	for(var p = 0; p < 81; p++)	{
		for(var x = 0; x < 10; x++)
			cnstrt[p][x] = 0;
			
		if(pos[p] >= 1 && pos[p] <= 9)	{
		  	cnstrt[p][0] = 1;
			cnstrt[p][pos[p]] = 1;
		}
		else	{
			var r = Math.floor(p / 9);
			var c = p % 9;
			for(var x = 1; x <= 9; x++)
				cnstrt[p][x] = 1;
			for(var x = 0; x < 9; x++)
				if(pos[r * 9 + x] > 0)
					cnstrt[p][Number(pos[r*9+x])] = 0;
			for(var x = 0; x < 9; x++)
				if(pos[x * 9 + c] > 0)
					cnstrt[p][Number(pos[x*9+c])] = 0;
			var block = Math.floor(r/3)*3 + Math.floor(c/3);
			for(var x = 0; x < 9; x++)
			  if(pos[defineblock[block][x]] > 0)
			    cnstrt[p][Number(pos[defineblock[block][x]])] = 0;
			
			var last_valid = -1;
			for(var x = 1; x <= 9; x++)
				if(cnstrt[p][x] == 1) 	{
					cnstrt[p][0]++;
					last_valid = x;
				}
				
			if(cnstrt[p][0] == 1)	{
			  	pos[p] = last_valid;
				tbl.rows[r].cells[c].innerHTML=pos[p];
				solved++;
			}
			
		}

		if(cnstrt[p][0] > 0)	{		
			sum += cnstrt[p][0];
			num++;
		}
	}		
	
	return solved;
}

function backtrack()	{
	console.log("Using backtrack now");
	rearrange_emptycells();
	start_backtrack();
	find_correct_value();
}

function rearrange_emptycells()	{
	var fewest_constraints = 11;
	var fewest = -1;
	constraintorder.length = 0;

	for(var p = 0; p < 81; p++)
		if(cnstrt[p][0] > 1 && cnstrt[p][0] < fewest_constraints)	{
			fewest = p;
			fewest_constraints = cnstrt[p][0];
		}
	if(fewest == -1)
		return;
	constraintorder.push(fewest);
	
	var r = Math.floor(fewest / 9);
	var c = fewest % 9;
	var b = Math.floor(r/3)*3 + Math.floor(c/3);
	for(var x = 0; x < 9; x++)
		if(x*9+c != fewest && cnstrt[x*9+c][0] > 1)
			constraintorder.push(x*9+c);
	for(var x = 0; x < 9; x++)
		if(r*9+x != fewest && cnstrt[r*9+x][0] > 1)
			constraintorder.push(r*9+x);
	for(var x = 0; x < 9; x++)	{
		var r_2 = Math.floor(defineblock[b][x]/9);
		var c_2 = defineblock[b][x] % 9;
		if(r_2 == r || c_2 == c || cnstrt[defineblock[b][x]][0] < 2)
			continue;
		constraintorder.push(defineblock[b][x]);	
	}
	
	for(var x = 0; x < 81; x++)	{
		if(cnstrt[x][0] < 2)
			continue;
		var r_2 = Math.floor(x/ 9);
		var c_2 = x% 9;
		var b_2 = Math.floor(r_2/3)*3 + Math.floor(c_2/3);
		if(r_2 == r || c_2 == c || b_2 == b)
			continue;
		constraintorder.push(x);	
	}
}


function start_backtrack()	{
	for(var x = 0; x < 81; x++)
		ptr[x] = 0;
	search_pos = 0;
}


function find_correct_value()	{
  	var iter = 0;
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
	
  	while(iter++ < no_of_iter)	{
  		
  		if(search_pos >= constraintorder.length)	{
  		  	for(var p = 0; p < constraintorder.length; p++)	{
		  		var cons = constraintorder[p];
		  		var r = Math.floor(cons/9);
		  		var c = cons%9;
		  		tbl.rows[r].cells[c].innerHTML = ptr[cons];
		  	}
  			return;
  		}
  	
		var cons = constraintorder[search_pos];
		
		while(++ptr[cons] < 10)	
			if(cnstrt[cons][ptr[cons]] == 1 && checkboard())	
				break;
			
		if(ptr[cons] >= 10)	{
			ptr[cons] = 0;
			search_pos--;
			continue;
		} 
		
		search_pos++;  
  	}  
  	
  	for(var p = 0; p < constraintorder.length; p++)	{
  		var cons = constraintorder[p];
  		var r = Math.floor(cons/9);
  		var c = cons%9;
  		tbl.rows[r].cells[c].innerHTML = p<search_pos?ptr[cons]:" ";
  	}
	
  	tcount++;
  	setTimeout("find_correct_value()", sleeptime);
	
}

function checkboard()	{
	var x = constraintorder[search_pos];
	var cur_r = Math.floor(x/9);
	var cur_c = x%9;
	var cur_b = Math.floor(cur_r/3)*3 + Math.floor(cur_c/3);

	for(var m = 0; m < search_pos; m++)	{
		var p = constraintorder[m];
		var r = Math.floor(p / 9);
		var c = p % 9;
		var b = Math.floor(r/3)*3 + Math.floor(c/3);
		if( (r == cur_r || c == cur_c || b == cur_b) && ptr[p] == ptr[x])	
			return false;	
	}
	return true;
}
