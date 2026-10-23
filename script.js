// All three arrays use the same order: Sunday (0) to Saturday (6).
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const maleNames = ["Kwasi", "Kwadwo", "Kwabena", "Kwaku", "Yaw", "Kofi", "Kwame"];
const femaleNames = ["Akosua", "Adwoa", "Abenaa", "Akua", "Yaa", "Afua", "Ama"];
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

const form = document.getElementById("akan-form");
const result = document.getElementById("result");

// Leap years have 29 days in February.
function isLeapYear(year) {
    return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);
}

function isValidDate(day, month, year) {
    if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) {
        return false;
    }

    if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
    }

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (isLeapYear(year)) {
        daysInMonth[1] = 29;
    }

    return day <= daysInMonth[month - 1];
}

// Gregorian Zeller formula: January and February belong to the previous year.
function calculateDay(day, month, year) {
    if (month < 3) {
        month = month + 12;
        year = year - 1;
    }

    const century = Math.floor(year / 100);
    const yearPart = year % 100;
    const total = day + Math.floor(13 * (month + 1) / 5) + yearPart
        + Math.floor(yearPart / 4) + Math.floor(century / 4) - 2 * century;

    // Zeller starts at Saturday. Add 6 to make Sunday index 0.
    // Adding 7 after the remainder also handles negative totals.
    return ((total + 6) % 7 + 7) % 7;
}

function isFutureDate(day, month, year) {
    const today = new Date();
    const birthday = year * 10000 + month * 100 + day;
    const currentDate = today.getFullYear() * 10000
        + (today.getMonth() + 1) * 100 + today.getDate();
    return birthday > currentDate;
}

function showError(message) {
    result.textContent = message;
    result.classList.add("error");
    alert(message);
}

function generateName(event) {
    event.preventDefault(); // Keep the page open when submitting the form.
    result.innerHTML = "<p>Your name will appear here.</p>";
    result.classList.remove("error");

    const dayInput = document.getElementById("day");
    const monthInput = document.getElementById("month");
    const yearInput = document.getElementById("year");
    const gender = document.querySelector('input[name="gender"]:checked');

    if (dayInput.value === "" || monthInput.value === "" || yearInput.value === "") {
        showError("Please enter your day, month and year of birth.");
        if (dayInput.value === "") {
            dayInput.focus();
        } else if (monthInput.value === "") {
            monthInput.focus();
        } else {
            yearInput.focus();
        }
        return;
    }

    const day = Number(dayInput.value);
    const month = Number(monthInput.value);
    const year = Number(yearInput.value);

    if (!isValidDate(day, month, year)) {
        showError("Please enter a valid date: day 1–31, month 1–12 and year 1–9999. Check the days in your month.");
        if (!Number.isInteger(year) || year < 1 || year > 9999) {
            yearInput.focus();
        } else if (!Number.isInteger(month) || month < 1 || month > 12) {
            monthInput.focus();
        } else {
            dayInput.focus();
        }
        return;
    }

    if (isFutureDate(day, month, year)) {
        showError("Your birthday cannot be in the future.");
        yearInput.focus();
        return;
    }

    if (gender === null) {
        showError("Please select your gender.");
        document.querySelector('input[name="gender"]').focus();
        return;
    }

    const dayIndex = calculateDay(day, month, year);
    let akanName;

    if (gender.value === "male") {
        akanName = maleNames[dayIndex];
    } else {
        akanName = femaleNames[dayIndex];
    }

    result.innerHTML = "<p>You were born on a " + days[dayIndex] + ". Your Akan name is</p>"
        + "<h3>" + akanName + "</h3>"
        + "<p>Birthday: " + day + " " + months[month - 1] + " " + year + "</p>";
}

function clearResult() {
    result.innerHTML = "<p>Your name will appear here.</p>";
    result.classList.remove("error");
}

form.addEventListener("submit", generateName);
form.addEventListener("input", clearResult);
form.addEventListener("reset", function () {
    clearResult();
    document.getElementById("day").focus();
});
