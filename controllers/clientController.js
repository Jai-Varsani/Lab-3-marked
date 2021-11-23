const { json } = require('express');

class Client {
    constructor(username, password, num_client, society, contact, addres, zipcode, city, phone, fax, max_outstanding) {
        this.username = username;
        this.password = password;
        this.num_client = num_client;
        this.society = society;
        this.contact = contact;
        this.addres = addres;
        this.zipcode = zipcode;
        this.city = city;
        this.phone = phone;
        this.fax = fax;
        this.max_outstanding = max_outstanding;
    }
}
const loginControl = (request, response) => {
    const clientServices = require('../services/clientServices');
    console.log(request.body.username);
    console.log(request.body.password);
    let username = request.body.username;
    let password = request.body.password;
    if (!username || !password) {
        response.render('LoginFailure');
        response.end();
    } else {
        if (request.session && request.session.user) {
            console.log("***************************************************");
            console.log(username);
            response.render('alreadyIn', {clientUsername: username});
            response.end();
        } else {
            clientServices.loginService(username, password, function(err, dberr, client) {
                console.log("Client from login service :" + JSON.stringify(client));
                if (client === null) {
                    console.log("Auhtentication problem!");
                    response.render('LoginFailure'); //invite to register
                    response.end();
                } else {
                    console.log("User from login service :" + client[0].num_client);
                    //add to session
                    request.session.user = username;
                    request.session.num_client = client[0].num_client;
                    request.session.admin = false;
                    console.log(request.session);
                    response.render('loginSuccess', { clients: client });
                    response.end();
                }
            });
        }
    }
};
const registerControl = (request, response) => {
    const clientServices = require('../services/clientServices');
    let username = request.body.username;
    let password = request.body.passwsord;
    let society = request.body.society;
    let contact = request.body.contact;
    let address = request.body.address;
    let zipcode = request.body.zipcode;
    let city = request.body.city;
    let phone = request.body.phone;
    let fax = request.body.fax;
    let max_outstanding = request.body.max_outstanding;
    let client = new Client(username, password, 0, society, contact, address, zipcode, city, phone, fax, max_outstanding);
    clientServices.registerService(client, function(err, exists, insertedID) {
        console.log("User from register service :" + insertedID);
        if (exists) {
            console.log("Username taken!");
            response.render('LoginFailure2'); //invite to register
        } else {
            client.num_client = insertedID;
            console.log(`Registration (${username}, ${insertedID}) successful!`);
            response.render('registered', { registered: client});
            // response.send(`Successful registration ${client.contact} (ID.${client.num_client})!`);
        }
        response.end();
    });
};
const getClients = (request, response) => {
    const clientServices = require('../services/clientServices');
    clientServices.searchService(function(err, rows) {
        response.json(rows);
        response.end();
    });
};
const getClientByNumclient = (request, response) => {
    const clientServices = require('../services/clientServices');
    let num_client = request.params.num_client;
    clientServices.searchNumclientService(num_client, function(err, rows) {
        console.log(rows);
        response.render('details', {clients: rows});
        response.end();
    });
};

const getClientByUsername = (request, response) => {
    const clientServices = require('../services/clientServices');
    let username = request.params.username;
    console.log(username);
    clientServices.searchUsernameclientService(username, function(err, rows) {
        clientServices.searchNumclientService(rows[0].num_client, function(err, rows) {
        response.render('details', {clients: rows});
        response.end();
        });
        // response.render('details', {clients: rows});
        // response.end();
    });
};


module.exports = {
    loginControl,
    registerControl,
    getClients,
    getClientByNumclient,
    getClientByUsername
};