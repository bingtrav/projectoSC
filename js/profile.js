
$(document).ready(function() {




    var orders = {};
    var loadedOrders = 0;
    var userType = false;
    var restaurantsList = [];
    //setAutocomplete();
    clearFields();
    setUserData();
    
      var mb = new MobileDetect(window.navigator.userAgent);


    function clearFields() {
        $('#bdehj6g3').val("");
        $('#YYvd65_T').val("");
        $('#hbwf31ox').val("");
        $('#user-minimum').val("");
        $('#user-delivery').val("");
        $('#user-delivery-time').val("");
        $('#user-name').val("");
        $('#user-telephone').val("");
        $('#user-address').val("");
        $('#user-balance').val("");
    }

    function setUserData() {
        var currentUser =  store.get('validado');
        var idUsuario = store.get('idUsuario');

        if (currentUser) {
            $('#user-photo').attr('src', 'img/users/2Fv3SNguAW.jpg');

        $.ajax({
            method: "get",
            url: "http://ec2-52-10-12-157.us-west-2.compute.amazonaws.com:3000/obtenerUsuario",
            data: {
                id: idUsuario
            },
            success: function(usuario){
$('#profile-user-name').text(usuario.nombre);
$('#user-email').val(usuario.email);
                if (usuario.tipo) {
                    userType = true;
                    $('#user-balance').val("¢1.500");
                    $('#user-name').val(usuario.nombre);
                    $('#user-telephone').val(usuario.telefono1);
                } else {
                    $('.address, #save-btn').addClass('no-show');
                    $('.statistics').removeClass('no-show');
                    $('#user-balance').parents('.element-wrapper').addClass('no-show');
                    getRestaurantData(currentUser);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
            $('#container-data').removeClass('no-show');
        } else {
            window.location.href = "registro.html";
        }
    }

    $('#user-restaurant-list').change(function() {
        var value = $('option:selected', this).attr('value');
        $("option[value=0]", this).remove();
        setRestaurantData(value - 1);
    });


    function setRestaurantData(value) {
        var restaurant = restaurantsList[value];
        $('#user-minimum').val('¢' + restaurant.get("OrdenMinima"));
        $('#user-delivery').val('¢' + restaurant.get("CostoDelivery"));
        $('#user-delivery-time').val(restaurant.get("TiempoEntrega") + " minutos");
        $('#user-name').val(restaurant.get("Nombre"));
        $('#user-telephone').val(restaurant.get("Telefono"));
        $('#user-address').val(restaurant.get("Direccion").get("Descripcion"));
        $('.restaurant-fields').removeClass('no-show');
        $('#user-telephone,#user-name,#user-email').parents('.element-wrapper').removeClass('no-show');

    }

    function getRestaurantData(user) {
        var RestaurantUser = Parse.Object.extend("UserXRestaurant");
        var query = new Parse.Query(RestaurantUser);
        query.include("Restaurant");
        query.include("Restaurant.Direccion");
        query.equalTo("User", user);
        query.find({
            success: function(list) {
                $('.elements').find('input').attr('readonly',true);
                if (list.length > 1) {
                    $('#user-restaurant-list').parents('.element-wrapper').removeClass('no-show');
                    $('#user-telephone,#user-name,#user-email').parents('.element-wrapper').addClass('no-show');
                    var html = '';
                    $.each(list, function(index, element) {
                        var temp = element.get("Restaurant");
                        restaurantsList.push(temp);
                        html += '<option value="' + (index + 1) + '">' + temp.get("Nombre") + '</option>';
                    });
                    $('#user-restaurant-list').append(html);
                } else {
                    restaurantsList.push(list[0].get("Restaurant"));
                    setRestaurantData(0);
                    $('#user-restaurant-list').parents('.element-wrapper').addClass('no-show');
                }
            },

            error: function() {

            }
        });
    }


    function loadOrders() {
    
        var Order = Parse.Object.extend("Order");
        var query = new Parse.Query(Order);
        query.include("Estado");
        query.equalTo("Cliente", Parse.User.current());
        query.find({
            success: function(list) {
                if (list.length > 0) {
                    //$('#container-orders').html('');
                    loadedOrders = list.length;
                    var html ="";
                    $.each(list, function(k, v) {
                        var key = v.id;
                        orders[key] = v;
                       // console.log(v);
                        if(!mb.mobile()){
                 
             $('#container-orders').append('<div class="row element-wrapper text-center"><span class="no-show order-id">' + v.id + '</span><div class="col2 ">' + v.get("ID") + '</div><div class="col3">' +  v.get("FechaPedido").toLocaleString().split(',')[0] + '</div><div class="col2">₡' + v.get("Total") + '</div><div class="col3">' + v.get("Estado").get("Estado") + '</br><span class="underline blue cursor rate-order-btn" title="Haz click aquí para calificar esta orden">Calificar orden</span></div><div class="col2 cursor view-details underline" title="Ver detalles de la orden">Ver orden</br></div><div class="order-detail no-show"></div>');
                        }else{
                        $('.element-wrapper-header').addClass('no-show');
               $('#container-orders').append('<div class="row element-wrapper order-mobile"><span class="no-show order-id">' + v.id + '</span><div class="col6"><div class="row"><b>'+ v.get("ID") +'</b></div></br><div class="row">' + v.get("FechaPedido").toLocaleString()+ '</div></div><div class="col6"><div class="row">' + v.get("Estado").get("Estado") + '</div></br><div class="row"><span><b>Total:</b></span>    ₡' + v.get("Total") + '</div></br><div class="row cursor view-details underline" title="Ver detalles de la orden">Ver orden</br></div></div><div class="order-detail no-show"></div>');
                        }
                    });
                   /** $('#container-orders table').append(html);**/}
            },
            error: function(object, error) { }});
    }
   /** $('html').on('touchstart click','.order-mobile',function(event){
       var clickedOrder =  $(event.target).parent('.row');
       console.log("Clicked element: "+clickedOrder);
        console.log(clickedOrder);
        var orderId = clickedOrder.find('.order-id').text();
        var orderDetail =  clickedOrder.find('.order-detail');
        console.log("Order id: ");
         console.log(orderId);
        console.log("Order detail: ");
           console.log(orderDetail);
    });**/
       $('html').on('click', '.view-details', function(event) {
           var parent =  $(event.target).parents('.element-wrapper');
        var orderId = parent.find('.order-id').text();
        var orderDetail = parent.find('.order-detail');
        if (orderDetail.css('display') === 'none') {
            loadOrderDetails(orderId, $(this).parents('.element-wrapper'));
        }
        orderDetail.slideToggle();
    });
    
    
    
    var loadedAddresses = 0;

    function loadAddress() {
        var Address = Parse.Object.extend("Address");
        var query = new Parse.Query(Address);
        query.equalTo("Activo", true);
        query.equalTo("Cliente", Parse.User.current());
        query.find({
            success: function(list) {
                if (list.length > 0) {
                    $('#address-list').html('');
                    loadedAddresses = list.length;
                    $.each(list, function(k, a) {
                        var id = a.id;
                        $('#address-list').append('<div class="row element-wrapper text-center"><span class="no-show address-id">' + a.id + '</span><div class="col10">' + a.get("Descripcion") + '</div><div class="col2 red delete-address"><i title="Eliminar esta dirección" class="fa cursor fa-trash"</i></div>');
                    });
                }
            },
            error: function(object, error) {

            }
        });
    }

    $('.tab').click(function() {
        $('.selected').addClass('gray').removeClass('selected');
        $(this).removeClass('gray').addClass('selected');
        $('.active-container').removeClass('active-container').addClass('no-show');
        if ($(this).hasClass('order')) {
            if (loadedOrders === 0) {
                loadOrders();
            }
              $('.element-wrapper-header').addClass('no-show');
            $('#container-orders').removeClass('no-show').addClass('active-container');

        }

        if ($(this).hasClass('data')) {
            //setUserData();
            $('#container-data').removeClass('no-show').addClass('active-container');

        }
        if ($(this).hasClass('address')) {
            if (loadedAddresses === 0) {
                loadAddress();
            }
            $('.element-wrapper-header').removeClass('no-show');
            $('#container-address').removeClass('no-show').addClass('active-container');

        }

    });

    $('.exit-btn').click(function() {
        if (validateCurrentUser()) {
            Parse.User.logOut();
            window.location.href = "registro.html";
        }
    });

    $('#change-password-btn').click(function() {

        var bdehj6g3 = $('#bdehj6g3').val();
        var YYvd65_T = $('#YYvd65_T').val();
        var hbwf31ox = $('#hbwf31ox').val();

        if (bdehj6g3 === '' || YYvd65_T === '' || hbwf31ox == '') {
            alert('Ningún campo puede estar vacío');
        } else {
            if (YYvd65_T !== hbwf31ox) {
                alert('Las contraseñas nuevas no coinciden');
            } else {
                if (YYvd65_T.length < 8) {
                    alert('Contraseña debe tener mínimo 8 caractéres');
                } else {
                    var currentUser = Parse.User.current();
                    currentUser.setPassword(YYvd65_T);
                    currentUser.save().then(
                        function(user) {
                            $('#bdehj6g3').val("");
                            $('#YYvd65_T').val("");
                            $('#hbwf31ox').val("");
                            alert('Contraseña alterada con exito');
                        },
                        function(error) {
                            alert('Problema para actualizar la contraseña, por favor inténtalo de nuevo en algunos instantes.');
                        }
                    );
                }
            }
        }

    });

    function loadOrderDetails(orderId, parent) {
        var OrderDetail = Parse.Object.extend("OrderDetail");
        var query = new Parse.Query(OrderDetail);
        var Order = orders[orderId];
        query.include("Producto.Restaurante");
        query.equalTo("Orden", Order);
        var header = false;
        query.find({
            success: function(list) {
                var element = parent.find('.order-detail');
                var subtotal = 0;

                if (list.length > 0) {
                    element.html('');
                    $.each(list, function(i, od) {
                        if (!header) {
                            element.append('</br>Pedido en <b><span class="red cursor rest-name" id="' + od.get("Producto").get("Restaurante").id + '" title="Ver menú">' + od.get("Producto").get("Restaurante").get("Nombre") + '</span></b></br></br><div class="row element-wrapper-header text-center"><div class="col5">Producto</div><div class="col2"><span class="full">Cantidad</span><span class="mobile">Cant.</span></div><div class="col2"><span class="full">Precio</span><span class="mobile">Pre.</span></div><div class="col3"><span class="mobile">Subt.</span><span class="full">Subtotal</span></div></div><div class="details"></div>');
                            header = true;
                        }
                        var quantity = od.get("Cantidad");
                        var price = od.get("PrecioUnitario");
                        var sub = (parseInt(quantity) * parseInt(price));
                        subtotal += sub;
                        element.find('.details').append('<div class="row element-wrapper text-center"><div class="col5">' + od.get("Producto").get("Nombre") + '</div><div class="col2">' + quantity + '</div><div class="col2">₡' + price + '</div><div class="col3">₡' + sub + '</div></div>');
                    });
                    var paymentType = 'Llegada';
                    if (Order.get("PagoOnline")) {
                        paymentType = 'Online';
                    }

                    var delivery = 'Gratis';
                    if (Order.get("PrecioDelivery") !== '0') {
                        delivery = '₡' + Order.get("PrecioDelivery");
                    }

                    var total = Order.get("Total");
                    var comment = Order.get("Comentario");
                    var address = Order.get("DetalleDireccion");
                    element.append('<div class="row mobile"><div class="col5 red"><b>Comentario:</b></div><div class="col7">'+comment+'</div></div><div class="row mobile"><div class="col5 red"><b>Dirección de entrega:</b></div><div class="col7">'+address+'</div></div><div class="row mobile"><div class="col5 red"><b>Resumen de pago:</b> </div><div class="col7"><span>Pago: </span>'+ paymentType +'</br><span>Subtotal:</span> ₡'+ subtotal +'</br><span>Descuento:</span> ₡0 </br><span>Delivery:</span> '+ delivery +'</br><span>Total: ₡</span>'+ total +'</div></br><i class="fa cursor close-order-mobile fa-chevron-up blue"></i></div>                                                       <div class="full row element-wrapper-header text-center"><div class="col4 ">Comentario</div><div class="col4">Dirección de entrega</div><div class="col4">Resumen de pago</div></div><div class="details-footer full"><div class="row element-wrapper text-center"><div class="col4">' +comment + '</div><div class="col4">' + address + '</div><div class="col4"><div class="row"><div class="col6">Pago:</div><div class="col6">' + paymentType + '</div></div><div class="row"><div class="col6">Subtotal:</div><div class="col6">₡' + subtotal + '</div></div><div class="row"><div class="col6">Descuento:</div><div class="col6">₡0</div></div><div class="row"><div class="col6">Delivery:</div><div class="col6">' + delivery + '</div></div><div class="row"><div class="col6"><b>Total:</b></div><div class="col6">₡' + total + '</div></div></div></div></div>');

                }
            },
            error: function(object, error) {}
        });
    }

$('html').on('click','.close-order-mobile', function(event) {
        var parent =  $(event.target).parents('.element-wrapper');
        var orderDetail = parent.find('.order-detail');
          orderDetail.slideToggle();
});

    $('#save-btn').click(function() {
        var telephone = $('#user-telephone').val();
        var name = $('#user-name').val();
        var profileUserName = $('#profile-user-name').text();
        if (name !== '') {
            if (validateCurrentUser()) {
                var currentUser = Parse.User.current();
                currentUser.set('Nombre', $('#user-name').val());
                currentUser.set('Telefono', $('#user-telephone').val());
                if (currentUser.save()) {
                    if (name !== profileUserName) {
                        $('#profile-user-name').text(name);
                    }

                    alert('Datos actualizados con éxito');
                }
            }
        } else {
            alert('Nombre no puede estar vacío');
        }
    });



    $('html').on('click', '.delete-address', function(event) {
        var id = $(event.target).parents('.element-wrapper').find('.address-id').text();
        var r = confirm("¿Estás seguro que quieres eliminar esta dirección?");
        if (r) {
            var Address = Parse.Object.extend("Address");
            var query = new Parse.Query(Address);

            query.get(id, {
                success: function(address) {
                    address.set("Activo", false);
                    address.save(null, {
                        success: function(address) {
                            var address = $(event.target);
                            address.parents('.element-wrapper').remove();


                            $("body, html").animate({
                                scrollTop: $($('#container-address')).offset().top
                            }, 1000);

                            alert("Dirección eliminada con éxito");


                        },
                        error: function(object, error) {}
                    });
                },
                error: function(object, error) {
                    console.log(error);
                }
            });
        }
    });

    $('html').on('click', '.rate-order-btn', function(event) {
        var orderId = $(event.target).parents('.element-wrapper').find('.order-id').text();
        $('#order-id').text(orderId);
        $('#order-comment').val('');
        $('#order-rating-container').plainModal('open', {
            duration: 500
        });
    });

    $('#send-rate').click(function(){
        $('#order-rating-container').css('cursor', 'progress');
        var orderId = $('#order-id').text();

            var Order = Parse.Object.extend("Order");
            var query = new Parse.Query(Order);
            query.equalTo("objectId",orderId);
            query.first({
                success: function(order){

            order.set("Comida",1);
            order.set("PrecioCalidad",2);
            order.set("Presentacion",3);
            order.set("TiempoEntrega",4);
            order.set("Comentario",$('#order-comment').val());

                        order.save(null,{
                success: function(object){
                     $('#order-rating-container').plainModal('close');
                    alert("Calificación enviada. Muchas gracias por ayudarnos a mejorar!");
                   
                
                 

                },
                error: function(object,error){

                }
                
            });

$('#order-rating-container').css('cursor', 'default');
                },
                error: function(){

  $('#order-rating-container').css('cursor', 'default');
                }




            });
    });

    $('#save-new-address-btn').click(function() {
        var geoPoint = getGeoPoint();
        var description = $('#user-new-address-details').val();
        if (geoPoint !== null) {
            if (description === "") {
                alert('Por favor añade más detalles de tu dirección de entrega. Sé lo más descriptivo posible...');
            } else {
                var location = new Parse.GeoPoint();
                location.latitude = geoPoint.latitude;
                location.longitude = geoPoint.longitude;
                var Address = Parse.Object.extend("Address");
                var newAddress = new Address();
                newAddress.set("Cliente", Parse.User.current());
                newAddress.set("Coordenada", location);
                newAddress.set("Descripcion", $('#geocomplete').val() + ". " + description);
                newAddress.set("Activo", true);
                newAddress.save(null, {
                    success: function(newAddress) {
                        $('#user-new-address-details, #geocomplete').val("");
                        loadAddress();
                        $("body, html").animate({
                            scrollTop: $($('#container-address')).offset().top
                        }, 1000);

                    },
                    error: function(object, error) {

                    }
                });
            }
        }
    });
});