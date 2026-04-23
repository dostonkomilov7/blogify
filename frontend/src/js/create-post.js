import { getCookie } from "./main.js";

document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const titleInput = document.getElementById('titleInput');
    const publishBtn = document.getElementById('publishBtn');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    const saveDot = document.getElementById('saveDot');
    const saveStatus = document.getElementById('saveStatus');
    const tagRow = document.getElementById('tagRow');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagInput = document.getElementById('tagInput');
    const linkModal = document.getElementById('linkModal');
    const linkUrl = document.getElementById('linkUrl');
    const linkConfirm = document.getElementById('linkConfirm');
    const linkCancel = document.getElementById('linkCancel');
    const fileInput = document.getElementById('postImage');


    function autoResize(el) {
        el.style.height = 'auto';
        el.style.height = el.scrollHeight + 'px';
    }

    titleInput.addEventListener('input', () => autoResize(titleInput));

    const savedTitle = localStorage.getItem('editor_title');
    const savedContent = localStorage.getItem('editor_content');

    if (savedTitle) { titleInput.value = savedTitle; autoResize(titleInput); }
    if (savedContent) { editor.innerHTML = savedContent; }

    updateCount();

    function updateCount() {
        const text = editor.innerText || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        wordCount.textContent = words;
        charCount.textContent = text.length;
    }

    editor.addEventListener('input', () => {
        updateCount();
        triggerAutoSave();
    });

    titleInput.addEventListener('input', triggerAutoSave);

    let saveTimer = null;

    function triggerAutoSave() {
        clearTimeout(saveTimer);
        saveStatus.textContent = 'Saqlanmoqda...';
        saveDot.style.background = '#f59e0b';

        saveTimer = setTimeout(() => {
            localStorage.setItem('editor_title', titleInput.value);
            localStorage.setItem('editor_content', editor.innerHTML);
            saveStatus.textContent = 'Saqlandi';
            saveDot.style.background = '#10b981';
        }, 1200);
    }

    function execFormat(cmd) {
        editor.focus();

        if (cmd === 'ul') {
            document.execCommand('insertUnorderedList');
        } else if (cmd === 'ol') {
            document.execCommand('insertOrderedList');
        } else if (cmd === 'blockquote') {
            document.execCommand('formatBlock', false, 'blockquote');
        } else if (['h1', 'h2', 'p'].includes(cmd)) {
            document.execCommand('formatBlock', false, cmd);
        } else if (cmd === 'link') {
            openLinkModal();
            return;
        } else {
            document.execCommand(cmd);
        }

        updateToolbarState();
    }

    document.getElementById('toolbar').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cmd]');
        if (!btn) return;
        execFormat(btn.dataset.cmd);
    });

    function updateToolbarState() {
        ['bold', 'italic', 'underline', 'strikeThrough'].forEach(cmd => {
            const btn = document.getElementById('btn-' + cmd);
            if (btn) btn.classList.toggle('active', document.queryCommandState(cmd));
        });
    }

    editor.addEventListener('mouseup', updateToolbarState);
    editor.addEventListener('keyup', updateToolbarState);

    editor.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') { e.preventDefault(); execFormat('bold'); }
            if (e.key === 'i') { e.preventDefault(); execFormat('italic'); }
            if (e.key === 'u') { e.preventDefault(); execFormat('underline'); }
        }
    });

    tagRow.addEventListener('click', (e) => {
        if (e.target.classList.contains('tag-x')) {
            e.target.closest('.tag').remove();
        }
    });

    addTagBtn.addEventListener('click', () => {
        addTagBtn.style.display = 'none';
        tagInput.style.display = 'inline-block';
        tagInput.focus();
    });

    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const val = tagInput.value.trim().replace(/^#+/, '');
            if (val) {
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.innerHTML = '#' + val + ' <button class="tag-x">✕</button>';
                tagRow.insertBefore(tag, document.querySelector('.add-tag-wrap'));
            }
            resetTagInput();
        }
        if (e.key === 'Escape') resetTagInput();
    });

    tagInput.addEventListener('blur', () => {
        setTimeout(resetTagInput, 150);
    });

    function resetTagInput() {
        tagInput.value = '';
        tagInput.style.display = 'none';
        addTagBtn.style.display = '';
    }

    let savedRange = null;

    function openLinkModal() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount) {
            savedRange = sel.getRangeAt(0).cloneRange();
        }
        linkModal.classList.add('open');
        setTimeout(() => linkUrl.focus(), 50);
    }

    function closeLinkModal() {
        linkModal.classList.remove('open');
        linkUrl.value = '';
        savedRange = null;
    }

    linkConfirm.addEventListener('click', () => {
        const url = linkUrl.value.trim();
        if (!url) return;

        editor.focus();
        if (savedRange) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(savedRange);
        }

        document.execCommand('createLink', false, url);

        editor.querySelectorAll('a').forEach(a => {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        });

        closeLinkModal();
    });

    linkCancel.addEventListener('click', closeLinkModal);

    linkUrl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') linkConfirm.click();
        if (e.key === 'Escape') closeLinkModal();
    });

    linkModal.addEventListener('click', (e) => {
        if (e.target === linkModal) closeLinkModal();
    });


    publishBtn.addEventListener('click', async () => {
        const title = titleInput.value.trim();
        const content = editor.innerText.trim();
        const image = fileInput.files[0];

        if (!image) { alert('Iltimos, rasm tanlang!'); return; }
        if (!title) { alert('Iltimos, sarlavha yozing!'); titleInput.focus(); return; }
        if (!content) { alert('Iltimos, matn yozing!'); editor.focus(); return; }

        await createPost(title, content, image)
        titleInput.value = "";
        editor.innerText = "";
        fileInput.value = "";
        localStorage.clear();
        
        alert('✅ Post nashr etildi!\n\n' + title);

        setTimeout(() => {
            window.location.href = "/src/page/home-page.html";
        },);
        
    });

});

const createPost = async (title, content, image) => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const cookies = document.cookie.split('; ').at(2);
        const [key, id] = cookies.split('=');

        const formData = new FormData();

        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        formData.append('created_by', id);

        const response = await fetch(`${apiUrl}/posts`, {
            method: 'POST',
            body: formData
        });
        return;
    } catch (error) {
        console.error('Error:', error);
    }
};
