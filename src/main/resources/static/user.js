populateUserPage();

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
            row.insertCell().textContent = currentUser.roles.join(', ');
        })
}