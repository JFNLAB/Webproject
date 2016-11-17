/*
 * Please see the included README.md file for license terms and conditions.
 */

var signInButton = document.getElementById('sign-in-button');
//var signOutButton = document.getElementById('sign-out-button');menu-my-top-posts
//var signOutButton = document.getElementById('menu-my-top-posts');
var loginPage = document.getElementById('loginpage');
var mainPage = document.getElementById('mainpage');
var btn_login = false;
var actual_login = '';
var users = {};
var clientes = {};
var productos = {
    prepiza: 'Pizza redonda',
    prepiza_rect: 'Pizza rectangular',
    pizeta: 'Pizzeta',
    lomo: 'Pan de Lomo 20x10',
    lomo_20_9: 'Pan de Lomo 20 x 9',
    lomo_18_8: 'Pan de Lomo 18 x 8',
    pan_piza: 'Pan de pizza',
    pan_piza_oval: 'Pan de pizza ovalado',
    arabe: 'Pan Arabe'
};
function cleanupUi(){

    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;


    document.getElementById('date').value = today;

    $('#btn_tab_ventas').click();

}


function onAuthStateChanged(user) {
    // We ignore token refresh events.
    if (btn_login){
        btn_login = false;
    }else{
        if (user){
            if (actual_login == user.uid){
                return false;
            }
        }

    }



    if (user) {
        console.log('User exists')
        cleanupUi();
        actual_login = user.uid;
        loginPage.style.display = 'none';
        mainPage.style.display = '';
        load_users();
        load_clientes();
        $('#loading').hide();

    } else {
        $('#loading').hide();
        console.log('dont exists user')
        // Display the splash page where you can sign-in.
        loginPage.style.display = '';
        mainPage.style.display = 'none';
        actual_login = ''
    }

}

$("#refresh").on('click', function() {
    load_clientes();
});

$("#btn-add-client").on('click', function() {

    var newClientKey = firebase.database().ref().child('clientes').push().key;
    var updates = {};

    var cliente = $("#add-client-name").val();
    if (cliente.length <= 0){
        navigator.notification.alert('Nombre del cliente por favor.');
        return false;
    }

    updates['/clientes/' + newClientKey] = {
        nombre: cliente,
        direccion: $("#add-client-address").val(),
        comentario: $("#add-client-comment").val(),
        user: firebase.auth().currentUser.uid
    };

    firebase.database().ref().update(updates);
    load_clientes();
    $("#add-client-name").val('');
    $("#add-client-address").val('');
    $("#add-client-comment").val('');
    $('#cliente_list_btn').click();

});

function getDateFromInput(){
    var mydate = $("#date").val();
    var splited = mydate.replace(/\-/g, '');
    return splited;
}

$("#date").on('change', function() {

    load_ventas();
});

$("#btn-add-sell").on('click', function() {
    var fecha = getDateFromInput();
    var newVentaKey = firebase.database().ref().child('ventas/' + fecha).push().key;
    var updates = {};

    var cantidad = parseInt($("#add_venta_cantidad").val());
    if (isNaN(cantidad) || cantidad <= 0){
        navigator.notification.alert('Seleccione una cantidad real por favor.');
        return false;
    }

    var tipo = $("#add_venta_tipo").val();
    if (tipo.length <= 0){
        navigator.notification.alert('Seleccione tipo de venta por favor.');
        return false;
    }

    var cliente = $("#add_venta_cliente").val();
    if (cliente.length <= 0){
        navigator.notification.alert('Seleccione un cliente por favor.');
        return false;
    }



    updates['/ventas/' + fecha+'/'+newVentaKey] = {
        tipo_venta: tipo,
        cantidad: cantidad,
        cliente: cliente,
        user: firebase.auth().currentUser.uid
    };



    firebase.database().ref().update(updates);


    $("#add_venta_tipo").val($("#add_venta_tipo option:first").val());
    $("#add_venta_cliente").val($("#add_venta_cliente option:first").val());
    $("add_venta_cantidad").val('1');

    load_ventas();

    $('#venta_list_btn').click();

});


$("#logout").on('click', function() {
    $('#loading').hide();
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    firebase.auth().signOut();
});


function load_users(){
    users = {};
    var fusers = firebase.database().ref('users/');
    fusers.once('value', function(all_users) {
        var userskey = all_users.key;
        var usersData = all_users.val();
        users[userskey] = usersData;

        if (usersData[firebase.auth().currentUser.uid].admin != 1){
            $('.is_admin').hide();
        }
    });


}

function load_clientes(){
    $("#refresh").addClass('fa-spin');
    clientes = {};
    $('#add_venta_cliente').find('option').remove().end();
    $('#add_venta_cliente').append('<option value="">---------</option>');
    var client_list = $("#client_list");
    var clientesfb = firebase.database().ref('clientes/');
    client_list.html('<div><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>');
    clientesfb.once('value', function(all_clients) {

        client_list.html('');
        all_clients.forEach(function(cliente) {
            var clienteKey = cliente.key;
            var clienteData = cliente.val();
            clientes[clienteKey] = clienteData;
            var html = '<a class="list-group-item allow-badge widget uib_w_25" data-uib="twitter%20bootstrap/list_item" data-ver="1">'+
                '<span class="badge">'+users.users[clienteData.user].nick+'</span>'+
                '<h4 class="list-group-item-heading"><b>'+clienteData.nombre+'</b></h4>'+
                '<p class="list-group-item-text">'+clienteData.direccion+'</p></a>';
            client_list.append(html);
            $('#add_venta_cliente').append($('<option>').text(clienteData.nombre).attr('value', clienteKey));

        });

        load_ventas();
    });


}

function load_ventas(){
    var fecha = getDateFromInput();
    var ventas_list = $("#ventas_list");
    var ventas = firebase.database().ref('ventas/' + fecha+ '/');
    ventas_list.html('<div><i class="fa fa-spinner fa-spin fa-3x fa-fw"></i></div>');

    $("#ventas_total_pane").html('');
    $('#add_venta_tipo').find('option').remove().end();
    $('#add_venta_tipo').append('<option value="">---------</option>');
    for (var key in productos) {
        var text = productos[key];

        $('#add_venta_tipo').append($('<option>').text(text).attr('value', key));

        var htmls = '<a class="list-group-item allow-badge widget uib_w_25" data-uib="twitter%20bootstrap/list_item" data-ver="1">'+
            '<span class="badge is_admin" id="total-cant-'+key+'">0</span>'+
            '<h4 class="list-group-item-heading"><b>'+text+'</b></h4>' +
            '<p class="list-group-item-text ">Total ventas diarias: <span id="cant-'+key+'">0</span></p></a>';

        $("#ventas_total_pane").append(htmls);
    }

    ventas.once('value', function(ventas) {
        ventas_list.html('');
        ventas.forEach(function(venta) {
            var ventaKey = venta.key;
            var ventaData = venta.val();
            $("#total-cant-"+ventaData.tipo_venta).html(parseInt($("#total-cant-"+ventaData.tipo_venta).html())+ventaData.cantidad);
            if (ventaData.user == firebase.auth().currentUser.uid){
                var html = '<a class="list-group-item allow-badge widget uib_w_25" data-uib="twitter%20bootstrap/list_item" data-ver="1">'+
                    '<span class="badge">'+ventaData.cantidad+'</span>'+
                    '<h4 class="list-group-item-heading"><b>'+productos[ventaData.tipo_venta]+'</b></h4>'+
                    '<p class="list-group-item-text">'+clientes[ventaData.cliente].nombre+'</p></a>';
                ventas_list.append(html);
                $("#cant-"+ventaData.tipo_venta).html(parseInt($("#cant-"+ventaData.tipo_venta).html())+ventaData.cantidad);
            }


        });
    });
    $("#refresh").removeClass('fa-spin');





}

// ...additional event handlers here...
window.addEventListener('load', function() {

    // Bind Sign in button.
    signInButton.addEventListener('click', function() {
        $('#loading').show();

        //var provider = new firebase.auth.GoogleAuthProvider();
        //firebase.auth().signInWithPopup(provider);
        btn_login = true;
        /*
});
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
    } else {*/

        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);

            localStorage.removeItem("email");
            localStorage.removeItem("password");
            // [END_EXCLUDE]
        });

        // [END authwithemail]
        //}

    });


    /* Bind Sign out button.
signOutButton.addEventListener('click', function() {
    firebase.auth().signOut();

});
*/
    // Listen for auth state changes
    $('#loading').hide();
    firebase.auth().onAuthStateChanged(onAuthStateChanged);
    if (localStorage.email) {
        $('#loading').show();
        firebase.auth().signInWithEmailAndPassword(localStorage.email, localStorage.password)
    }

}, false);
