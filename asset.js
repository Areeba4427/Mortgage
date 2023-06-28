var flag = 0;
function n(evt) {
  evt = evt ? evt : window.event;
  var charCode = evt.which ? evt.which : evt.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }

  return true;
}

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});


function addCommasToValue(inputField) {
  let value = inputField.value.replace(/,/g, "");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas to the value
  inputField.value = value;
}

function addCommasToValuetwo(inputField) {
  let value = inputField.replace(/,/g, "");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // add commas to the value
  return value;
}

function removecomma(value) {
  value = value.replace(/,/g, ""); //to remove .
  return parseInt(value);
}

function setValue(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) element.value = addCommasToValuetwo(value);
}

function settext(elementId, value) {
  var element = document.getElementById(elementId);
  if (element) element.textContent = addCommasToValuetwo(value);
}

slider1 = document.getElementById("range1");
slider2 = document.getElementById("range2");
slider3 = document.getElementById("range3");
slider4 = document.getElementById("range4");

function setSliderBackground(slider) {
  var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background =
    "linear-gradient(to right, #0CBDDC 0%, #0CBDDC " +
    value +
    "%, #ccc " +
    value +
    "%, #ccc 100%)";
}

function setupSlider(slider, targetId, prefix = "", suffix = "") {
  slider.addEventListener("input", function () {
    var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background =
      "linear-gradient(to right, #0CBDDC 0%, #0CBDDC " +
      value +
      "%, #ccc " +
      value +
      "%, #ccc 100%)";
    setValue(targetId, prefix + slider.value + suffix);

  });
}

window.onload = function () {
  setSliderBackground(slider1);
  setSliderBackground(slider2);
  setSliderBackground(slider3);
  setSliderBackground(slider4);
};

// Usage
setupSlider(slider1, "input_value", "£");
setupSlider(slider2, "input_down_payment" , "£");
setupSlider(slider3, "input_interest", "", "%");
setupSlider(slider4, "input_duration");


function calculate(){
  
  var data=[];
  
  var dataBalance=[];
  var dataPaidInterest=[];
  var dataPrincipal=[];
  
  
  var value = parseInt(
    $("#input_value").val().replace("£", "").replace(",", "").replace(",", "")
  );
  
  var downPayment = parseInt(
    $("#input_down_payment").val().replace("£", "").replace(",", "").replace(",", "")
  );

  var l = value-downPayment;
  
  var interest = parseInt(
    $("#input_interest").val().replace("%", "").replace(",", "").replace(",", "")
  );
  if ($("#interest_option").val()=="Yearly"){
    var r = (interest/100)/12;
  }else if($("#interest_option").val()=="Monthly"){
    var r = interest/100;
  } 
  
  var duration = parseInt(
    $("#input_duration").val().replace("£", "").replace(",", "").replace(",", "")
  );

    if ($("#term_option").val()=="Years"){
    var n = duration*12;
  }else if($("#term_option").val()=="Months"){
    var n = duration;
  } 

  console.log(interest , duration , downPayment , value);
/*---- Basic Monthly Payment Calcutation  ----*/
  
  var P = l*r/ ( 1- Math.pow(1+r,-n) );
 
  /*---- Producing results in Card ----*/
 
  document.getElementById("debt").textContent = formatter.format(l);
  document.getElementById("monthly_rate").textContent = (Math.round(r * 100 * 100) / 100) + "%";
  document.getElementById("payment_periods").textContent = formatter.format(n);
  document.getElementById("repayment").textContent = formatter.format(Math.round(P * 100) / 100);
  document.getElementById("total").textContent = formatter.format(Math.round(P * n * 100) / 100);
  document.getElementById("interest").textContent = formatter.format(Math.round((P * n - l) * 100) / 100);


}

$('#subscribe').click(function(){     
  document.getElementById("popup").style.display = 'none';
  
});


$('#calculate').click(function(){
  // Check if the popup has already been shown
  if (!localStorage.getItem('popupShown')) {
    // Show the popup
    document.getElementById("popup").style.display = 'block';
    
    // Set the flag in local storage to indicate the popup has been shown
    localStorage.setItem('popupShown', 'true');
  }

  calculate();
});
 

function updateValue(limit, target, slider) {
  // Get the input element and value
  var input = document.getElementById(target);
  var value = input.value.replace(/,/g, "");

  // Check if the first character is "£" and remove it if present
  if (value.charAt(0) === "£") {
    input.value = value.slice(1);
    value = parseFloat(input.value);
  }

  // Limit the value to a maximum of 70000
  if (value > limit) {
    value = limit;
    input.value = value;
  }

  // Add the "£" symbol to the left of the value
  if (slider == "range1" || slider == "range2") {
    input.value = "£" + value;
    addCommasToValue(input);
  } else if (slider === "range3") {
    if (input.value.indexOf("%") !== -1) {
      {
        var lastIndex = input.value.lastIndexOf("%");
        value = input.value.slice(0, lastIndex);
      }
    }

    if (!value.endsWith("%")) {
      input.value = value + "%";
    } else {
      input.value = value;
    }
  }

  // Update the slider position
  var slider = document.getElementById(slider);
  slider.value = value;
  var value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background =
    "linear-gradient(to right, #0CBDDC 0%, #0CBDDC " +
    value +
    "%, #ccc " +
    value +
    "%, #ccc 100%)";

  calculate();
}

