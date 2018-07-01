# Crypto Spreadsheet

(currently in development)

Client-encrypted Google Spreadsheets! Visit [https://zitros.github.io/crypto-spreadsheet/](https://zitros.github.io/crypto-spreadsheet/).

## Usage

1. Bookmark [https://zitros.github.io/crypto-spreadsheet/](https://zitros.github.io/crypto-spreadsheet/). Anyway, you can always download a client and run it on `localhost:80` or `localhost:5000`.
2. Make sure there's no malicious browser extensions/other software installed that can intercept your passwords.
3. Log in with Google and open any recently created spreadsheet.
4. Type a password to the top input.
5. Anything you type is now client-encrypted with AES-256 cipher and your password. If you go back to Google spreadsheets, you won't see the original text. To recover the original text, get back to the client and type the same password.
6. Now, your previous data will turn into `"???"` - that's normal, but do not overwrite it, as it will be completely lost!

Warning: cypher is subject to change on the very early development stages.

# License

[MIT](LICENSE) | [Nikita Savchenko](https://nikita.tk)