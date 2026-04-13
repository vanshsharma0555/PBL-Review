let students = JSON.parse(localStorage.getItem("students")) || [];
let editMode = false;
let editId = null;

/* Save Data */
function saveData() {
    localStorage.setItem("students", JSON.stringify(students));
}

/* Render Table */
function renderTable(data = students) {
    let table = document.getElementById("tableBody");
    table.innerHTML = "";

    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="4">No students found</td></tr>`;
        return;
    }

    data.forEach(s => {
        let row = `
            <tr>
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>
                    <span style="background:#22c55e; padding:5px 10px; border-radius:10px;">
                        ${s.marks}
                    </span>
                </td>
                <td>
                    <button class="action-btn edit" onclick="editStudent(${s.id})">Edit</button>
                    <button class="action-btn delete" onclick="deleteStudent(${s.id})">Delete</button>
                </td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

/* Add or Update */
function addOrUpdateStudent() {
    let id = document.getElementById("id").value;
    let name = document.getElementById("name").value;
    let marks = document.getElementById("marks").value;

    if (!id || !name || !marks) {
        showToast("Fill all fields!");
        return;
    }

    if (editMode) {
        let student = students.find(s => s.id == editId);
        student.name = name;
        student.marks = Number(marks);

        showToast("Student Updated!");
        editMode = false;
        editId = null;
    } else {
        let exists = students.find(s => s.id == id);
        if (exists) {
            showToast("ID already exists!");
            return;
        }

        students.push({
            id: Number(id),
            name,
            marks: Number(marks)
        });

        showToast("Student Added!");
    }

    saveData();
    renderTable();
    clearInputs();
    closeModal();
}

/* Edit */
function editStudent(id) {
    let student = students.find(s => s.id == id);

    document.getElementById("id").value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("marks").value = student.marks;

    editMode = true;
    editId = id;

    openModal();
}

/* Delete */
function deleteStudent(id) {
    students = students.filter(s => s.id != id);
    saveData();
    renderTable();

    showToast("Student Deleted!");
}

/* Search */
function searchStudent() {
    let query = document.getElementById("search").value.toLowerCase();

    let filtered = students.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.id.toString().includes(query)
    );

    renderTable(filtered);
}

/* Clear Inputs */
function clearInputs() {
    document.getElementById("id").value = "";
    document.getElementById("name").value = "";
    document.getElementById("marks").value = "";
}

/* Modal Controls */
function openModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
    clearInputs();
    editMode = false;
    editId = null;
}

/* Toast Notification */
function showToast(message) {
    let toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2000);
}

/* Initial Load */
renderTable();
