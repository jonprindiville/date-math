// Constants
var OP_PLUS  = "plus";
var OP_MINUS = "minus";
var DATE_FMT = "%e %b %Y";

// Parameters
var pivot    = new Date(); // Today
var op       = OP_PLUS;
var incr     = 3;
var incrUnit = "weeks";
var result   = null;

YUI().use('overlay', 'calendar', 'node', 'event', function (Y) {

    // References to the UI bits
    var datePivot    = Y.one("#date-pivot");
    var dateOp       = Y.one("#date-op");
    var dateIncr     = Y.one("#date-incr");
    var dateIncrUnit = Y.one("#date-incr-unit");
    var dateResult   = Y.one("#date-result");
    var calClose     = Y.one("#cal-close");

    // Do whatever operation the UI currently shows
    function doOp(a, b) {
        if (op == OP_PLUS) return a + b;
        if (op == OP_MINUS) return a - b;
        return null;
    }

    // Called on adjustment of any parameters to recalculate result
    function refreshDisplay() {

        // Update display of inputs
        datePivot.setHTML(Y.DataType.Date.format(pivot, {format:DATE_FMT}));
        dateOp.setHTML(op);
        dateIncrUnit.set('value', incrUnit);
        dateIncr.set('value', isNaN(incr)?(""):(incr));
        
        // Compute new result
        newResult = new Date(pivot);
        if (incrUnit == "days") {
            newResult.setDate(doOp(pivot.getDate(),incr));
        } else if (incrUnit == "weeks") {
            newResult.setDate(doOp(pivot.getDate(),incr*7));
        } else if (incrUnit == "months") {
            newResult.setMonth(doOp(pivot.getMonth(),incr));
        }

        // Update result
        result = newResult;
        dateResult.setHTML(Y.DataType.Date.format(result, {format:DATE_FMT}));
        /*dateResult.render();*/
    }

    Y.on("domready", function (e) {
        hide_cal();
        refreshDisplay();
        dateIncr.get('childNodes').remove();
        for (i = 0; i < 100; ) {
            dateIncr.append('<option>' + ++i + '</option>');
        }
    });


    ///////////////////////////////////////////////////////////////////
    // SETUP //////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////

    // Calendar overlay
    var calOverlay = new Y.Overlay({
        srcNode: "#calendar-overlay",
        width:'80%',
        height: '70%',
        centered: true});

    // Calendar
    var cal = new Y.Calendar({
        contentBox: "#insert-cal-here",
        width:'100%',
        showPrevMonth: true,
        showNextMonth: true,});
        
    function show_cal () {
        calOverlay.render();
        cal.render();
        calOverlay.show();
        cal.show();
        calClose.show();
    }
    
    function hide_cal () {
        calOverlay.hide();
        cal.hide();
        calClose.hide();
    }


    ///////////////////////////////////////////////////////////////////
    // EVENTS /////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////

    // Date change
    datePivot.on('click', function (e) {
        // display overlay
        show_cal();

        // Listen for selection change, update variables, display
        cal.on("selectionChange", function (ev) {
            // Will only be one selection unless we allow mutliple
            pivot = ev.newSelection[0];
            // Expose main UI
            hide_cal();
            refreshDisplay();
        });
    });
    
    // Close link for overlay
    Y.one('#cal-close').on('click', function (e) {
        hide_cal();
    });


    // Toggle the operation
    dateOp.on('click', function (e) {

        current = this.getHTML();
        
        if (current == OP_PLUS) {
            op = OP_MINUS;
        } else if (current == OP_MINUS) {
            op = OP_PLUS;
        } else {
            alert("Well, something is broken.");
        }

        refreshDisplay();

    });

    dateIncr.on('change', function (e) {
        newIncr = parseInt(this.get('value'));
        if (isNaN(newIncr)) {
            incr = 1;
        } else {
            incr = newIncr;
        }
        refreshDisplay();
    });

    dateIncrUnit.on('change', function (e) {
        incrUnit = this.get('value');
        refreshDisplay();
    });

});
