import type { MoneviToken } from "../model/monevi-model";

class MoneviCookieHandler {

  static getCookie(cookieName: string): string {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieParams = decodedCookie.split(';');
    for(var i = 0; i < cookieParams.length; i++) {
      var c = cookieParams[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static setCookie(cookieName: string, cookieValue: string, expiredDays: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + (expiredDays * 24 * 60 * 60 * 1000));
    let expiresEpoch = "expires=" + date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expiresEpoch + ";path=/";
  }

  static deleteCookie(cookieName: string): void { 
    MoneviCookieHandler.setCookie(cookieName, "", 0);
  }

  static getCachedLogin(): MoneviToken | undefined {
    if (MoneviCookieHandler.getCookie("username")) {
        return {
            id: MoneviCookieHandler.getCookie("id"),
            fullname: MoneviCookieHandler.getCookie("fullname"),
            username: MoneviCookieHandler.getCookie("username"),
            email: MoneviCookieHandler.getCookie("email"),                
            role: MoneviCookieHandler.getCookie("role"),
            accessToken: MoneviCookieHandler.getCookie("jwt"),
            type: MoneviCookieHandler.getCookie("type"),
            organizationRegionId: MoneviCookieHandler.getCookie("organizationRegionId"),
            regionId: MoneviCookieHandler.getCookie("regionId")
        };
    }
    return undefined;
}

}

export {
  MoneviCookieHandler
};