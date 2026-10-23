# Akan Name Generator

Find your Akan name using your birthday and gender. The website calculates the day of the week you were born and shows the matching name from the Akan names table.

## Author

Samuel Kamau — [GitHub](https://github.com/skkamau)

## Live website

[Open Akan Name Generator](https://skkamau.github.io/Ahga-khan/)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/skkamau/Ahga-khan.git
   ```
2. Open the `Ahga-khan` folder.
3. Open `index.html` in a browser.

No installation is needed to use the website.

## How to use it

Enter your day, month and year of birth. Choose male or female, then click **Find my Akan name**. Click **Clear** to start again.

## BDD

| Input or action | Expected result |
| --- | --- |
| Submit empty fields | Alert asks for a complete birthday |
| Enter day 32 or month 13 | Invalid-date alert |
| Enter 31 April 2000 | Invalid-date alert |
| Enter 29 February 1900 | Invalid-date alert |
| Enter 29 February 2000, female | Tuesday, Abenaa |
| Enter 1 January 2024, male | Monday, Kwadwo |
| Enter a future birthday | Alert asks for a birthday that is not in the future |
| Submit without selecting gender | Alert asks for gender |
| Click Clear | Form and result reset |
| Change an input after generating a name | Previous result clears |

## How the JavaScript works

The weekday and name arrays use the same order, from Sunday to Saturday. `isValidDate` checks the date and `isLeapYear` checks February. `calculateDay` uses Zeller's Gregorian calendar formula and returns an array index. An `if/else` chooses the male or female name at that index.

January and February are treated as months 13 and 14 of the previous year in the formula. The final remainder is adjusted so Sunday is index 0. Gregorian calendar rules are used for all supported years, 1 to 9999.

`generateName` reads the form, validates it and displays the result. Errors appear in an alert and remain on the page. Editing a field clears the previous result. The Clear button resets the form and returns focus to the day field.

## Testing

Install Node.js if you want to run the checks, then run these commands from the project folder:

```bash
node --check script.js
node tests/script.test.js
```

The tests compare 4,018 dates with JavaScript's UTC calendar. They also check all fourteen names, leap years, invalid inputs, future birthdays, error messages, keyboard focus and clearing results. GitHub Actions runs the same checks on pushes and pull requests.

For a browser check, try the examples in the BDD table. Use Tab to move through the form, try a narrow phone screen and check the print preview after generating a name.

## Deployment

GitHub Pages serves `index.html` from the root of the `main` branch. Push changes to `main` to update the website. Build progress is shown in the repository's **Actions** tab.

## Technologies

- HTML for the page and form.
- CSS for colours, spacing and the mobile layout.
- JavaScript for validation, weekday calculation and name selection.

## Contact

Questions can be posted in [GitHub Issues](https://github.com/skkamau/Ahga-khan/issues).

## License

MIT License. Copyright (c) 2026 Samuel Kamau. See [LICENSE](LICENSE).
