export const gapiConfig = {
    apiKey: "AIzaSyCXSCEr9GYz5k0xgf7-DHUW57yctII3bY4",
    clientId: "240439124537-8q21vbnt8pnqgamim0iom0mdv5kgfp4d.apps.googleusercontent.com",
    scope: [
        "https://www.googleapis.com/auth/drive.readonly",
        "https://www.googleapis.com/auth/spreadsheets"
    ].join(" "),
    discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
    ]
};