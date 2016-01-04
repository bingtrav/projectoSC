$(document).ready(function() {


    var error = false;

    function setErrorMsg(element, msg, type) {
        element.parents('.element-wrapper').css({
            'border': '1px solid #b71c1c'
        });
        element.parents('.element-wrapper').find('.fa-column').css({
            'background-color': '#b71c1c'
        });
        if (type) {
            $('#error-msg-login').text('');
            $('#error-msg-login').text(msg);
            $('#msg-login').show(100);
            $('#login-btn').hide(100);
        } else {
            $('#error-msg-register').text('');
            $('#error-msg-register').text(msg);
            $('#msg-register').show(100);
            $('#new-account-btn').hide(100);
        }
    }




    function validateRegisterFields() {
        var name = $('#user-name');
        //var idt = $('#user-identification');
        var email = $('#new-user-email');
        var password = $('#new-user-password');
        var telephone = $('#user-telephone');
        if (name.val() === '') {
            setErrorMsg(name, 'Digita un nombre', false);
            return false;
        }
        /**if (idt.val() === '') {
            setErrorMsg(idt, 'Digita un número de identificación', false);
            return false;
        }**/

        if (telephone.val() === '') {
            setErrorMsg(telephone, 'Digita un número de teléfono', false);
            return false;
        }else{
            if(telephone.val().length<8){
                 setErrorMsg(telephone, 'Digíta un número de teléfono válido', false);
                return false;
            }
        }

        if (email.val() === '') {
            setErrorMsg(email, 'Digita una dirección de email', false);
            return false;
        } else {
            if (!validateEmail(email.val())) {
                setErrorMsg(email, 'Email inválido', false);
                return false;
            }
        }

        if (password.val() === '') {
            setErrorMsg(password, 'Digita una contraseña', false);
            return false;
        } else {

            if (password.val().length < 8) {
                setErrorMsg(password, 'Contraseña debe tener mínimo 8 caractéres', false);
                return false;
            }
        }

        return true;
    }

    function validateLoginFields() {
        var email = $('#user-email');
        var password = $('#user-password');
        if (email.val() === '') {
            setErrorMsg(email, 'Digita una dirección de email', true);
            return false;
        } else {
            if (!validateEmail(email.val())) {
                setErrorMsg(email, 'Email inválido', true);
                return false;
            }
        }

        if (password.val() === '') {
            setErrorMsg(password, 'Digita una contraseña', true);
            return false;
        }

        return true;
    }

    function validateEmail(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        return false;
    }

    $('#new-account-btn').click(function() {
        if (!validateRegisterFields()) {
            error = true;
        } else {
            registerUser();
        }
    });

    $('#login-btn').click(function() {
validateLoginEnter();
    });

$(document).keypress(function(e) {
    if(e.keyCode===13){
validateLoginEnter();}
});


function validateLoginEnter(){
       // if (!validateLoginFields()) {
         //   error = true;
        //} else {
           loginUser();
        //}
}

    $('input').focusin(function() {
        if (error) {
            $(this).parents('.element-wrapper').css({
                'border': '1px solid #e9e9e9'
            });
            $(this).parents('.element-wrapper').find('.fa-column').css({
                'background-color': 'white'
            });
            //error = false;
        }
        if($(this).parents('.container').hasClass('register-container')){
        	$('#msg-register').hide(100);
            $('#new-account-btn').show(100);
        }else{
        	$('#msg-login').hide(100);
            $('#login-btn').show(100);
        }
    });


function loginUser(){
//Parse.User.logIn('c@c.com', 'ericsalas', {
    Parse.User.logIn($('#user-email').val(), $('#user-password').val(), {
  success: function(user) {
    cleanFields(true);
    window.location.href = "perfil.html";
  // Parse.User.logOut();

  },
  error: function(user, error) {
  	if(error.code===101){
  		error = true;
  		setErrorMsg($('#user-email'),'Email o contraseña invalidos',true);
  		setErrorMsg($('#user-password'),'Email o contraseña invalidos',true);
  	}
  }
});


}

    function registerUser() {
        var user = new Parse.User();
        user.set("username", $('#new-user-email').val());
        user.set("password", $('#new-user-password').val());
        user.set("email", $('#new-user-email').val());
        user.set("Telefono", $('#user-telephone').val());
        //user.set("NumeroIdentificacion", $('#user-identification').val());
        user.set("Nombre", $('#user-name').val());
        user.set("Activo",true);
        user.set("Tipo",true);

        user.signUp(null, {
            success: function(user) {
                cleanFields(false);
                alert('Tu cuenta esta casi lista, ahora por favor revisa tu correo para verificar tu email ;)');
            },
            error: function(user, error) {
            	console.log(error);
               if (error.code === 203) {
                    if(confirm('Ya ese email existe en nuestra base de datos, ¿quieres recuperar tu cuenta?'))
                    {
alert("¡Te enviamos las instrucciones! Revisa tu email ;)");
cleanFields(false);
                    }
                }
            }
        });
    }

    function cleanFields(type) {
    	                $('.element-wrapper').css({
                    'border': '1px solid #e9e9e9'
                });
                $('.element-wrapper').find('.fa-column').css({
                    'background-color': 'white'
                });
        if (!type) {
            $('#new-user-email').val('');
            $('#new-user-password').val('');
            $('#user-telephone').val('');
            //$('#user-identification').val('');
            $('#user-name').val('');
            $('#msg-register').hide();
            $('#new-account-btn').show();
        } else {
            $('#user-email').val('');
            $('#user-password').val('');
            $('#msg-login').hide();
            $('#login-btn').show();
        }
    }

    $('#show-login-btn').click(function() {
        $('html').css('cursor', 'progress');
        $('.register-container').hide('slow', function() {
            $('.login-container').show('slow', function() {
                error = false;
                cleanFields(false);
            });
            $('html').css('cursor', 'default');
        });
    })


    $('#show-create-account-btn').click(function() {
        $('html').css('cursor', 'progress');
        $('.login-container').hide('slow', function() {
            $('.register-container').show('slow', function() {
                $("body, html").animate({
                    scrollTop: $($('#show-login-btn')).offset().top
                }, 5000);
error = false;
cleanFields(true);
            });

        });
        $('html').css('cursor', 'default');
    })


});