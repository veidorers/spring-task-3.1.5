'use strict'

const currentUserName = document.getElementById('currentUserName');
const currentUserRoles = document.getElementById('currentUserRoles');

fetch('http://localhost:8080/user')
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        if (data && data.username && data.roles) {
            console.log(data);
            currentUserName.textContent = data.username;
            currentUserRoles.textContent = " with roles - " + data.roles;
        } else {
            currentUserName.textContent = 'Error: Username not found';
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

const userTable = document.getElementById('userTable');

fetch('http://localhost:8080/admin')
    .then(response => response.json()) // Parse JSON response
    .then(users => {
        // Iterate over the received users and create table rows
        users.forEach(user => {
            const row = userTable.insertRow();

            // Insert cells with user data
            row.insertCell().textContent = user.id;
            row.insertCell().textContent = user.name;
            row.insertCell().textContent = user.age;
            row.insertCell().textContent = user.gender;
            row.insertCell().textContent = user.roles.join(', '); // Assuming roles is an array

            // You can add edit and delete buttons if needed
            const editCell = row.insertCell();
            const deleteCell = row.insertCell();
            editCell.innerHTML = '<button>Edit</button>';
            deleteCell.innerHTML = '<button>Delete</button>';
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });