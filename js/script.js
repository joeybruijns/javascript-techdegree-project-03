///// Global variables /////
// T-shirt variables
const $selectDesign = $('#design');
const $selectThemeOption = $('#design option').first();
// Add the Select a T-Shirt Theme message to the Color selection
$('#color').prepend('<option>Please Select a T-Shirt Theme</option>');
const $colorOptions = $('#color option');

// Activity variables
let totalCost = 0;
const $activitiesSection = $('.activities');
const $allActivities = $('.activities input[type="checkbox"]');

// Payment variables
const $selectPaymentOption = $('#payment option').first();
const $paymentOptions = $('#payment option');

// Validation variables
const $nameInput = $('#name');
const $mailInput = $('#mail');
const $ccInput = $('#cc-num');
const $zipInput = $('#zip');
const $cvvInput = $('#cvv');

// Focus on the first text field on page load
$('#name').focus();
$('#other-title').hide();

// Show input field when option 'Other' is selected
$('#title').change(function () {
    if ($(this).val() === 'other') {
        $('#other-title').show();
    } else {
        $('#other-title').hide();
    }
});

///// T-Shirt Selection /////
// Hide the 'Select a Theme' option
$selectThemeOption.attr('hidden', true);
$colorOptions.eq(0).attr('selected', 'selected');

// Hide all color elements initially
for (let i = 0; i < $colorOptions.length; i += 1) {
    $colorOptions.eq(i).attr('hidden', true);
}

// Display the correct color elements accordingly
$selectDesign.on('change', function (event) {
    $($colorOptions).each(function () {
        if ($(event.target).val() === "js puns") {
            for (let i = 0; i < $colorOptions.length; i += 1) {
                $colorOptions.eq(i).attr('hidden', true);
            }
            $colorOptions.eq(1).attr('hidden', false);
            $colorOptions.eq(2).attr('hidden', false);
            $colorOptions.eq(3).attr('hidden', false);

            $colorOptions.eq(1).attr('selected', 'selected');
        } else {
            for (let i = 0; i < $colorOptions.length; i += 1) {
                $colorOptions.eq(i).attr('hidden', true);
            }
            $colorOptions.eq(4).attr('hidden', false);
            $colorOptions.eq(5).attr('hidden', false);
            $colorOptions.eq(6).attr('hidden', false);

            $colorOptions.eq(4).attr('selected', 'selected');
        }
    });
});

///// Activity Section /////
$(`<h3 class="total-cost">Total cost: ${totalCost}</h3>`).appendTo('.activities');

$activitiesSection.on('change', function (event) {
    const $clickedItem = $(event.target);
    const $clickedItemCost = parseFloat($clickedItem.attr('data-cost').slice(1));
    const $clickedItemDateTime = $clickedItem.attr('data-day-and-time');

    // If activity is selected/deselected update the total cost
    if ($clickedItem.is(':checked')) {
        totalCost += $clickedItemCost;
    } else {
        totalCost -= $clickedItemCost;
    }
    $('.total-cost').text(`Total cost: ${totalCost}`);

    // If activity date and time conflict with the selected one, disable activity
    $allActivities.each(function () {
        const $currentActivity = $(this);
        if ($currentActivity.attr('data-day-and-time') === $clickedItemDateTime && $currentActivity !== $clickedItem) {
            if ($clickedItem.is(':checked')) {
                $currentActivity.attr('disabled', true);
                $clickedItem.attr('disabled', false);
            } else {
                $currentActivity.attr('disabled', false);
            }
        }
    });
});

///// Payment Info Section /////
$('#paypal').hide();
$('#bitcoin').hide();

// Hide the Select Payment Method option
$selectPaymentOption.attr('hidden', true);

// Select Credit Card by default
$paymentOptions.eq(1).attr('selected', 'selected');

$('#payment').on('change', function (event) {
    $($paymentOptions).each(function () {
        if ($(event.target).val() === "credit card") {
            $('#credit-card').show();
            $('#paypal').hide();
            $('#bitcoin').hide();
        } else if ($(event.target).val() === "paypal") {
            $('#credit-card').hide();
            $('#paypal').show();
            $('#bitcoin').hide();
        } else {
            $('#credit-card').hide();
            $('#paypal').hide();
            $('#bitcoin').show();
        }
    });
});

///// Form Validation ///////
function clearAllWarnings() {
    $('.warning').remove();
}

// Function for validating name field
function checkName(name) {
    const $warning = $('<h3 class="warning">- Enter your name</h3>');
    if (name !== '') {
        $($nameInput).css('border', '2px solid #b0d3e2');
    } else {
        $($nameInput).css('border', '2px solid red');
        $('.basic-info').prepend($warning);
    }
}

// Function for validating email field
function checkEmail(email) {
    const $warning = $('<h3 class="warning">- Enter a valid email</h3>');
    const check = /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
    if (check) {
        $($mailInput).css('border', '2px solid #b0d3e2');
    } else {
        $($mailInput).css('border', '2px solid red');
        $('.basic-info').prepend($warning);
    }
}

// Function for validating activity checkboxes
function checkActivity() {
    const $warning = $('<h3 class="warning">- Select an activity</h3>');
    let counter = 0;
    $($allActivities).each(function () {
        if ($(this).prop('checked') === false) {
            counter += 1;
        }
        if (counter === $allActivities.length) {
            $($activitiesSection).prepend($warning);
        }
    });
}

// Function for validating credit card payment method
function checkCreditCard(cardNumber, zipCode, cvv) {
    const $warning = $('<h3 class="warning">- Please, enter a valid credit card</h3>');

    const cardCheck = /^\d{13,16}$/.test(cardNumber);
    const zipCheck = /^\d{5}$/.test(zipCode);
    const cvvCheck = /^\d{3}$/.test(cvv);

    function printErrorMessage() {
        $($warning).insertAfter('#payment');
    }

    if (cardCheck) {
        $($ccInput).css('border', '2px solid #b0d3e2');
    } else {
        $($ccInput).css('border', '2px solid red');
        printErrorMessage();
    }
    if (zipCheck) {
        $($zipInput).css('border', '2px solid #b0d3e2');
    } else {
        $($zipInput).css('border', '2px solid red');
        printErrorMessage();
    }
    if (cvvCheck) {
        $($cvvInput).css('border', '2px solid #b0d3e2');
    } else {
        $($cvvInput).css('border', '2px solid red');
        printErrorMessage();
    }
}

// When the form is submitted, perform the validation
$('form').submit(function (event) {

    // clear warnings and call 3 validation functions
    clearAllWarnings();
    checkEmail($mailInput.val());
    checkName($nameInput.val());
    checkActivity();

    // If payment method = credit card call payment validation
    if ($('select#payment').val() === 'credit card') {
        checkCreditCard($ccInput.val(), $zipInput.val(), $cvvInput.val());
    }

    // If there are warnings on the page, prevent the form from submitting
    const WarningsOnPage = $('.warning').length;
    if (WarningsOnPage !== 0) {
        event.preventDefault();
    }
});
