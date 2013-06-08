// Parameters
var pivot    = new Date(); // Today
var op       = "+";
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

    // Do whatever operation the UI currently shows
    function doOp(a, b) {
        if (op == "+") return a + b;
        if (op == "-") return a - b;
        return null;
    }

    // Called on adjustment of any parameters to recalculate result
    function refreshDisplay() {

        // Update display of inputs
        datePivot.setHTML(Y.DataType.Date.format(pivot, {format:"%F"}));
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
        dateResult.setHTML(Y.DataType.Date.format(result, {format:"%e %b %Y"}));
        dateResult.render();
    }

    Y.on("domready", refreshDisplay);


    ///////////////////////////////////////////////////////////////////
    // SETUP //////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////

    // Calendar overlay
    var calOverlay = new Y.Overlay({
        srcNode: "#calendar-overlay",
        width: "480px",
        height: "90%",
        centered: true});

    // Calendar
    var cal = new Y.Calendar({
        contentBox: "#insert-cal-here",
        width:'100%',
        showPrevMonth: true,
        showNextMonth: true,});


    ///////////////////////////////////////////////////////////////////
    // EVENTS /////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////

    // Date change
    datePivot.on('click', function (e) {
        // display overlay
        calOverlay.render();
        cal.render();
        calOverlay.show();
        cal.show();

        // Listen for selection change, update variables, display
        cal.on("selectionChange", function (ev) {
            // Will only be one selection unless we allow mutliple
            pivot = ev.newSelection[0];
            // Expose main UI
            calOverlay.hide();
            cal.hide();
            refreshDisplay();
        });
    });


    // Toggle the operation
    dateOp.on('click', function (e) {

        current = this.getHTML();
        
        if (current == "+") {
            op = "-";
        } else if (current == "-") {
            op = "+";
        } else {
            alert("Well, something is broken.");
        }

        refreshDisplay();

    });

    dateIncr.on('keyup', function (e) {
        newIncr = parseInt(this.get('value'));
        if (isNaN(newIncr)) {
            incr = 0;
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
