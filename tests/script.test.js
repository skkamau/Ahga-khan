const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

// Stand-in form elements let Node run the browser script without a browser.
const elements = {};
const events = {};
let selectedGender = null;
let alertMessage = "";
let focusedField = "";

for (const id of ["day", "month", "year", "result"]) {
    const classes = new Set();
    elements[id] = {
        value: "",
        innerHTML: "",
        textContent: "",
        focus() { focusedField = id; },
        classList: {
            add(name) { classes.add(name); },
            remove(name) { classes.delete(name); },
            contains(name) { return classes.has(name); }
        }
    };
}

elements["akan-form"] = {
    addEventListener(name, handler) { events[name] = handler; }
};

const app = vm.createContext({
    document: {
        getElementById(id) { return elements[id]; },
        querySelector(selector) {
            if (selector.includes(":checked")) {
                return selectedGender;
            }
            return { focus() { focusedField = "gender"; } };
        }
    },
    alert(message) { alertMessage = message; }
});

vm.runInContext(fs.readFileSync(path.join(__dirname, "../script.js"), "utf8"), app);

function submit(day, month, year, gender) {
    elements.day.value = String(day);
    elements.month.value = String(month);
    elements.year.value = String(year);
    selectedGender = gender ? { value: gender } : null;
    alertMessage = "";
    focusedField = "";
    events.submit({ preventDefault() {} });
}

// Compare the formula with a separate calendar calculation.
let checkedDates = 0;
for (const year of [1, 99, 100, 400, 1582, 1900, 1989, 2000, 2024, 2026, 9999]) {
    for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= 31; day++) {
            const date = new Date(0);
            date.setUTCFullYear(year, month - 1, day);
            const valid = date.getUTCMonth() === month - 1;
            assert.equal(app.isValidDate(day, month, year), valid);
            if (valid) {
                assert.equal(app.calculateDay(day, month, year), date.getUTCDay());
                checkedDates++;
            }
        }
    }
}

const male = ["Kwasi", "Kwadwo", "Kwabena", "Kwaku", "Yaw", "Kofi", "Kwame"];
const female = ["Akosua", "Adwoa", "Abenaa", "Akua", "Yaa", "Afua", "Ama"];
for (let index = 0; index < 7; index++) {
    for (const gender of ["male", "female"]) {
        submit(6 + index, 10, 2024, gender);
        assert.equal(alertMessage, "");
        const name = gender === "male" ? male[index] : female[index];
        assert.ok(elements.result.innerHTML.includes("<h3>" + name + "</h3>"));
    }
}

const invalidCases = [
    ["", "", "", "male", "day"],
    [1, "", 2024, "male", "month"],
    [1, 1, "", "male", "year"],
    [0, 1, 2024, "male", "day"],
    [32, 1, 2024, "male", "day"],
    [31, 4, 2024, "female", "day"],
    [29, 2, 1900, "female", "day"],
    [1, 0, 2024, "male", "month"],
    [1, 13, 2024, "male", "month"],
    [1.5, 1, 2024, "male", "day"],
    [1, 1.5, 2024, "male", "month"],
    [1, 1, 2024.5, "male", "year"],
    [1, 1, 0, "male", "year"],
    [1, 1, 10000, "male", "year"],
    [1, 1, 2024, "", "gender"]
];

for (const [day, month, year, gender, focus] of invalidCases) {
    submit(day, month, year, gender);
    assert.ok(alertMessage.length > 0);
    assert.equal(elements.result.textContent, alertMessage);
    assert.equal(elements.result.classList.contains("error"), true);
    assert.equal(focusedField, focus);
}

const today = new Date();
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
assert.equal(app.isFutureDate(today.getDate(), today.getMonth() + 1, today.getFullYear()), false);
submit(tomorrow.getDate(), tomorrow.getMonth() + 1, tomorrow.getFullYear(), "male");
assert.equal(alertMessage, "Your birthday cannot be in the future.");

submit(29, 2, 2000, "female");
assert.ok(elements.result.innerHTML.includes("Abenaa"));
assert.ok(elements.result.innerHTML.includes("29 February 2000"));
assert.equal(elements.result.classList.contains("error"), false);
events.input();
assert.equal(elements.result.innerHTML, "<p>Your name will appear here.</p>");
events.reset();
assert.equal(focusedField, "day");
assert.equal(elements.result.classList.contains("error"), false);

console.log("Passed: " + checkedDates + " dates, 14 names, validation, focus and reset checks.");
