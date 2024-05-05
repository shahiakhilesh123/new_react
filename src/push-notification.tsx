import firebase from 'firebase/app';
import 'firebase/messaging';

export default (): any => {
    firebase.initializeApp({
        apiKey: "AIzaSyCtt4eH41MWcN4w9-9O0hpQahqsG8I-nBk",
        authDomain: "emailwish-cbc8a.firebaseapp.com",
        projectId: "emailwish-cbc8a",
        storageBucket: "emailwish-cbc8a.appspot.com",
        messagingSenderId: "264045761555",
        appId: "1:264045761555:web:d821e3b3b0aac7a29d5be6",
        measurementId: "G-H4HF4LC721"
    });
}


export const askForPermissionToReceiveNotifications = async () => {
    try {
        const messaging = firebase.messaging();
        return await messaging.getToken({vapidKey: "BByxa42u0Md36OMwl2UGhp6JbbNPc_ClnN2Ff5phUAok2sSG9H0Ycae9aSdFzDlmlYCApYnzon-LCKa85Lv3EGY"});
    } catch (error) {
    }
}
export const removeToken = async () => {
    try {
        const messaging = firebase.messaging();
        return await messaging.deleteToken();
    } catch (error) {
    }
}
