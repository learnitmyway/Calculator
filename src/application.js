'use strict';

var convertNodeListToArray = function (nodeList) {
    return Array.prototype.slice.call(nodeList);
};

function Application() {
    var MAX_CHARS_IN_HISTORY = 15;
    var MAX_DIGITS_IN_DISPLAY = 10;

    var DECIMAL_POINT = ".";
    var EQUALS_SYMBOL = "=";

    var PLUS_SYMBOL = "+";
    var MINUS_SYMBOL = "-";
    var DIVIDE_SYMBOL = "/";
    var MULTIPLY_SYMBOL = "*";

    var OPERATIONS = [PLUS_SYMBOL, MINUS_SYMBOL, DIVIDE_SYMBOL, MULTIPLY_SYMBOL];

    var history = "";
    var result = "";

    var isOperation = function (text) {
        return OPERATIONS.indexOf(text) !== -1;
    };

    var doesHistoryContainEquals = function () {
        var equalsRegExp = new RegExp(/\=/g);
        return history.match(equalsRegExp);
    };

    var getLastEntityInHistory = function () {
        var operationsRegEx = new RegExp(/\+|\-|\*|\//g);
        return history.split(operationsRegEx).pop();
    };

    var getHistoryToDisplay = function () {
        if (history.length === 0) {
            return "0";
        } else if (history.length > MAX_CHARS_IN_HISTORY) {
            return "..." + history.slice(-MAX_CHARS_IN_HISTORY);
        }
        return history;
    };

    var refreshDisplay = function (textToDisplay) {
        document.getElementById('display').innerHTML = textToDisplay;
        document.getElementById('history').innerHTML = getHistoryToDisplay();
    };

    // https://stackoverflow.com/questions/15860683/onclick-event-in-a-for-loop
    var displayCurrentNumber = function (digitStr) {
        return function () {

            if (doesHistoryContainEquals()) {
                history = "";
            }

            if (document.getElementById('display').innerHTML.length < MAX_DIGITS_IN_DISPLAY) {
                history += digitStr;
            }

            refreshDisplay(getLastEntityInHistory());
        }
    };

    // https://stackoverflow.com/questions/15860683/onclick-event-in-a-for-loop
    var displayOperation = function (operation) {
        return function () {

            if (history.length === 0) {
                history += "0";
            } else if (doesHistoryContainEquals()) {
                history = result;
            } else if (isOperation(history[history.length - 1])) {
                history = history.substring(0, history.length - 1);
            }

            history += operation;
            refreshDisplay(operation);
        }
    };

    var displayCurrentNumberOnClick = function (numberElement) {
        numberElement.onclick = displayCurrentNumber(numberElement.innerHTML);
    };

    var displayCurrentOperationOnClick = function (numberElement) {
        numberElement.onclick = displayOperation(numberElement.value);
    };

    var displayEachNumberOnClick = function () {
        var numberElementsArray = convertNodeListToArray(document.getElementsByClassName('number'));
        numberElementsArray.forEach(displayCurrentNumberOnClick);
    };

    var displayEachOperationOnClick = function () {
        var operationElementsArray = convertNodeListToArray(document.getElementsByClassName('operation'));
        operationElementsArray.forEach(displayCurrentOperationOnClick);
    };

    var displayDecimalPointOnClick = function () {
        document.getElementById('decimal-point').onclick = function () {
            if (doesHistoryContainEquals() || history.length === 0) {
                history = "0";
            }
            history += DECIMAL_POINT;
            refreshDisplay(getLastEntityInHistory());
        };

    };

    var getResultToDisplay = function () {
        if (result.toString().length < MAX_DIGITS_IN_DISPLAY) {
            return result;
        }

        var resultInExponentialNotation = result.toExponential();
        var splitResult = resultInExponentialNotation.toString().split("e");
        splitResult[0] = Math.round(splitResult[0]);

        return splitResult[0] + "e" + splitResult[1];
    };

    var displayResultOnClick = function () {
        var equalsElement = document.getElementById('equals');
        equalsElement.onclick = function () {

            if (history.length === 0 || isOperation(history[history.length - 1])) {
                return;
            }

            result = new ResultCalculator().calculateResult(history);

            history += EQUALS_SYMBOL;
            history += result;

            refreshDisplay(getResultToDisplay());
        };
    };

    var clearAllOnClick = function () {
        document.getElementById('all-clear').onclick = function () {
            history = "";
            result = "";
            refreshDisplay("");
        };
    };

    this.init = function () {
        refreshDisplay("0");
        displayEachNumberOnClick();
        displayEachOperationOnClick();
        displayDecimalPointOnClick();
        displayResultOnClick();
        clearAllOnClick();
    };
}
