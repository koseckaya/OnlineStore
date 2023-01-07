import { setUrlParamsType } from "../types";
import { getUrlWithParams } from "./utils";

export const setUrlParams:setUrlParamsType = (params) => {
    const urlParams = getUrlWithParams(params);
    window.location.search = urlParams.toString();
}