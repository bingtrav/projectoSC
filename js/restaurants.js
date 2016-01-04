$(document).ready(function() {

    var currentLocation = new Parse.GeoPoint();
    currentLocation.latitude = -23.545412;
    currentLocation.longitude = -46.609135;




    var restTemp = _.template($("script.restaurants-template").html());
    var filTemp = _.template($("script.filters-template").html());

    //setGoogleMapsMarkers(currentLocation.latitude, currentLocation.longitude, '<span>Holis</span>');

    var loading = true;
    var loadedRestaurants = 0;
    var locations = [];
    var restaurantList = [];

    getRestaurantList(20, 0, false);

    function getRestaurantList(limit, skip, async) {
        var Restaurant = Parse.Object.extend("Restaurant");
        var query = new Parse.Query(Restaurant);
        query.include("Direccion");
        query.limit(limit);
        query.skip(skip);
        query.withinMiles("Coordenada", currentLocation, 3.11);
        query.find({
            success: function(list) {
                $('.loader').remove();
                if(list.length>0){
                loadedRestaurants+= list.length;
                loading = false;
                updateFilterQuantity(loadedRestaurants);
                $("#restaurants-list").append(restTemp({restaurants: list}));
                $.each(list,function(i,r){
                    restaurantList.push(r);
                    setRestaurantFoodTypes(r);
                    setIndividualRating(r.get("CalificacionGeneral"),r.get("ID"));
                    setDistance(r.get("Coordenada").kilometersTo(currentLocation),r.get("ID"));
                });
            }
            
            },
            error: function(object, error) {
                alert(error);
            }
        });
    }


function setDistance(distanceKm,id){
    var distance = "";
                    if (distanceKm < 1) {
                        distanceMts = distanceKm * 1000;
                        distance = distanceMts.toFixed() + "mts";
                    } else {
                        distance = distanceKm.toFixed(1) + "Km";
                    }
                     $('#'+id).find('.distance').text(distance);
}


function setIndividualRating(rating,id){
  
    var point = false;
    var tag = '.general-rating';
   if(String(rating).length==3){
        point = true;
    }
     var current = $('.restaurant2');

         if (rating === 0.5) {
         $('#'+id).find('.empty').first().removeClass('empty','fa-star').addClass('fa-star-half-o');
    } else {
        rating = parseInt(String(rating).substring(0, 1));
        for (var i = 0; i < rating; i++) {
          $('#'+id).find('.empty').first().removeClass('empty');
        }
        if(point){
        $('#'+id).find('.empty').first().removeClass('empty','fa-star').addClass('fa-star-half-o');
        }
    }
}


    var currentFoodTypes = [];

    function setRestaurantFoodTypes(currentRestaurant) {
        var FoodTypes = Parse.Object.extend("TypesXRestaurant");
        var query = new Parse.Query(FoodTypes);
        query.include("RestaurantType");
        query.equalTo("Restaurant", currentRestaurant);
        query.find({
            success: function(list) {
                $.each(list, function(k, item) {
                    var type = item.get("RestaurantType").get("Tipo");
                    var id = item.get("RestaurantType").id;
                    var current = $('#' + currentRestaurant.get("ID"));
                    if (currentFoodTypes.length === 0 || currentFoodTypes.indexOf(String(id)) === -1) {
                        currentFoodTypes.push(String(id));
                        $('.filter-options').append(' <input type="checkbox" class="filter" id="' + type.toLowerCase() + '">' + type);

                    }
                    current.addClass(type.toLowerCase());
                });
                restaurantsList = $('.restaurant2');
            },
            error: function(object, error) {
                alert(error);
            }
        });




    }


    $('html').on('click', '.restaurant2', function(event) {
        var restaurant = $(event.target);
        var url = "menu.html?r=" + restaurant.parents('.restaurant2').attr('id');
       window.location.href = url;

    });

       /** $('html').on('mouseover', '.restaurant2', 
            function(event) {
                var restaurant = $(this);
                restaurant.find('div.details').show(1000);
            });**/

              /**  $('html').on('mouseleave', '.restaurant2', 
            function(event) {
                var restaurant = $(this);
                restaurant.find('div.details').addClass('no-show');
            });**/


    $('#search-restaurant').on('input', function() {
        $('.fa-column').addClass('green-bg');
        $('.fa-search').removeClass('gray').addClass('white');
        var text = $('#search-restaurant').val().trim().toLowerCase();
        $('.restaurant-name').each(function(k, v) {
            if ($(this).text().trim().toLowerCase().search(text) == -1) {
                $(this).parents('.restaurant2').fadeOut(150, function() {
                    updateFilterQuantity($('.restaurant2').filter(function() {
                        return $(this).css('display') !== 'none';
                    }).size());

                });
            } else {
                $(this).parents('.restaurant2').fadeIn(1000);
            }
            //}
        });
        if ($('#search-restaurant').val().trim() === '') {
            updateFilterQuantity(loadedRestaurants);
        }


    });




    $('html').on('click', '.filter', function(event) {
        var filters = $('input:checked');
        if (filters.length !== 0) {
            $.each(restaurantsList, function(i, r) {
                var restaurant = $(this);
            
                var state = false;
                var ind = i;
                $.each(filters, function(i, f) {
                    if ((restaurant).hasClass($(f).attr('id'))) {

                        restaurant.fadeIn(1000);
                        state = true;


                    } else {
                        if (!state) {
                            restaurant.fadeOut(150, function() {
                                updateFilterQuantity($('.restaurant').filter(function() {
                                    return $(this).css('display') !== 'none';
                                }).size());
                            });
                        }
                    }
                });
            });
        } else {
            $('.restaurant').fadeIn(1000, function() {
                updateFilterQuantity(loadedRestaurants);
            });

        }
    });


    function updateFilterQuantity(quantity) {
        var text = "restaurantes encontrados";
        if (quantity === 1) {
            text = "restaurante encontrado";
        }
        $('#restaurant-quantity').text((quantity) + ' ' + text);
    }


    $('#search-restaurant').focusout(function() {

        if ($('#search-restaurant').val() === "") {
            $('.fa-column').removeClass('green-bg');
            $('.fa-search').removeClass('white').addClass('gray');
        }
    });


    $('.filter-element').click(function() {


        var icon = $(this).find('i');

        if (icon.hasClass('fa-caret-down')) {
            icon.removeClass('fa-caret-down').addClass('fa-caret-up');
        } else {
            icon.removeClass('fa-caret-up').addClass('fa-caret-down');
        }
        $('.filter-options').slideToggle();

    });


    $('.restaurant').hover(function() {
        $(this).find('.btn-order').slideToggle(300, function() {

            if ($(this).is(':visible')) {
                $(this).css({
                    "display": "flex",
                    "align-items": "center"
                });
            }


        });

    });


     $('html').on('click', '.filter', function(event) {
        var filters = $('input:checked');
        if (filters.length !== 0) {
            $.each(restaurantsList, function(i, r) {
                var restaurant = $(this);
                var state = false;
                var ind = i;
                $.each(filters, function(i, f) {
                    if ((restaurant).hasClass($(f).attr('id'))) {
                        restaurant.fadeIn(1000);
                        state = true;
                    } else {
                        if (!state) {
                            restaurant.fadeOut(150, function() {
                                updateFilterQuantity($('.restaurant2').filter(function() {
                                    return $(this).css('display') !== 'none';
                                }).size());
                            });
                        }
                    }
                });
            });
        } else {
            $('.restaurant2').fadeIn(1000, function() {
                updateFilterQuantity(loadedRestaurants);
            });

        }
    });




    $(window).scroll(function() {
        if (!loading && $('#search-restaurant').val().trim() === '') {
            var totalHeight = $('.container').height();
            var toTop = $(window).scrollTop() - 125;
            var current = $(window).height();
            if (totalHeight <= toTop + current) {
                $('.restaurants-list').append('<div class="row loader"><div class="col2"><img src="img/icons/loader.gif" class="text-center"></div></div>');
                loading = true;
            
                getRestaurantList(3, loadedRestaurants, true);
            }
        }
    });







});









































































