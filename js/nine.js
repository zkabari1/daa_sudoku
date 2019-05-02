var constraints = new Array(81);
for(var x = 0; x < 81; x++)	
	constraints[x] = new Array(10);
var blockDef = new Array(9);
blockDef[0] = [0,1,2,9,10,11,18,19,20];
blockDef[1] = [3,4,5,12,13,14,21,22,23];
blockDef[2] = [6,7,8,15,16,17,24,25,26];
blockDef[3] = [27,28,29,36,37,38,45,46,47];
blockDef[4] = [30,31,32,39,40,41,48,49,50];
blockDef[5] = [33,34,35,42,43,44,51,52,53];
blockDef[6] = [54,55,56,63,64,65,72,73,74];
blockDef[7] = [57,58,59,66,67,68,75,76,77];
blockDef[8] = [60,61,62,69,70,71,78,79,80];
var cOrder = new Array(81);
var cpointers = new Array(81);
var iters_per_timeslice = 4000;
var sleep_timeslice = 500;
var randomize = false;
var timeslices = 0;

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
		x = updateConstraints(input);
	} while(x > 0);
	search_dfs();
}
function search_dfs()	{
	console.log("Using dfs");
	reorder_constraints();
	initialize_dfs();
	search_r();
}
function reorder_constraints()	{
	var fewest_constraints = 11;
	var fewest = -1;
	cOrder.length = 0;

	/* find a cell with the fewest constraints */
	for(var p = 0; p < 81; p++)
		if(constraints[p][0] > 1 && constraints[p][0] < fewest_constraints)	{
			fewest = p;
			fewest_constraints = constraints[p][0];
		}
	if(fewest == -1)
		return;
	cOrder.push(fewest);
	
	/* add all constraints along fewest's row and column and block */
	var r = Math.floor(fewest / 9);
	var c = fewest % 9;
	var b = Math.floor(r/3)*3 + Math.floor(c/3);
	for(var x = 0; x < 9; x++)
		if(x*9+c != fewest && constraints[x*9+c][0] > 1)
			cOrder.push(x*9+c);
	for(var x = 0; x < 9; x++)
		if(r*9+x != fewest && constraints[r*9+x][0] > 1)
			cOrder.push(r*9+x);
	for(var x = 0; x < 9; x++)	{
		var r_2 = Math.floor(blockDef[b][x]/9);
		var c_2 = blockDef[b][x] % 9;
		if(r_2 == r || c_2 == c || constraints[blockDef[b][x]][0] < 2)
			continue;
		cOrder.push(blockDef[b][x]);	
	}
	
	/* add all the remaining constraints */
	for(var x = 0; x < 81; x++)	{
		if(constraints[x][0] < 2)
			continue;
		var r_2 = Math.floor(x/ 9);
		var c_2 = x% 9;
		var b_2 = Math.floor(r_2/3)*3 + Math.floor(c_2/3);
		if(r_2 == r || c_2 == c || b_2 == b)
			continue;
		cOrder.push(x);	
	}
}
function initialize_dfs()	{
	for(var x = 0; x < 81; x++)
		cpointers[x] = 0;
	search_pos = 0;
}
function search_r()	{
  	var iter = 0;
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
	
  	while(iter++ < iters_per_timeslice)	{
  		
  		if(search_pos >= cOrder.length)	{
  			/* Solved */
		  	for(var p = 0; p < cOrder.length; p++)	{
		  		var cons = cOrder[p];
		  		var r = Math.floor(cons/9);
		  		var c = cons%9;
		  		tbl.rows[r].cells[c].innerHTML = cpointers[cons];
		  	}
  			return;
  		}
  	
		var cons = cOrder[search_pos];
		
		/* find an allowable number for this cell */
		while(++cpointers[cons] < 10)	
			if(constraints[cons][cpointers[cons]] == 1 && validate())	
				break;
			
		if(cpointers[cons] >= 10)	{
			cpointers[cons] = 0;
			search_pos--;
			continue;
		} 
		
		search_pos++;  
  	}  
  	
  	/* display progress */
  	for(var p = 0; p < cOrder.length; p++)	{
  		var cons = cOrder[p];
  		var r = Math.floor(cons/9);
  		var c = cons%9;
  		tbl.rows[r].cells[c].innerHTML = p<search_pos?cpointers[cons]:" ";
  	}
	if(randomize && timeslices % 50 == 0)
		randomize_constraints_from(search_pos);
  	
  	timeslices++;
  	console.log("Phase 2: Search.<br><b>Timeslices:</b> "+timeslices);
  	setTimeout("search_r()", sleep_timeslice);
	
}

function updateConstraints(pos)	{
	let body = document.getElementById("right");
	let tbl = body.getElementsByTagName("table")[0];
//	console.log(pos);
	var solved = 0;
	var sum = 0;
	var num = 0;

	for(var p = 0; p < 81; p++)	{
		for(var x = 0; x < 10; x++)
			constraints[p][x] = 0;
			
		if(pos[p] >= 1 && pos[p] <= 9)	{
		  	/* filled cell, no constraints */
			constraints[p][0] = 1;
			constraints[p][pos[p]] = 1;
		}
		else	{
			/* blank square, find possible values */
			var r = Math.floor(p / 9);
			var c = p % 9;
			for(var x = 1; x <= 9; x++)
				constraints[p][x] = 1;
			/* get row constraints */
			for(var x = 0; x < 9; x++)
				if(pos[r * 9 + x] > 0)
					constraints[p][Number(pos[r*9+x])] = 0;
			/* get column constraints */
			for(var x = 0; x < 9; x++)
				if(pos[x * 9 + c] > 0)
					constraints[p][Number(pos[x*9+c])] = 0;
			/* get block constraints */
			var block = Math.floor(r/3)*3 + Math.floor(c/3);
			for(var x = 0; x < 9; x++)
			  if(pos[blockDef[block][x]] > 0)
			    constraints[p][Number(pos[blockDef[block][x]])] = 0;
			
			/* update constraints */
			var last_valid = -1;
			for(var x = 1; x <= 9; x++)
				if(constraints[p][x] == 1) 	{
					constraints[p][0]++;
					last_valid = x;
				}
				
			if(constraints[p][0] == 1)	{
			  	pos[p] = last_valid;
				tbl.rows[r].cells[c].innerHTML=pos[p];
				solved++;
			}
			
		}

		if(constraints[p][0] > 0)	{		
			sum += constraints[p][0];
			num++;
		}
	}		
	
	return solved;
}
function validate()	{
	var x = cOrder[search_pos];
	var cur_r = Math.floor(x/9);
	var cur_c = x%9;
	var cur_b = Math.floor(cur_r/3)*3 + Math.floor(cur_c/3);

	for(var m = 0; m < search_pos; m++)	{
		var p = cOrder[m];
		var r = Math.floor(p / 9);
		var c = p % 9;
		var b = Math.floor(r/3)*3 + Math.floor(c/3);
		if( (r == cur_r || c == cur_c || b == cur_b) && cpointers[p] == cpointers[x])	
			return false;	
	}
	return true;
}
