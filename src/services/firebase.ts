import * as firebase from "firebase";
import logger from "vuex/dist/logger";

export function init() {
  firebase.initializeApp({
    apiKey: "AIzaSyDb0_e7NjTvz7kjOYb9f3v9So8Qf3PwSCg",
    authDomain: "localhost",
    projectId: "education-vue-project"
  });
}

export function signIn(login: string, pass: string) {
  return firebase
    .auth()
    .signInWithEmailAndPassword(login, pass)
    .then(user => {
      return true;
    })
    .catch(err => {
      return false;
    });
}

export function isUserExists(login: string, pass: string): Promise<boolean> {
    const db = firebase.firestore();
    return db.collection("users")
        .where("username", '==', login)
        .where("password", '==', pass)
        .get().then((querySnapshot) => {
            if (querySnapshot.size === 1) {
                return true
            } else {
                return false
            }
        });
}

export function addData(date: string, happened: boolean, subject: string, user: string): Promise<any> {
    const db = firebase.firestore();
    return db.collection("education").add({
        date,
        happened,
        subject,
        user,
    })
    .then(function(doc) {
        return doc.id;
    })
    .catch(function() {
        return false
    });
}

interface EducationData {
    date: string,
    happened: boolean,
    subject: string,
    user: string,
    id: string,
}

export function getData(): EducationData[] {
    const db = firebase.firestore();
    const result: EducationData[] = [];
    db.collection("education").get().then(res => {
        res.forEach(item => {
            const data = item.data();
            data.id = item.id;
            result.push(data as EducationData);
        });
    })
    return result;
}

export function delData(selected:string) {
    const db = firebase.firestore();
    let arrId:any = [];
    for (let i = 0; i < selected.length; i++) {
        //@ts-ignore
        arrId[i] = selected[i]['id'];
    }
    arrId.forEach(function(item:any) {
        db.collection("education").doc(item).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    })
}

export function delDataItem(item:string) {
    const db = firebase.firestore();
    db.collection("education").doc(item).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

export function editData(subject: string, date: string, id:string) {
    const db = firebase.firestore();
    db.collection("education").doc(id).update({
        subject: subject,
        date: date,
    }).then(function() {
        console.log("education updated");
    });
}

export function editHappened(happened: boolean, id: string) {
    const db = firebase.firestore();
    db.collection("education").doc(id).update({
        happened: happened,
    }).then(function() {

    });
}



interface HomeworksData {
    date: string,
    url: string,
    education_id: string,
    user: string,
}

export function getDataHomeworks(currentId:string): HomeworksData[] {
    const db = firebase.firestore();
    const result: HomeworksData[] = [];
    db.collection("homeworks").where("education_id", "==", currentId).get().then(res => {
        res.forEach(item => {
        const data = item.data();
        data.id = item.id;
        result.push(data as HomeworksData);
        });
    })
    return result;
}

export function addHomework(date: string, url: string, education_id: string, user: string): Promise<any> {
    const db = firebase.firestore();
    return db.collection("homeworks").add({
        date,
        url,
        education_id,
        user,
    })
        .then(function(doc) {
            return doc.id;
        })
        .catch(function() {
            return false
        });
}
