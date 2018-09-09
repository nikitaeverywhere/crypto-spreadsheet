import delay from "./delay.js";
import { gapiConfig } from "../config.js";

let signedIn = false;
let signingIn = false;
let initialized = false;

loadApi();

async function initialization () {
    while (!initialized) {
        await delay(50);
    }
}

async function loadApi () {
    gapi.load("client:auth2", init);
}

async function requestSignIn () {

    let gapiToken = null;
    if (localStorage.getItem("gapiToken")) {
        gapiToken = JSON.parse(localStorage.getItem("gapiToken"));
    }
    if (gapiToken !== null) {
        const expires = new Date(gapiToken.expires_at);
        const timeLeft = expires.getTime() - Date.now();
        if (timeLeft < 10 * 1000) {
            signedIn = false;
        } else {
            setTimeout(() => signedIn = false, timeLeft);
            gapi.client.setToken(gapiToken);
            signedIn = true;
        }
    }
    if (signedIn) {
        return;
    }

    signingIn = true;
    try {
        const response = await gapi.auth2.getAuthInstance().signIn();
        gapiToken = response.getAuthResponse();
    } catch (e) {
        await delay(5000);
        console.error(e);
    }
    localStorage.setItem("gapiToken", JSON.stringify(gapiToken));
    signingIn = false;

}

async function init () {

    await gapi.client.init(gapiConfig);

    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    initialized = true;

}

async function updateSignInStatus (isSignedIn) {
    signedIn = isSignedIn;
}

export async function getGapi () {
    await signIn();
    return gapi;
}

export async function signIn () {
    await initialization();
    while (!signedIn) {
        if (!signingIn) {
            await requestSignIn();
        }
        await delay(50);
    }
}

export async function signOut () {
    localStorage.removeItem("gapiToken");
    location.reload();
}