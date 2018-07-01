import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import { subscribe } from "pubsub-js";

const ciphers = {
    aes: {
        encrypt: function (text, key) {
            return AES.encrypt(text, key).toString(); // Defaults to 256-bit key
        },
        decrypt: function (cipherText, key) {
            const bytes  = AES.decrypt(cipherText, key);
            return bytes.toString(enc.Utf8);
        }
    }
};

let cipher = "aes";
let key = "";

subscribe("uiEvents.changeCipherKey", (_, newKey) => key = newKey);

export function encrypt (text, salt) {
    return ciphers[cipher].encrypt(salt.join("/") + "/" + text, key);
}

export function decrypt (text, salt) {
    let decrypted;
    if (key === "") {
        return text;
    }
    try {
        decrypted = ciphers[cipher].decrypt(text, key);
    } catch (e) {
        return "???";
    }
    return text && !decrypted
        ? "???"
        : decrypted.replace(salt.join("/") + "/", "");
}