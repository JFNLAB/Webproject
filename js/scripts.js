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

  function addCarrito(){
  		var producto = document.getElementById("precio").value;
      console.log(producto);
  		var qn = firebase.database().ref('usuarios/');
  		qn.once('value', 
      	function(usuarios){  // Si esta todo bien
        var user = firebase.auth().currentUser;
        
        usuarios.forEach(function(usuario){                         
          if (user.email == usuario.val().email){
  			    var saldo = usuario.val().salario;
  			    console.log(producto + " ..." + saldo);

  		}
		});
	});
}