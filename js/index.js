$(document).ready(function() {


/**
var input = document.getElementById('geocomplete');
var options = {componentRestrictions: {country: 'cr'}};
    
new google.maps.places.Autocomplete(input, options);


   
        
        $("#btn_buscar").click(function(){
          $("#geocomplete").trigger("geocode");
        });**/

  var places = [
  {
    id:"1",
    value:"Grecia centro"
  },
  {
    id:"2",
    value:"Rincón de Arias, Grecia"
  },
  {
    id:"3",
    value:"Altos de Peralta, Grecia"
  },
  {
    id:"4",
    value:"San Roque, Grecia"
  },
  {
    id:"5",
    value:"La Argentina, Grecia"
  },
  {
    id:"6",
    value:"Calle Peter's, Rincón de Arias, Grecia"
  }, 
  {
    id:"7",
    value:"Calle Alameda, Rincón de Arias, Grecia"
  }

  ];


    $( "#geocomplete" ).autocomplete({
      source: places
    });


/**$('#geocomplete').focus(function(){
$(this).text('');

});

$('.address-bar').focusout(function(){
  if($(this).text() === ('')){

$(this).text('Digita tu dirección...');
  }
});**/

/**$('.menu-responsive').click(function(){


$('.main-nav').slideToggle(400,function(){
$(this).toggleClass('nav-expanded').css('display','');
});

});**/


$('#order-now-btn').click(function(){
                $("body, html").animate({
                    scrollTop: $($('html')).offset().top
                }, 5000);
});

   $('#fullpage').fullpage({



        //events
    onLeave: function(index, nextIndex, direction){

  	var leavingSection = $(this);
    if(index == 1 && direction =='down'){
$('.main-nav').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0},1000);
}else if(index == 2 && direction =='up'){
$('.main-nav').css('visibility','invisible');
}


        },
        afterLoad: function(anchorLink, index){},
        afterRender: function(){},
        afterResize: function(){},
        afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex){},
        onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex){}




   });
      


});

