$(document).ready(function() {

   var location = new Parse.GeoPoint();
    location.latitude = 0;
    location.longitude = 0;




$('#exit-btn').click(function(){
        if (validateCurrentUser()) {
            Parse.User.logOut();
                        $('.register-nav').removeClass('no-show');
            $('.profile-nav').addClass('no-show');
        }
});

$('.profile-nav').click(function(){
       window.location.href = "perfil.html";

});

$('.profile-nav').hover(function(){
    
$('.profile-nav-options').removeClass('no-show');
},
function(){
$('.profile-nav-options').addClass('no-show');
});


    });

setProfileNav();

    function validateCurrentUser() {
        if (Parse.User.current()) {
            return true;
        }
        return false;
    }


    function setProfileNav(){
        if(validateCurrentUser()){
            currentUser = Parse.User.current();
            $('.profile-nav').find('img').attr('src','img/users/'+currentUser.id+'.jpg');
            $('.profile-nav').find('span').text(currentUser.get("Nombre"));
            $('.register-nav').addClass('no-show');
            $('.profile-nav').removeClass('no-show');

        }
    }




function setAutocomplete(){


var input = document.getElementById('geocomplete');
var options = {componentRestrictions: {country: 'cr'}};    
var result = new google.maps.places.Autocomplete(input, options);
google.maps.event.addListener(result, 'place_changed', function () {
            var place = result.getPlace();
              location.latitude = place.geometry.location.lat();
              location.longitude =  place.geometry.location.lng();
        });


}

function getGeoPoint(){
    if(location.latitude!==0 && location.longitude!==0){
        return location;
    }
    return null;
}


function setRestaurantTime(currentRestaurant) {

    var RestaurantSchedule = Parse.Object.extend("RestaurantSchedule");
    var query = new Parse.Query(RestaurantSchedule);
    query.equalTo("Restaurante", currentRestaurant);
    query.first({
        success: function(object) {
            var day = getDay();

            var time = object.get("" + day);
            var closingTime = time.substring(9, 17);
            var openingTime = time.substring(0, 8);

            if (getCurrentTimeState(closingTime, openingTime)) {
                $('#' + currentRestaurant.get("ID")).find('.schedule-text').text('').removeClass('red').addClass('green').text('Abierto');
            } else {
                $('#' + currentRestaurant.get("ID")).find('.schedule-text').text('').removeClass('green').addClass('red').text('Cerrado');
            }


        },
        error: function(error, object) {}
    });
}



function getDay() {

    var date = new Date();

    var dayValue = "";
    switch (date.getDay()) {

        case 5:
            dayValue = "Viernes";
            break;

        case 6:
            dayValue = "Sabados";
            break;

        case 1:
            dayValue = "Lunes";
            break;

             case 2:
            dayValue = "Martes";
            break;

             case 3:
            dayValue = "Miercoles";
            break;

             case 4:
            dayValue = "Jueves";
            break;

         

        case 0:
            dayValue = "Domingos";
            break;


    }

    return dayValue;
}


function getCurrentTimeState(closingTime, openingTime) {

    var date = new Date();
    var hour = date.getHours() + "";
    if (hour.length == 1) {

        hour = "0" + date.getHours();
    }
    var currentTime = hour + ':' + date.getMinutes() + ':' + date.getSeconds();



    if (currentTime >= openingTime && closingTime > currentTime) {
        return true;
    }
    return false;

}
