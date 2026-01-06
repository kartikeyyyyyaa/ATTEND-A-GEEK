

// Static List 
const static_db = [
    { id: "21bxx89001", name: "Rahul Sharma", role: "participant" },
    { id: "23bcc23002", name: "Priya Patel", role: "participant" },
    { id: "24bhu12303", name: "Amit Singh", role: "audience" },
    { id: "25bhi34504", name: "Neha Gupta", role: "audience" },
    { id: "22cse56005", name: "Ankit Verma", role: "participant" },
    { id: "21cse78006", name: "Simran Kaur", role: "audience" }
];


let master_db = [];

let list_coders = [];
let list_guests = [];

function load_master_db() {
    const local_regs = localStorage.getItem('gfg_new_registrations');
    const dynamic_db = local_regs ? JSON.parse(local_regs) : [];
    
    
    master_db = [...static_db, ...dynamic_db];
}


function init_app() {
    load_master_db(); 

    const saved_c = localStorage.getItem('gfg_participants');
    const saved_g = localStorage.getItem('gfg_audience');

    if (saved_c) list_coders = JSON.parse(saved_c);
    if (saved_g) list_guests = JSON.parse(saved_g);
    
    refresh_ui();
}

init_app();



function play_sound(type) {
    const sound = (type === 'success') 
        ? document.getElementById('audio_success') 
        : document.getElementById('audio_fail');
    
    if(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Browser blocked audio:", e));
    }
}

function on_scan_hit(txt) {
    try {
        const data = JSON.parse(txt);
        
        if (!data.id) {
            update_status("Invalid QR: No ID found", "error");
            return;
        }

        const person = master_db.find(s => s.id === data.id);

        if (!person) {
            update_status("ACCESS DENIED: ID Not Found", "error");
            return;
        }

        check_in_user(person);

    } catch (e) {
        update_status("Error: Not a valid JSON QR", "error");
    }
}

function check_in_user(user) {
    let target_list = (user.role === 'participant') ? list_coders : list_guests;
    let is_dup = target_list.some(p => p.id === user.id);

    if (is_dup) {
        update_status(`⚠️ ${user.name} is already inside!`, "error");
    } else {
        const entry = { ...user, time: new Date().toLocaleTimeString() };
        target_list.push(entry);
        save_lists();
        update_status(`✅ Welcome, ${user.name}`, "success-" + user.role);
        refresh_ui();
    }
}



function update_status(msg, type) {
    const box = document.getElementById('status-display');
    if(box) {
        box.innerText = msg;
        box.className = 'message-box ' + type;
    }
    if (type.includes('success')) play_sound('success');
    else play_sound('fail');
}

function save_lists() {
    localStorage.setItem('gfg_participants', JSON.stringify(list_coders));
    localStorage.setItem('gfg_audience', JSON.stringify(list_guests));
}

function refresh_ui() {
    document.getElementById('count-participant').innerText = list_coders.length;
    document.getElementById('count-audience').innerText = list_guests.length;

    render_list('log-participant', list_coders, 'participant');
    render_list('log-audience', list_guests, 'audience');

    render_roster();
}

function render_list(el_id, data, role) {
    const ul = document.getElementById(el_id);
    ul.innerHTML = "";
    
    [...data].reverse().forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="display:flex; flex-direction:column;">
                <span><strong>${p.name}</strong></span> 
                <span class="time-badge">${p.time}</span>
            </div>
            <div style="display:flex; gap:5px;">
                <button onclick="edit_attendance('${p.id}', '${role}')" title="Edit Name">✏️</button>
                <button onclick="remove_attendance('${p.id}', '${role}')" title="Mark Absent">🗑️</button>
            </div>
        `;
        li.style.borderLeft = (role === 'participant') ? "4px solid #00b894" : "4px solid #6c5ce7";
        ul.appendChild(li);
    });
}


function render_roster() {
    fill_table('table-participant', 'participant', list_coders);
    fill_table('table-audience', 'audience', list_guests);
}

function fill_table(el_id, role, current_list) {
    const tbody = document.getElementById(el_id);
    tbody.innerHTML = "";

    master_db.filter(u => u.role === role).forEach(u => {
        const is_in = current_list.some(in_user => in_user.id === u.id);
        const row = document.createElement('tr');
        
        
        let status_html = is_in 
            ? '<span class="badge-present">✅ Present</span>' 
            : `<button class="btn-checkin" onclick="manual_override('${u.id}')">Check In</button>`;

        row.innerHTML = `
            <td>${u.id}</td>
            <td>${u.name}</td>
            <td style="display:flex; align-items:center; gap:10px;">
                ${status_html}
                <button onclick="delete_permanent('${u.id}')" title="Delete User Permanently" 
                        style="background:none; border:none; color:red; cursor:pointer; font-weight:bold;">
                        ❌
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function manual_override(id) {
    const u = master_db.find(x => x.id === id);
    if(u) check_in_user(u);
}



function edit_attendance(id, role) {
    let target_list = (role === 'participant') ? list_coders : list_guests;
    const person = target_list.find(p => p.id === id);
    if (!person) return;
    const new_name = prompt("Edit Name:", person.name);
    if (new_name) { person.name = new_name.trim(); save_lists(); refresh_ui(); }
}


function remove_attendance(id, role) {
    let target_list = (role === 'participant') ? list_coders : list_guests;
    const index = target_list.findIndex(p => p.id === id);
    if (index > -1 && confirm("Mark this student as ABSENT?")) {
        target_list.splice(index, 1);
        save_lists();
        refresh_ui();
    }
}


function delete_permanent(id) {
    if (static_db.some(u => u.id === id)) {
        alert("⚠️ Cannot delete default demo students. Only registered ones.");
        return;
    }

    if(!confirm("⚠️ PERMANENT DELETE \n\nAre you sure you want to remove " + id + " from the database? This cannot be undone.")) {
        return;
    }

    let local_regs = localStorage.getItem('gfg_new_registrations');
    let db = local_regs ? JSON.parse(local_regs) : [];
    
    // Filter out the ID
    const new_db = db.filter(u => u.id !== id);
    
    // Save back
    localStorage.setItem('gfg_new_registrations', JSON.stringify(new_db));

    load_master_db();
    refresh_ui();
    
    alert("User deleted from database.");
}

function download_report() {
    const all_data = [...list_coders, ...list_guests];
    if(all_data.length === 0) { alert("No data!"); return; }
    let csv = "ID,Name,Role,Time In\n";
    all_data.forEach(r => csv += `${r.id},${r.name},${r.role},${r.time}\n`);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'GFG_Report.csv'; a.click();
}

let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

scanner.render(on_scan_hit, (err)=>{});
