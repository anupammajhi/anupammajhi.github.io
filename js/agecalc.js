;(function () {
	
	'use strict';

    const am_0 = new Date(0) // epoch 0000000000
    const am_dob = Date.parse('31 May, 1991, 05:30:00 UTC');
    const am_now = Date.now();
    const one_day = 1000 * 60 * 60 * 24

	var ageInYears = () => {
        var diffyears = new Date(am_now - am_dob)
        var finalAge = diffyears.getFullYear() - am_0.getFullYear();

        console.log(finalAge);
        $('#ageInYears').text(finalAge);
    }

    var ageInDays = () => {
        var diffsecs = new Date(am_now - am_dob)
        var finalAge = Math.round(diffsecs / one_day);

        console.log(finalAge);
        $('#ageInDays').text(finalAge);
    }

	
	$(function(){
		ageInYears();
        ageInDays();
	});


}());
