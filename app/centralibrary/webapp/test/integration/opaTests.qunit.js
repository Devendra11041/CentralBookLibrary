sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'com/app/centralibrary/test/integration/FirstJourney',
		'com/app/centralibrary/test/integration/pages/BookList',
		'com/app/centralibrary/test/integration/pages/BookObjectPage',
		'com/app/centralibrary/test/integration/pages/ActiveLoansObjectPage'
    ],
    function(JourneyRunner, opaJourney, BookList, BookObjectPage, ActiveLoansObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('com/app/centralibrary') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheBookList: BookList,
					onTheBookObjectPage: BookObjectPage,
					onTheActiveLoansObjectPage: ActiveLoansObjectPage
                }
            },
            opaJourney.run
        );
    }
);