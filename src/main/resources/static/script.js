'use strict'

const currentUserName = document.getElementById('currentUserName');
const currentUserRoles = document.getElementById('currentUserRoles');

fetch('http://localhost:8080/user')
    .then(response => response.json()) // Parse JSON response
    .then(currentUser => {
        if (currentUser && currentUser.username && currentUser.roles) {
            console.log(currentUser);
            currentUserName.textContent = currentUser.username;
            currentUserRoles.textContent = " with roles - " + currentUser.roles;
        } else {
            currentUserName.textContent = 'Error: Username not found';
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });



const userTable = document.getElementById('userTable')
const row = userTable.insertRow();
fetch('http://localhost:8080/user')
    .then(response => response.json())
    .then(currentUser => {
        row.insertCell().textContent = currentUser.id;
        row.insertCell().textContent = currentUser.name;
        row.insertCell().textContent = currentUser.age;
        row.insertCell().textContent = currentUser.gender;
        row.insertCell().textContent = currentUser.roles.join(', '); // Assuming roles is an array
    })


const adminTable = document.getElementById('adminTable');
fetch('http://localhost:8080/admin')
    .then(response => response.json()) // Parse JSON response
    .then(users => {
        // Iterate over the received users and create table rows
        users.forEach(user => {
            const row = adminTable.insertRow();

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




function switchToAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('userPanel').style.display = 'none';

    let adminPanelLink = document.getElementById('adminPanelLink');
    adminPanelLink.classList.add('active-sidebar-link');
    adminPanelLink.classList.remove('inactive-sidebar-link');

    let userPanelLink = document.getElementById('userPanelLink');
    userPanelLink.classList.add('inactive-sidebar-link');
    userPanelLink.classList.remove('active-sidebar-link');
}


function switchToUserPanel() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('userPanel').style.display = 'block';

    let userPanelLink = document.getElementById('userPanelLink');
    userPanelLink.classList.add('active-sidebar-link');
    userPanelLink.classList.remove('inactive-sidebar-link');

    let adminPanelLink = document.getElementById('adminPanelLink');
    adminPanelLink.classList.add('inactive-sidebar-link');
    adminPanelLink.classList.remove('active-sidebar-link');
}

// Initially, show the admin panel
switchToAdminPanel();