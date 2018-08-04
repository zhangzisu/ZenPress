/* eslint-disable */
import cnf from "../zenpress.cnf";
const API_URL = `${cnf["api-https"] ? "https" : "http"}://${cnf["api-host"]}/api/${cnf["api-key"]}`;

workbox.routing.registerRoute(
    new RegExp(`${API_URL}/`),
    workbox.strategies.networkFirst(),
);