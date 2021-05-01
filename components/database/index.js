import React from 'react'
import PouchDB from 'pouchdb-react-native'

const db = new PouchDB('mydb')

export const signCheck = () => {
    let tmp=''
    db.get('sign')
        .then(function (doc) {
            if (doc.signedin == true) {
                tmp=true;
            }
            else tmp = false;
        })
        .catch(function (err) {
            db.put({
                _id: 'sign',
                phone: '',
                signedin: false,
            })
                .then(function (response) {
                    return false;
                })
        })

}

export const signin = (callback) => {
    db.get('sign')
        .then(function (doc) {
            return db.put({
                _id: 'sign',
                _rev: doc._rev,
                signedin: true,
            });
        })
        .then(()=>{callback();});
}