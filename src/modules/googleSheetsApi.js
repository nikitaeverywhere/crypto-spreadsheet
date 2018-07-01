import { getGapi } from "./gapi.js";

function columnIndexToLetters (index) {
    return String.fromCharCode(65 + index);
}

export async function getSheetsList () {

    const gapi = await getGapi();

    return new Promise((resolve) => {

        gapi.client.drive.files.list({
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            fields: "nextPageToken, files(id, name)",
            orderBy: "modifiedByMeTime desc",
            pageSize: 420
        }).execute(function (response) {
            resolve(response.files);
        });

    });

}

export async function getSheet (id) {

    const gapi = await getGapi();

    return new Promise((resolve) => {

        gapi.client.sheets.spreadsheets.get({
            spreadsheetId: id,
            includeGridData: true
        }).execute(function (response) {
            resolve(response.result);
        });

    });

}

export async function updateSheet (spreadsheetId, sheetName = "Sheet1", update = []) {
    
    const gapi = await getGapi();

    await gapi.client.sheets.spreadsheets.values.batchUpdate({
        spreadsheetId
    }, {
        valueInputOption: "USER_ENTERED",
        data: update.map(({ row, col, value }) => ({
            range: `${ sheetName }!${ columnIndexToLetters(col) }${ row + 1 }`,
            values: [
                [value]
            ]
        }))
    });

}