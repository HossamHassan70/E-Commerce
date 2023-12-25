
var row = null
function Supmit() {

	var dataentered = retrieveData();
	var readdata = readingdatafromlocalstorage(dataentered);
	
if (dataentered == false) {
	msg.innerHTML = '<h3 style="color:red ; ">please enter data!<h3/>';
} else {
	if (row == null) {
		insert(readdata);
		msg.innerHTML = '<h3 style="color:yellow ; ">Data Inserted !<h3/>';
	}
	else {
		update();
		msg.innerHTML = '<h3 style="color:blue; ">Data Updated!<h3/>';
	}

}
document.getElementById("form").reset();

}

//create
//retrieveData from form

function retrieveData() {

	var id = document.getElementById("ID").value;
	var PRODUCTNAME = document.getElementById("PRODUCT NAME").value;
	var category = document.getElementById("Category").value;
	var Descreption = document.getElementById("Descreption").value;
	var arr = [id, PRODUCTNAME, category, Descreption]
	if (arr.includes("")) {
		return false;
	} else {
		return arr;
	}
}
//read
//data in local storage
function readingdatafromlocalstorage(dataentered) {
	//storing in localStorage

	var I = localStorage.setItem("ID", dataentered[0]);
	var P = localStorage.setItem("PRODUCT NAME", dataentered[1]);
	var C = localStorage.setItem("Category", dataentered[2]);
	var D = localStorage.setItem("Descreption", dataentered[3]);


	//getting data from localStorage to table


	var I1 = localStorage.getItem("ID", I);
	var P1 = localStorage.getItem("PRODUCT NAME", P);
	var C1 = localStorage.getItem("Category", C);
	var D1 = localStorage.getItem("Descreption", D);

	var arr = [I1, P1, C1, D1];

	return arr;
}


//insert

function insert(readdata) {
	row = table.insertRow();
	row.insertCell(0).innerHTML = readdata[0];
	row.insertCell(1).innerHTML = readdata[1];
	row.insertCell(2).innerHTML = readdata[2];
	row.insertCell(3).innerHTML = readdata[3];
	row.insertCell(4).innerHTML = `<button onclick= edit(this)>Edit</button>
	<button onclick=remove(this)>Delete</button>`;

}
//edit
function edit(td) {
	var row = td.parentElement.parentElement;
	document.getElementById("ID").value = row.cells[0].innerHTML;
	document.getElementById("PRODUCT NAME").value = row.cells[1].innerHTML;
	document.getElementById("Category").value = row.cells[2].innerHTML;
	document.getElementById("Descreption").value = row.cells[3].innerHTML;

}

//update
function update() {
	row.cells[0].innerHTML = document.getElementById("ID").value;
	row.cells[1].innerHTML = document.getElementById("PRODUCT NAME").value;
	row.cells[2].innerHTML = document.getElementById("Category").value;
	row.cells[3].innerHTML = document.getElementById("Descreption").value;
	row = null;
}
//delete
function remove(td) {
	var ans = confirm('Are u sure to delete this record?');
	if (ans == true) {
		row = td.parentElement.parentElement;
		document.getElementById("table").deleteRow(row.rowIndex);
	}
}































