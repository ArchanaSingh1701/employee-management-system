const state = { employees: [], departments: [], employeeDepartments: new Map() };
const $ = (selector) => document.querySelector(selector);

function notify(message, type = 'success') {
    const banner = $('#notification');
    banner.textContent = message;
    banner.className = `notification ${type}`;
    banner.hidden = false;
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => { banner.hidden = true; }, 4500);
}

async function request(url, options = {}) {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options
    });
    if (response.status === 204) return null;
    const body = await response.json().catch(() => null);
    if (!response.ok) {
        const details = body?.validationErrors ? Object.values(body.validationErrors).join(' ') : body?.message;
        throw new Error(details || 'The request could not be completed.');
    }
    return body;
}

function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
}

function mapEmployeeDepartments() {
    state.employeeDepartments = new Map();
    state.departments.forEach(department => {
        (department.employees || []).forEach(employee => state.employeeDepartments.set(employee.id, department));
    });
}

function renderDepartmentOptions(selectedId = '') {
    const select = $('#employee-department');
    select.innerHTML = '<option value="">Select a department</option>' + state.departments
        .map(department => `<option value="${department.id}" ${String(department.id) === String(selectedId) ? 'selected' : ''}>${escapeHtml(department.name)}</option>`)
        .join('');
}

function renderEmployees() {
    const list = $('#employee-list');
    $('#employee-count').textContent = state.employees.length;
    $('#employee-table-count').textContent = `${state.employees.length} record${state.employees.length === 1 ? '' : 's'}`;
    if (!state.employees.length) { list.innerHTML = '<tr><td class="empty-state" colspan="4">No employees found. Add your first employee using the form.</td></tr>'; return; }
    list.innerHTML = state.employees.map(employee => {
        const department = state.employeeDepartments.get(employee.id);
        return `<tr><td><span class="employee-name">${escapeHtml(employee.firstName)} ${escapeHtml(employee.lastName)}</span></td><td>${escapeHtml(employee.email)}</td><td>${department ? `<span class="department-pill">${escapeHtml(department.name)}</span>` : '<span class="department-pill">Not assigned</span>'}</td><td class="actions"><button class="action-button" data-employee-edit="${employee.id}" type="button">Edit</button><button class="action-button delete" data-employee-delete="${employee.id}" type="button">Delete</button></td></tr>`;
    }).join('');
}

function renderDepartments() {
    const list = $('#department-list');
    $('#department-count').textContent = state.departments.length;
    $('#department-table-count').textContent = `${state.departments.length} record${state.departments.length === 1 ? '' : 's'}`;
    renderDepartmentOptions($('#employee-department').value);
    if (!state.departments.length) { list.innerHTML = '<tr><td class="empty-state" colspan="3">No departments found. Add your first department using the form.</td></tr>'; return; }
    list.innerHTML = state.departments.map(department => `<tr><td><strong>${escapeHtml(department.name)}</strong></td><td>${(department.employees || []).length}</td><td class="actions"><button class="action-button" data-department-edit="${department.id}" type="button">Edit</button><button class="action-button delete" data-department-delete="${department.id}" type="button">Delete</button></td></tr>`).join('');
}

async function loadData(showSuccess = false) {
    try {
        const [employees, departments] = await Promise.all([request('/api/employees'), request('/api/departments')]);
        state.employees = employees;
        state.departments = departments;
        mapEmployeeDepartments();
        renderEmployees();
        renderDepartments();
        if (showSuccess) notify('Dashboard data refreshed.');
    } catch (error) { notify(`Could not load dashboard data: ${error.message}`, 'error'); }
}

function resetEmployeeForm() {
    $('#employee-form').reset(); $('#employee-id').value = '';
    $('#employee-form-title').textContent = 'Add employee'; $('#employee-submit').textContent = 'Add employee'; $('#cancel-employee-edit').hidden = true;
}
function resetDepartmentForm() {
    $('#department-form').reset(); $('#department-id').value = '';
    $('#department-form-title').textContent = 'Add department'; $('#department-submit').textContent = 'Add department'; $('#cancel-department-edit').hidden = true;
}

$('#employee-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const id = $('#employee-id').value;
    const payload = { firstName: $('#first-name').value.trim(), lastName: $('#last-name').value.trim(), email: $('#email').value.trim(), department: { id: Number($('#employee-department').value) } };
    try { await request(id ? `/api/employees/${id}` : '/api/employees', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }); resetEmployeeForm(); await loadData(); notify(`Employee ${id ? 'updated' : 'added'} successfully.`); } catch (error) { notify(error.message, 'error'); }
});

$('#department-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const id = $('#department-id').value;
    const payload = { name: $('#department-name').value.trim() };
    try { await request(id ? `/api/departments/${id}` : '/api/departments', { method: id ? 'PUT' : 'POST', body: JSON.stringify(payload) }); resetDepartmentForm(); await loadData(); notify(`Department ${id ? 'updated' : 'added'} successfully.`); } catch (error) { notify(error.message, 'error'); }
});

document.addEventListener('click', async event => {
    const target = event.target;
    const employeeId = target.dataset.employeeEdit || target.dataset.employeeDelete;
    const departmentId = target.dataset.departmentEdit || target.dataset.departmentDelete;
    if (target.dataset.employeeEdit) {
        const employee = state.employees.find(item => item.id === Number(employeeId)); const department = state.employeeDepartments.get(employee.id);
        $('#employee-id').value = employee.id; $('#first-name').value = employee.firstName; $('#last-name').value = employee.lastName; $('#email').value = employee.email; renderDepartmentOptions(department?.id || '');
        $('#employee-form-title').textContent = 'Edit employee'; $('#employee-submit').textContent = 'Save changes'; $('#cancel-employee-edit').hidden = false; $('#first-name').focus();
    }
    if (target.dataset.employeeDelete && window.confirm('Delete this employee? This cannot be undone.')) {
        try { await request(`/api/employees/${employeeId}`, { method: 'DELETE' }); await loadData(); notify('Employee deleted successfully.'); } catch (error) { notify(error.message, 'error'); }
    }
    if (target.dataset.departmentEdit) {
        const department = state.departments.find(item => item.id === Number(departmentId)); $('#department-id').value = department.id; $('#department-name').value = department.name;
        $('#department-form-title').textContent = 'Edit department'; $('#department-submit').textContent = 'Save changes'; $('#cancel-department-edit').hidden = false; $('#department-name').focus();
    }
    if (target.dataset.departmentDelete && window.confirm('Delete this department? Remove or reassign its employees first.')) {
        try { await request(`/api/departments/${departmentId}`, { method: 'DELETE' }); await loadData(); notify('Department deleted successfully.'); } catch (error) { notify(error.message, 'error'); }
    }
});

$('#cancel-employee-edit').addEventListener('click', resetEmployeeForm);
$('#cancel-department-edit').addEventListener('click', resetDepartmentForm);
$('#refresh-button').addEventListener('click', () => loadData(true));
loadData();
