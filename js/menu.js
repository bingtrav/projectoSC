$(document).ready(function() {


    var mb = new MobileDetect(window.navigator.userAgent);


    var restTemp = _.template($("script.restaurant-template").html());

    var loadedProducts = {};


    setRestaurantInformation();

        var Order = Parse.Object.extend("Order");
        var query = new Parse.Query(Order);

    /** HELP METHODS **/

    function getClickedRestaurantID() {
        return parseInt(window.location.search.substring(3));
    }

    $('.back-button').click(function() {

        var url = "restaurantes.html";
        window.location.href = url;

    });
    /**

    $('.back-button').find('span').mouseover(function(){

    $(this).css('font-weight','bold');

    });

    $('.back-button').find('span').mouseout(function(){

    $(this).css('font-weight','normal');

    });**/


    function setRestaurantItems(currentRestaurant) {

        var Product = Parse.Object.extend("Product");
        var query = new Parse.Query(Product);
        query.equalTo("Restaurante", currentRestaurant);
        query.include("Grupo");
        query.find({
            success: function(results) {
                if (results.length > 0) {
                    var map = {};
                    for (var i = 0; i < results.length; i++) {
                        var object = results[i];

                        var key = object.get("Grupo").get('Nombre');

                        if (key in map) {
                            var list = map[key];
                            list.push(object);
                            map[key] = list;
                        } else {
                            var list = [object];
                            map[key] = list;
                        }

                    }


                    setProductList(map);

                }

            },
            error: function(error, object) {}
        });


    }

    function setRestaurantInformation() {
        var Restaurant = Parse.Object.extend("Restaurant");
        var query = new Parse.Query(Restaurant);
        query.include("Direccion");
        query.equalTo("ID", getClickedRestaurantID());
        query.first({
            success: function(restaurant) {


              $("#restaurant-profile").append(restTemp({restaurant:restaurant}));
                setRestaurantTime(restaurant);
                setIndividualRating(restaurant.get("Comida"), '#food-rating');
                setIndividualRating(restaurant.get("PrecioCalidad"), '#price-rating');
                setIndividualRating(restaurant.get("Presentacion"), '#presentation-rating');
                setIndividualRating(restaurant.get("Tiempo"), '#time-rating');
                
                setRestaurantItems(restaurant);
                $('.restaurant-name').text(restaurant.get("Nombre"));
                var restaurantMin = restaurant.get("OrdenMinima");
                $('#restaurant-min').text(restaurantMin);
                restaurantDelivery = restaurant.get("CostoDelivery");
                store.set('delivery',restaurantDelivery);
                if (restaurantDelivery == 0) {
                    $('#restaurant-delivery').text("Gratis");
                } else {
                    $('#restaurant-delivery').text("₡" + restaurantDelivery);
                    $('.restaurant-delivery-checkout').text(restaurantDelivery);
                    $('.order-total').text(restaurantDelivery);
                }

                setRestaurantSchedule(restaurant);

            },
            error: function(object, error) {
                console.log(error);
            }
        });
    }

    function setRestaurantSchedule(restaurant) {
        var RS = Parse.Object.extend("RestaurantSchedule");
        var query = new Parse.Query(RS);
        query.equalTo("Restaurante", restaurant);
        query.first({
            success: function(schedule) {
                $('.sunday').text(schedule.get("Domingos").substring(0, 5) + ' - ' + schedule.get("Domingos").substring(8, 14));
                $('.monday').text(schedule.get("Lunes").substring(0, 5) + ' - ' + schedule.get("Lunes").substring(8, 14));
                $('.tuesday').text(schedule.get("Martes").substring(0, 5) + ' - ' + schedule.get("Martes").substring(8, 14));
                $('.wednesday').text(schedule.get("Miercoles").substring(0, 5) + ' - ' + schedule.get("Miercoles").substring(8, 14));
                $('.thursday').text(schedule.get("Jueves").substring(0, 5) + ' - ' + schedule.get("Jueves").substring(8, 14));
                $('.friday').text(schedule.get("Viernes").substring(0, 5) + ' - ' + schedule.get("Viernes").substring(8, 14));
                $('.saturday').text(schedule.get("Sabados").substring(0, 5) + ' - ' + schedule.get("Sabados").substring(8, 14));
            },
            error: function(object, error) {

            }
        });
    }

    function setIndividualRating(rating, tag) {
        var point = false;
        if (String(rating).length == 3) {
            point = true;
        }
        var current = $('.restaurant');

        if (rating === 0.5) {
            //current.find('.fa-star').first().remove();
            //current.find('.restaurant-rating').prepend('<i class="fa fa-star-half-o"></i>');
            $(tag).find('.empty').first().removeClass('empty', 'fa-star').addClass('fa-star-half-o');
        } else {
            rating = parseInt(String(rating).substring(0, 1));
            for (var i = 0; i < rating; i++) {
                $(tag).find('.empty').first().removeClass('empty');
                // current.find('.restaurant-rating').prepend('<i class="fa fa-star"></i>');
            }
            if (point) {
                $(tag).find('.empty').first().removeClass('empty', 'fa-star').addClass('fa-star-half-o');
            }
        }
    }



    /**function setRestaurantRating(currentRestaurant) {
        setIndividualRating(currentRestaurant.get("PrecioCalidad"),'price-rating');
        setIndividualRating(currentRestaurant.get("Comida"),'food-rating');
        setIndividualRating(currentRestaurant.get("Tiempo"),'time-rating');
        var ratingsNumber = currentRestaurant.get("Avaliaciones");
        if( ratingsNumber=== 1){
    $('#rating-number').text(ratingsNumber+" avaliación");
        }else{
            $('#rating-number').text(ratingsNumber+" avaliaciones");
        }

        var point =false;
        if(String(priceRating).length==3){
            point = true;
        }
        var current = $('.restaurant');
        if ( priceRating === 0.5) {
            //current.find('.fa-star').first().remove();
            //current.find('.restaurant-rating').prepend('<i class="fa fa-star-half-o"></i>');
             current.find('#price-rating').find('.empty').first().removeClass('empty','fa-star').addClass('fa-star-half-o');
        } else {
            priceRating = parseInt(String(priceRating).substring(0, 1));
            for (var i = 0; i < priceRating; i++) {
              current.find('#price-rating').find('.empty').first().removeClass('empty');
               // current.find('.restaurant-rating').prepend('<i class="fa fa-star"></i>');
            }
            if(point){
            current.find('#price-rating').find('.empty').first().removeClass('empty','fa-star').addClass('fa-star-half-o');
            }
        }
    }**/




    function setProductList(map) {
        $.each(map, function(group, productList) {
            var html = '<div class="row products-header cursor"><div class="col11"><b><span class="product-group red">' + group + '</span></b></div><div class="col1"><i class="fa fa-chevron-down cursor red"></i></div></div><div class="products-group">';
            for (var i = 0; i < productList.length; i++) {
                var product = productList[i];
                loadedProducts[product.id] = product;
                html += '<div class="row product" id="' + product.id + '"><span class="no-show short-name">' + product.get("NombreReducido") + '</span><div class="col2 icon"><img  alt="Foto del plato" title="Click para ver fotos del plato" class="cursor" id="product-img" src="img/products/' + product.get("ID") + '.jpg"></div><div class="col7 description"><b><span class="product-name">' + product.get("Nombre") + '</span></b></br><span class="product-description">' + product.get("Descripcion") + '</span></div><div class="col2 info"><span></span></br>₡<span id="product-price">' + product.get("PrecioUnitario") + '</span></br> <i class="fa fa-plus-circle fa-2x cursor btnAddToCard" style="color:#339933" title="Añadir a la orden"></i></div></div>';
            }
            $('.products-list').prepend(html + '</div>');
            if(mb.mobile()){
                $('.products-header').find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
                 $('.products-group').hide();
                    $('.products-list').find('.btnAddToCard').removeClass('fa-2x').addClass('fa-3x');
                       var html = '</br>'+$('.order-container').html();
                      $('.order-container-mobile').html('').html(html);
            }
        });
    }



$('html').on('click','.btn-continue-order',function() {
           if(Parse.User.current()){
        $('.menu-container').animate({'left':'-66.66667%','opacity':0},1000,function(){
            $(this).addClass('no-show');
        });
        $('.order-container').animate({'left':'0'},1000);
        $('.btn-continue-order').addClass('no-show');
        $('.fa-plus-circle,.fa-minus-circle').css('display','none');
         $('.btn-edit-order').removeClass('no-show');
         $('.title div,.order-type').animate({'height':0},function(){
            $(this).addClass('no-show');
         });
        $('.order-checkout-container').removeClass('no-show').animate({'left':'33.33333%','opacity':100},1000);
    }else{
        alert('Debe loguearse para continuar!');
    }
    });

  $('.btn-edit-order').click(function() {
            $('.menu-container').removeClass('no-show').animate({'left':'0','opacity':100},1000);
        $('.order-container').animate({'left':'66.66667%'},1000);
        $('.btn-edit-order').addClass('no-show');
         $('.fa-plus-circle,.fa-minus-circle').css('display','inline-block');
         $('.btn-continue-order').removeClass('no-show');
         $('.title div').removeClass('no-show');
                  $('.title div,.order-type').removeClass('no-show').animate({'height':'40px'});
        $('.order-checkout-container').animate({'left':'100%','opacity':0},1000,function(){
            $(this).addClass('no-show');
        });

  });


    var currentOrderItems = {};
    $('html').on('click', '.btnAddToCard', function(event) {
         var temp = $(event.target).closest('.product');
        /**var product = loadedProducts[temp.attr('id')];
        var id = temp.attr('id');
        var name = temp.find('.short-name').text();
        if (currentOrderItems.length === 0 || currentOrderItems[id] === undefined) {
        var OrderDetail = Parse.Object.extend("OrderDetail");
        var orderItem = new OrderDetail();
        orderItem.set("Producto",product);
        orderItem.set("Cantidad",1);
        orderItem.set("PrecioUnitario",product.get("PrecioUnitario"));
            $('.empty').hide();
           currentOrderItems[id] = orderItem;
            $('.order-items').append('<div class="row order-item" id="op_' + id + '"><div class="col6"> <span id="item-name">' + name + '<span></div><div class="col3"> <i class="fa fa-minus-circle cursor itemCartQuantity" style="color:#b71c1c" title="Remover uno"></i><span id="item-quantity">1</span><i class="fa fa-plus-circle cursor itemCartQuantity" style="color:#339933" title="Añadir uno más"></i></div><div class="col3">₡<span id="item-price">' + product.get("PrecioUnitario") + '</span></div></div>');
        } else {
           var element = $('#op_' + id).find('#item-quantity');
           var orderItem = currentOrderItems[id];
           var quantity = orderItem.get("Cantidad") + 1;
           orderItem.set("Cantidad",quantity);
            element.text(orderItem.get("Cantidad"));
        }
        updateOrderInformation('add', currentOrderItems[id].get("PrecioUnitario"));
        store.set('currentCart',currentOrderItems);**/
        addToCard(temp);
    });

function addToCard(temp){
        var product = loadedProducts[temp.attr('id')];
        var id = temp.attr('id');
        var name = temp.find('.short-name').text();
        if (currentOrderItems.length === 0 || currentOrderItems[id] === undefined) {
        var OrderDetail = Parse.Object.extend("OrderDetail");
        var orderItem = new OrderDetail();
        orderItem.set("Producto",product);
        orderItem.set("Cantidad",1);
        orderItem.set("Orden",null);
        orderItem.set("PrecioUnitario",product.get("PrecioUnitario"));
            $('.order-items .empty').first().hide();
           currentOrderItems[id] = orderItem;
            $('.order-items').first().append('<div class="row order-item" id="op_' + id + '"><div class="col6"> <span id="item-name">' + name + '<span></div><div class="col3"> <i class="fa fa-minus-circle cursor itemCartQuantity" style="color:#b71c1c" title="Remover uno"></i><span id="item-quantity">1</span><i class="fa fa-plus-circle cursor itemCartQuantity" style="color:#339933" title="Añadir uno más"></i></div><div class="col3">₡<span id="item-price">' + product.get("PrecioUnitario") + '</span></div></div>');
        } else {
           var element = $('#op_' + id).first().find('#item-quantity');
           var orderItem = currentOrderItems[id];
           var quantity = orderItem.get("Cantidad") + 1;
           orderItem.set("Cantidad",quantity);
            element.text(orderItem.get("Cantidad"));
        }
        updateOrderInformation('add', currentOrderItems[id].get("PrecioUnitario"));
        store.set('currentCart',currentOrderItems);
  

}

 $('html').on('click', '.itemCartQuantity', function(event) {
        var item = $(event.target).closest('.order-item');
        id = item.attr('id').substring(3);
        var orderItem = currentOrderItems[id];
        var element = item.find('#item-quantity');
        if ($(this).hasClass('fa-minus-circle')) {
            var quantity = orderItem.get("Cantidad") - 1;
            if (quantity === 0) {
                item.remove();
               delete currentOrderItems[id];
            } else {
                orderItem.set("Cantidad",quantity);
                element.text(orderItem.get("Cantidad"));
            }
            updateOrderInformation('subtract',orderItem.get("PrecioUnitario"));
        } else {
            var quantity = orderItem.get("Cantidad");
            orderItem.set("Cantidad",quantity+1);
            element.text(orderItem.get("Cantidad"));
            updateOrderInformation('add', orderItem.get("PrecioUnitario"));
        }
        store.set('currentCart',currentOrderItems);
    });


$('html').on('click','.order-type div', function(event) {
        var delivery = restaurantDelivery;
        if ($(this).is(':first-child')) {
            if (!$(this).hasClass('selected')) {
                $('.order-checkout-steps').addClass('no-show');
                $('.order-checkout-container p').removeClass('no-show');
                store.set('delivery',0);
                $(this).addClass('selected');
                $(this).find('i').css({
                    'display': 'inline-block'
                });
                $(this).css({
                    'background-color': '#E9E9E9'
                });
                $('.order-type').find('.delivery').css({
                    'background-color': 'white'
                }).removeClass('selected');
                $('.order-type').find('.delivery i').css({
                    'display': 'none'
                });
                $('.order-total').text(parseInt($('.order-total').first().text()) - delivery);
                $('.restaurant-delivery-checkout').text('0');
            }
        } else {
            if (!$(this).hasClass('selected')) {
                $('.order-checkout-steps').removeClass('no-show');
                $('.order-checkout-container p').addClass('no-show');
                store.set('delivery',restaurantDelivery);
                $(this).addClass('selected');
                $(this).find('i').css({
                    'display': 'inline-block'
                });
                $(this).css({
                    'background-color': '#E9E9E9'
                });
                $('.order-type').find('.pickup').css({
                    'background-color': 'white'
                }).removeClass('selected');
                $('.order-type').find('.pickup i').css({
                    'display': 'none'
                });
                $('.order-total').text(parseInt($('.order-total').first().text()) + delivery);
                 $('.restaurant-delivery-checkout').text(restaurantDelivery);
            }
        }
    });

    function updateOrderInformation(type, value) {
        var subtotal = $('.order-subtotal').first();
        var total = $('.order-total').first();
        if (type === 'add') {
            subtotal.first().text(parseInt(subtotal.first().text()) + value);
            total.first().text(parseInt(total.first().text()) + value);
        } else {
            subtotal.first().text(parseInt(subtotal.first().text()) - value);
            total.first().text(parseInt(total.first().text()) - value);
        }
    }

   
   

   
   
   

    var scheduleVisible = false;
    $('html').on('click', '#restaurant-schedule', function() {

var element =  $('.restaurant-schedule');
var qty = 90;
  if(mb.mobile()){
      qty = 175;
      element = $('.restaurant-schedule-mobile');
  }

        if (!scheduleVisible) {
            scheduleVisible = true;
            var height = $('.restaurant-profile').height() + qty;
        } else {
            scheduleVisible = false;
              var height = $('.restaurant-profile').height() - qty;
        }
    
            $('.restaurant-profile').animate({
                height: height
            }, 350);
          element.slideToggle(350);   
    });

    //$('.products-header').click(function() {
    $('html').on('click', '.products-header', function() {
        var temp = $(this).find('i');
        var current = $(this);
        if (temp.hasClass('fa-chevron-down')) {
            current.next('.products-group').hide('slow');
            temp.removeClass('fa-chevron-down').addClass('fa-chevron-right');
        } else {
            current.next('.products-group').show('slow');
            temp.removeClass('fa-chevron-right').addClass('fa-chevron-down');
        }

    });



    $('#search-restaurant').on('input', function() {

        var text = $('#search-restaurant').val().trim().toLowerCase();
        $('.restaurant-name').each(function() {
            if ($(this).text().trim().toLowerCase().search(text) == -1) {
                $(this).parents('.restaurant').fadeOut(150);
            } else {
                //$(this).parents('.restaurant').css('display','flex');
                $(this).parents('.restaurant').fadeIn(1000);
            }
        });


    });

    $('#restaurant-schedule').click(function() {



    });

    $(".filter-element .filter").click(function(e) {
        e.stopPropagation();
    });

    $('.filter-element').click(function() {
        $(this).find('.clearfix').slideToggle(350, function() {

            if ($(this).is(':visible')) {
                $(this).css({
                    "display": "flex",
                    "align-items": "center"
                });
            }
        });

    });


$('html').on('dblclick','.product',function(event){
     var temp = $(event.target).closest('.product');
     addToCard(temp);


});



$('.btn-order').click(function(){

var delivery = store.get("delivery");
    var currentUser = Parse.User.current();
        var Order = Parse.Object.extend("Order");
        var newOrder = new Order();
        var OrderState = Parse.Object.extend("OrderState");
        var state = new OrderState();
        state.set("objectId","LaFoZuSky7");
        newOrder.set("Comentario","");
        newOrder.set("FechaPedido",new Date());
        console.log(new Date());
        newOrder.set("PagoLlegada",false);
        newOrder.set("PagoOnline",false);
        newOrder.set("PrecioDelivery",delivery);
        newOrder.set("Cliente",currentUser);
        newOrder.set("Estado",state);
        var total = 0;
    
    var items = store.get('currentCart');

    $.each(items,function(i,v){
        total+= (v.PrecioUnitario * v.Cantidad);
        console.log(v);
    });

      newOrder.set("Total",(total+delivery));

      newOrder.save(null,{
        success: function (object){

            var orderDetails = [];
        

        $.each(items,function(i,v){
            var OrderDetail = Parse.Object.extend("OrderDetail");
        var orderItem = new OrderDetail();
           orderItem.set("PrecioUnitario",v.PrecioUnitario);
           orderItem.set("Orden",newOrder);
           orderItem.set("Cantidad",v.Cantidad);
           orderItem.set("Producto",v.Producto);
           orderDetails.push(orderItem);
        });

         Parse.Object.saveAll(orderDetails, {
        success: function(objs) {
            console.log(objs);
        },
        error: function(error) { 
            // an error occurred...
             console.log("Error");
        }
    });



        },

        error: function(object,error){
            console.log(object);
            console.log(error);

        }

      });

});

    $('.restaurant2').hover(function() {


        $(this).find('.btn-continue-order').slideToggle(300, function() {

            if ($(this).is(':visible')) {
                $(this).css({
                    "display": "flex",
                    "align-items": "center"
                });
            }


        });

    });
    
});
