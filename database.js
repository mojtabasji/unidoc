import React from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import Base64 from './Base64';
import { StorageAccessFramework } from 'expo-file-system';
 
const dbURL = Platform.OS === 'ios' ? FileSystem.documentDirectory : FileSystem.documentDirectory + 'user.txt';

export const getData = () => new Promise((resolve, reject) => {
    FileSystem.readAsStringAsync(dbURL,{encoding:'utf8'}).then((val) => {
        console.log('Db val get: ',val);
        let normalizedContent = JSON.parse(val);
        resolve(normalizedContent);
    }).catch((err) => {
        console.log('Db db err: ',err);
        reject(err);
    });
});

export const dirInfo = ()=> new Promise((resolve, reject) =>{
    FileSystem.readDirectoryAsync(dbURL).then(
        (val)=>{
            console.log(val);
        }
    );
})

export const setData = (content) => new Promise((resolve, reject) => {
    let normalizedContent = JSON.stringify(content);
    FileSystem.writeAsStringAsync(dbURL, normalizedContent, { encoding: 'utf8' }).then(
        () => { resolve('ok'); }
    ).catch((err) => { reject(err) });
});



/*import Realm from 'realm';

export const USER_SCHEMA = "user";

export const UserSchema = {
    name: USER_SCHEMA,
    primaryKey: 'id',
    properties: {
        id:'int',
        username: 'string',
        password: 'string',
        passwordHash: 'string',
        status: 'bool',
    },
}

const databaseOptions = {
    path: 'userStore.relam',
    schema: [UserSchema],
}

export const insertNewUser = newUser => new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then(realm =>{
        realm.write(()=>{
            realm.create(USER_SCHEMA, newUser);
            resolve(newUser);
        });
    }).catch((error) => reject(error));
});

export const updateUser = user => new Promise((resolve, reject)=>{
    Realm.open(databaseOptions).then(realm => {
        realm.write(()=>{
            let updatingUser = realm.objectForPrimaryKey(USER_SCHEMA, user.id);
            updatingUser.username = user.username;
            updatingUser.password = user.password;
            updatingUser.passwordHash = user.passwordHash;
            updatingUser.status = user.status;
            resolve(updatingUser);
        });
    }).catch((error)=> reject(error));
});

export const deleteUser = user => new Promise((resolve, reject)=>{
    Realm.open(databaseOptions).then(realm => {
        realm.write(()=>{
            let updatingUser = realm.objectForPrimaryKey(USER_SCHEMA, user.id);
            realm.delete(updatingUser);
            resolve();
        });
    }).catch((error)=> reject(error));
});

export const queryAllUsers = ()=> new Promise((resolve, reject) => {
    Realm.open(databaseOptions).then( realm => {
        let allUsers = realm.objects(USER_SCHEMA);
        resolve(allUsers);
    }).catch((error)=>{ reject(error);});
});

export default new Realm(databaseOptions);*/