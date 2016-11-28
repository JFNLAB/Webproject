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
  	var qp = firebase.database().ref('/productos');
  	var user = firebase.auth().currentUser;
  	var email = user.email;
  	qp.once('value',
  		function(productos){
  			productos.forEach(function(producto){
  				if (producto.val().prod==nombre){
  					console.log('se encontro el producto');
  					comprar(email,producto.val().precio, producto.val().prod);

  				}
  			})
  		});
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
	          var newSaldo = (usuario.val().salario - precio);
	          var key = usuario.key;
	          var updates = {};
				console.log("ACA " + usuario.key);
				var update = firebase.database().ref().child('usuarios/'+ usuario.key);
				update.update({
				  "salario": newSaldo
		
						});
						var link = "mailto:"+email+""
		             + "?cc=noreply@just-for-now-shop.firebaseapp.com"
		             + "&subject=" + escape("Compra realizada con exito")
		             + "&body=" + escape("Agradecemos su compra de " + prod)
		    ;
		    console.log('mail enviado a '+email);

		    window.location.href = link;

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
