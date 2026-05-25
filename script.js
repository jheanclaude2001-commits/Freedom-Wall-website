// Configuration
const colors = ['#ff7f7f', '#ffeb3b', '#81c784', '#64b5f6', '#ba68c8'];
let selectedColor = colors[0];

document.addEventListener('DOMContentLoaded', () => {
    loadMessages();
    setupColorPicker();
    setupPostButton();
});

// 1. Load Messages on Start
function loadMessages() {
    fetch('fetch.php')
    .then(res => res.json())
    .then(data => {
        const wall = document.getElementById('wall');
        wall.innerHTML = ''; // Clear wall
        data.forEach(msg => {
            createNoteElement(msg.message, msg.note_color, msg.rotation, msg.created_at, wall);
        });
    });
}

// 2. Create Note HTML
function createNoteElement(text, color, rotation, date, container) {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.backgroundColor = color;
    note.style.transform = `rotate(${rotation}deg)`;

    // Clean up date string
    const dateObj = new Date(date);
    const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    note.innerHTML = `
        <div class="pin"></div>
        <div class="note-content">${text}</div>
        <div class="note-date">${dateStr}</div>
    `;

    container.appendChild(note);
}

// 3. Handle Color Selection
function setupColorPicker() {
    const circles = document.querySelectorAll('.color-circle');
    circles.forEach(circle => {
        circle.addEventListener('click', function() {
            // Remove selected class from all
            circles.forEach(c => c.classList.remove('selected'));
            // Add to clicked
            this.classList.add('selected');
            selectedColor = this.getAttribute('data-color');
        });
    });
}

// 4. Handle Posting
function setupPostButton() {
    const btn = document.getElementById('postBtn');
    btn.addEventListener('click', () => {
        const text = document.getElementById('messageText').value;
        
        if(text.trim() === "") {
            alert("Please write something!");
            return;
        }

        // Generate random rotation between -5 and 5 degrees
        const rotation = (Math.random() * 10 - 5).toFixed(2);

        // Send to PHP
        const formData = new FormData();
        formData.append('message', text);
        formData.append('color', selectedColor);
        formData.append('rotation', rotation);

        fetch('save.php', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                // Clear input
                document.getElementById('messageText').value = "";
                
                // Add new note to the beginning of the wall immediately
                const wall = document.getElementById('wall');
                createNoteElement(text, selectedColor, rotation, "Just now", wall);
            }
        })
        .catch(err => console.error(err));
    });
}