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
| Submit without selecting gender | Alert asks for gender |
| Click Clear | Form and result reset |

## Technologies

- HTML for the page and form.
- CSS for colours, spacing and the mobile layout.
- JavaScript for validation, weekday calculation and name selection.

## Contact

Questions can be posted in [GitHub Issues](https://github.com/skkamau/Ahga-khan/issues).

## License

MIT License. Copyright (c) 2026 Samuel Kamau. See [LICENSE](LICENSE).
