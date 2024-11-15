import { redirect } from "react-router-dom";

export const backendBaseUrl = "http://localhost:8080";

export function setAuthToken(res) {
    localStorage.setItem('token', res.message.token);
    localStorage.setItem('user', JSON.stringify(res.message.user));
    return true;
}

export function getAuthToken(){
    const token = localStorage.getItem('token');
    return token;
}

export function tokenLoader() {
    return getAuthToken();
}

export default function checkTokenExists() {
    const token = localStorage.getItem('token');
    
    if(!token) {
        return redirect('/login');
    }
    return null;
}
