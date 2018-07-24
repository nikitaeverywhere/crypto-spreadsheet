import AES from "crypto-js/aes";
import { enc } from "crypto-js";
import sha3 from "crypto-js/sha3";
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

function hash (string) {
    return sha3(string, {
        outputLength: 128
    }).toString();
}

export function encrypt (text, salt = []) {
    if (key === "" || text === null) {
        return text;
    }
    return key === ""
        ? text
        : ciphers[cipher].encrypt(hash(salt.join(",")) + text, key);
}

export function decrypt (text, salt = []) {
    let decrypted;
    if (text === null) {
        return text;
    }
    if (key === "") {
        return text.indexOf("U2FsdGVkX1") === 0 ? "Wrong password!" : text;
    }
    try {
        decrypted = ciphers[cipher].decrypt(text, key);
    } catch (e) {
        return "Wrong password!";
    }
    return text && !decrypted
        ? "Wrong password!"
        : decrypted.replace(hash(salt.join(",")), "");
}