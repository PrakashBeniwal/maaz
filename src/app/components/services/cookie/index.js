// Set cookie with expiration time of 1 day

function setCookie(name, value, hoursToExpire) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (hoursToExpire * 60 * 60 * 1000)); // Convert hours to milliseconds
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return "";
}


function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export{setCookie,getCookie,deleteCookie}
