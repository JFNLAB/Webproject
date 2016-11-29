var vector=[];

function initFirebase(){
	console.log("iniciando db");
	src="https://www.gstatic.com/firebasejs/3.5.3/firebase.js";
  	var config = {
		apiKey: "AIzaSyAeY5ekmTdQKT5nQj_BFdO_t4l9g1gw1CQ",
		authDomain: "just-for-now-shop.firebaseapp.com",
		databaseURL: "https://just-for-now-shop.firebaseio.com",
		storageBucket: "just-for-now-shop.appspot.com",
		messagingSenderId: "309599821973",
		GoogleAuthProvider: "Du1pewHMg125Pl2kN1_r8mu4"
	};
firebase.initializeApp(config);
var database=firebase.database();


}


	function salario(){
	    console.log("buscando salario");
	    //URl de las notas
	    var qn = firebase.database().ref('/usuarios');
	    //buscamos notas
	    qn.once('value', 
	      function(usuarios){  // Si esta todo bien
	        console.log(usuarios);
	        var user = firebase.auth().currentUser;
	        
	        usuarios.forEach(function(usuario){ 
	          console.log(usuario.key);
	                        
	          if (user.email == usuario.val().email){
	          document.getElementById("saldo").innerHTML=("<i class='material-icons left'>payment</i> $"+usuario.val().salario)
	          document.getElementById("nom_user").innerHTML=("<i class='material-icons left'>perm_identity</i> "+usuario.val().usuario)
	          document.getElementById("mensaje").innerHTML=("Bienvenido "+ usuario.val().usuario)

	          }


	        });
	      },
	      function(error){ //si hay un error
	        console.log(error);

	      });
	  }

function addCarrito(nombre){
	if (confirm("¿Esta seguro que desea comprar este producto?") == true) {

  	var qp = firebase.database().ref('/productos');
  	var user = firebase.auth().currentUser;
  	var email = user.email;
  	qp.once('value',
  		function(productos){
  			productos.forEach(function(producto){
  				if (producto.val().prod==nombre){
  					console.log('se encontro el producto');
  					comprar(email,producto.val().precio, producto.val().prod);
                    vector.push(["" + producto.val().prod, producto.val().precio]);
                    
                }
  			});
  		});
} else {
} 
}

function comprar(email,precio, prod){
	 var qn = firebase.database().ref('/usuarios');
	    //buscamos notas
	    qn.once('value', 
	      function(usuarios){  // Si esta todo bien
	        console.log(usuarios);
	        var user = firebase.auth().currentUser;
	        
	        usuarios.forEach(function(usuario){ 
	          console.log(usuario.key);
	          if (email == usuario.val().email){
	          if ((usuario.val().salario)>=precio){
	          	        var newSaldo = (usuario.val().salario - precio);
	          			var key = usuario.key;
	          			var updates = {};
						console.log("ACA " + usuario.key);
						var update = firebase.database().ref().child('usuarios/'+ usuario.key);
						update.update({
				  			"salario": newSaldo
              			});
	          }else{
	          	alert("Saldo insuficiente")
	          }

	          }
	          salario();


	        });
	      },
	      function(error){ //si hay un error
	        console.log(error);

	      });
	// Write the new post's data simultaneously in the posts list and the user's post list.
	//var userKey = firebase.database().ref().child('usuarios').push().key;


}
function showCart(){
    var vector= JSON.parse(localStorage.getItem('vector'));
    var total = 0;
    var tablaG = document.createElement("DIV");
    tablaG.id="tablita";
    tablaG.className="collection";
    for (i=0; i<vector.length;i++){
            console.log("show cart 2");

        var tabla = document.createElement("A");
        tabla.className="collection-item";
        var sArray = vector[i];
        var boleano = true;                       
        for (b=0; b<sArray.length;b++){
            console.log("show cart 3");
            if (boleano){
                var nombre = document.createTextNode(sArray[b]);
                tabla.appendChild(nombre);
                boleano=false;
            }else{
                var precio = document.createElement("SPAN");
                var tPrecio = document.createTextNode("$ "+sArray[b]);
                precio.appendChild(tPrecio);
                precio.className="badge";
                tabla.appendChild(precio);
                boleano=true;
                tablaG.appendChild(tabla);
                total+=sArray[b];
            }
}
        
} 
    var final = document.createElement("A");
    final.className="collection-item";
    final.appendChild(document.createTextNode("Total "));
    var precioF = document.createElement("SPAN");
    precioF.appendChild(document.createTextNode("$ "+total));
    precioF.className="badge";
    final.appendChild(precioF);
    tablaG.appendChild(document.createElement("BR"));
    tablaG.appendChild(final);
    document.body.appendChild(tablaG);
}

function saveData(){
	var finalV= JSON.parse(localStorage.getItem('vector'));
	for (var i = 0; i < vector.length; i++) {
		finalV.push(vector[i]);
	}
    localStorage.setItem("vector", JSON.stringify(finalV));
}

function clearData(){
	localStorage.setItem("vector", JSON.stringify(vector));
	document.getElementById("tablita").remove();
	showCart();
}


