'use strict'

const currentUserName = document.getElementById('currentUserName');
const currentUserRoles = document.getElementById('currentUserRoles');

populateAll();
switchToAdminPanel();
switchToUsersTable();

function populateAll() {
    populateNavbar();
    populateUserPage();
    populateAdminUsersPage()
    populateAdminNewUserPage();
}

function populateNavbar() {
    fetch('http://localhost:8080/currentUser')
        .then(response => response.json()) // Parse JSON response
        .then(currentUser => {
            if (currentUser && currentUser.username && currentUser.roles) {
                console.log(currentUser);
                currentUserName.textContent = currentUser.username;
                currentUserRoles.textContent = " with roles: " + currentUser.roles.map(role => role.substring(5)).join(', ');
            } else {
                currentUserName.textContent = 'Error: Username not found';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function populateUserPage() {
    const userTable = document.getElementById('userTable')
    const row = userTable.insertRow();
    fetch('http://localhost:8080/currentUser')
        .then(response => response.json())
        .then(currentUser => {
            row.insertCell().textContent = currentUser.id;
            row.insertCell().textContent = currentUser.name;
            row.insertCell().textContent = currentUser.age;
            row.insertCell().textContent = currentUser.gender;
            row.insertCell().textContent = currentUser.roles.map(role => role.substring(5)).join(', ');
        })
}

function populateAdminUsersPage() {
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
                row.insertCell().textContent = user.roles.map(role => role.substring(5)).join(', ');

                // You can add edit and delete buttons if needed
                const editCell = row.insertCell();
                const deleteCell = row.insertCell();
                // editCell.innerHTML = `<button>Edit</button>`;
                createEditButtonAndModal(editCell, user);
                createDeleteButtonAndModal(deleteCell, user);

            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function populateAdminNewUserPage() {
    fetch('http://localhost:8080/admin/getPossibleGenders')
        .then(response => response.json())
        .then(gendersList => {
            let genderSelect = document.getElementById('create_gender');

            gendersList.forEach(function(gender) {
                let option = document.createElement("option");
                option.value = gender;
                option.text = gender;
                genderSelect.add(option);
            });
        })

    fetch('http://localhost:8080/admin/getPossibleRoles')
        .then(response => response.json())
        .then(rolesList => {
            let rolesSelect = document.getElementById('create_roles');

            rolesList.forEach(function(role) {
                let option = document.createElement("option");
                option.value = role;
                option.text = role.substring(5);
                rolesSelect.add(option);
            });
        })
}


function switchToAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('userPage').style.display = 'none';

    let adminPanelLink = document.getElementById('adminPanelLink');
    adminPanelLink.classList.add('active-sidebar-link');
    adminPanelLink.classList.remove('inactive-sidebar-link');

    let userPanelLink = document.getElementById('userPageLink');
    userPanelLink.classList.add('inactive-sidebar-link');
    userPanelLink.classList.remove('active-sidebar-link');
}


function switchToUserPage() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('userPage').style.display = 'block';

    let userPanelLink = document.getElementById('userPageLink');
    userPanelLink.classList.add('active-sidebar-link');
    userPanelLink.classList.remove('inactive-sidebar-link');

    let adminPanelLink = document.getElementById('adminPanelLink');
    adminPanelLink.classList.add('inactive-sidebar-link');
    adminPanelLink.classList.remove('active-sidebar-link');
}



function deleteUser(userId) {
    fetch(`http://localhost:8080/admin/${userId}`, {
        method: 'DELETE'
    }).then(response => location.reload());
}

function createDeleteButtonAndModal(deleteCell, user) {
    deleteCell.innerHTML =
        `<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal-${user.id}">Delete</button>
            <div class="modal fade" id="exampleModal-${user.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Delete user</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body d-flex justify-content-center text-center">
                            <form method="post">
                                <fieldset disabled>
                                    <div class="mb-3">
                                        <label style="font-weight: bold" for="id" class="form-label">ID</label>
                                        <input type="number" id="id" class="form-control" placeholder="${user.id}">
                                    </div>
                                    <div class="mb-3">
                                        <label style="font-weight: bold" for="name" class="form-label">Name</label>
                                        <input type="text" id="name" class="form-control" placeholder="${user.name}">
                                    </div>
                                    <div class="mb-3">
                                        <label style="font-weight: bold" for="age" class="form-label">Age</label>
                                        <input type="number" id="age" class="form-control" placeholder="${user.age}">
                                    </div>
                                    <div class="mb-3">
                                        <label style="font-weight: bold" for="gender" class="form-label">Gender</label>
                                        <select id="gender" class="form-select">
                                            <option>${user.gender}</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label style="font-weight: bold" for="roles-${user.id}" class="form-label">Roles</label>
                                        <select multiple="multiple" id="roles-${user.id}" class="form-select"></select>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-danger" onclick="deleteUser(${user.id})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
`;
    let rolesSelect = document.getElementById(`roles-${user.id}`);
    user.roles.forEach(role => {
            let option = document.createElement('option');
            option.text = role.substring(5);
            rolesSelect.add(option);
        }
    )
}

function createEditButtonAndModal(editCell, user) {
    editCell.innerHTML =
        `<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editModal-${user.id}">Edit</button>
         <div class="modal fade" id="editModal-${user.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editModalLabel">Edit user</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body d-flex justify-content-center text-center">
                        <form id="edit_form-${user.id}">
                            <input class="form-control" type="hidden" name="id" id="edit_id" value="${user.id}">

                            <label style="font-weight: bold" class="form-label" for="edit_name">Name</label>
                            <input class="form-control" type="text" name="name" id="edit_name" value="${user.name}"/><br/>

                            <label style="font-weight: bold" class="form-label" for="edit_password">Password</label>
                            <input class="form-control" type="password" name="password" id="edit_password"/><br/>

                            <label style="font-weight: bold" class="form-label" for="edit_age">Age</label>
                            <input class="form-control" type="text" name="age" id="edit_age" value="${user.age}"/><br/>
                            
                            <label style="font-weight: bold" class="form-label" for="edit_gender-${user.id}">Gender</label>
                            <select class="form-control" name="gender" id="edit_gender-${user.id}"></select> <br/>
                            
                            <label style="font-weight: bold" for="edit_roles-${user.id}" class="form-label">Roles</label>
                            <select class="form-control" multiple="multiple" name="roles" id="edit_roles-${user.id}"></select> <br/>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary" onclick="submitEditForm(${user.id})">Edit</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
`;

    fetch('http://localhost:8080/admin/getPossibleGenders')
        .then(response => response.json())
        .then(gendersList => {
            let genderSelect = document.getElementById(`edit_gender-${user.id}`);

            gendersList.forEach(function(gender) {
                let option = document.createElement("option");
                option.value = gender;
                option.text = gender;
                if (gender === user.gender) {
                    option.selected = true;
                }
                genderSelect.add(option);
            });
        })

    fetch('http://localhost:8080/admin/getPossibleRoles')
        .then(response => response.json())
        .then(rolesList => {
            let rolesSelect = document.getElementById(`edit_roles-${user.id}`);

            rolesList.forEach(function(role) {
                let option = document.createElement("option");
                option.value = role;
                option.text = role.substring(5);
                if (user.roles.includes(role)) {
                    option.selected = true;
                }
                rolesSelect.add(option);
            });
        })


}

function submitEditForm(userId) {
    const form = document.getElementById(`edit_form-${userId}`);
    const formData = new FormData(form);

    fetch(`http://localhost:8080/admin/${userId}`, {
        method: 'PATCH',
        body: formData
    }).then(response => location.reload());
}

function switchToUsersTable() {
    document.getElementById('usersTable').style.display = 'block';
    document.getElementById('createUserPanel').style.display = 'none';

    let usersTableLink = document.getElementById('usersTableLink');
    let createUserLink = document.getElementById('createUserLink');

    usersTableLink.classList.add('active');
    usersTableLink.setAttribute('aria-current', 'true');
    usersTableLink.style.color = 'gray';

    createUserLink.classList.remove('active');
    createUserLink.setAttribute('aria-current', 'false');
    createUserLink.style.color = '';
}

function switchToCreateUserPanel() {
    document.getElementById('createUserPanel').style.display = 'block';
    document.getElementById('usersTable').style.display = 'none';

    let usersTableLink = document.getElementById('usersTableLink');
    let createUserLink = document.getElementById('createUserLink');

    createUserLink.classList.add('active');
    createUserLink.setAttribute('aria-current', 'true');
    createUserLink.style.color = 'gray';

    usersTableLink.classList.remove('active');
    usersTableLink.setAttribute('aria-current', 'false');
    usersTableLink.style.color = '';
}


function createUser() {
    const form = document.getElementById('createUserForm');
    const formData = new FormData(form);

    fetch('http://localhost:8080/admin', {
        method: 'POST',
        body: formData
    }).then(response => location.reload())
}