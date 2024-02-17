'use strict'

const currentUserName = document.getElementById('currentUserName');
const currentUserRoles = document.getElementById('currentUserRoles');

populateAll();
switchToAdminPanel();

function populateAll() {
    populateNavbar();
    populateUserPage();
    populateAdminPage()
}

function populateNavbar() {
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
}

function populateUserPage() {
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
}

function populateAdminPage() {
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
                deleteCell.innerHTML =
                    `<button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal-${user.name}">Delete</button>
                    <div class="modal fade" id="exampleModal-${user.name}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Delete user</h5>
                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div class="modal-body d-flex justify-content-center text-center">
                                                <form>
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
                        option.text = role;
                        rolesSelect.add(option);
                    }
                )
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


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



function deleteUser(userId) {
    fetch(`http://localhost:8080/admin/${userId}`, {
        method: 'DELETE'
    });
    location.reload();
}
