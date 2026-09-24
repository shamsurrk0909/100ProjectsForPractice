
    // --- Utilities ---
    const LS_KEY = 'flashcards_day9_v1'
    const qs = sel => document.querySelector(sel)
    const qsa = sel => Array.from(document.querySelectorAll(sel))

    // sample starter data if none exists
    const starter = [
      {id: Date.now()+1, q: 'HTML stands for?', a: 'HyperText Markup Language'},
      {id: Date.now()+2, q: 'What does CSS control?', a: 'Presentation: layout, colors, fonts\nUse selectors to target elements.'}
    ]

    // load from storage
    function loadCards(){
      try{
        const raw = localStorage.getItem(LS_KEY)
        if(!raw) return starter.slice()
        const parsed = JSON.parse(raw)
        if(!Array.isArray(parsed)) return []
        return parsed
      }catch(e){console.error('load error', e); return []}
    }

    function saveCards(cards){
      localStorage.setItem(LS_KEY, JSON.stringify(cards))
    }

    // --- DOM rendering ---
    const grid = qs('#grid')
    const empty = qs('#empty')

    function render(){
      const cards = loadCards()
      grid.innerHTML = ''
      if(cards.length === 0){ empty.style.display = 'block'; return }
      empty.style.display = 'none'

      cards.forEach(card => {
        const wrap = document.createElement('div')
        wrap.className = 'card'

        const inner = document.createElement('div')
        inner.className = 'card-inner'

        const front = document.createElement('div')
        front.className = 'face front'
        const qEl = document.createElement('p')
        qEl.className = 'q'
        // set as text to preserve spaces and newlines (pre-wrap CSS will show them)
        qEl.innerText = card.q
        front.appendChild(qEl)

        const meta = document.createElement('div')
        meta.className = 'meta'
        const small = document.createElement('small')
        small.innerText = 'Click to flip'
        meta.appendChild(small)

        const actions = document.createElement('div')
        actions.className = 'card-actions'

        const reveal = document.createElement('button')
        reveal.className = 'ghost'
        reveal.innerText = 'Reveal'
        reveal.addEventListener('click', e=>{
          e.stopPropagation()
          wrap.classList.add('is-flipped')
        })

        const edit = document.createElement('button')
        edit.className = 'ghost'
        edit.innerText = 'Edit'
        edit.addEventListener('click', e=>{
          e.stopPropagation()
          openFormForEdit(card.id)
        })

        const del = document.createElement('button')
        del.className = 'ghost'
        del.innerText = 'Delete'
        del.addEventListener('click', e=>{
          e.stopPropagation()
          if(confirm('Delete this card?')){
            const after = loadCards().filter(c=>c.id !== card.id)
            saveCards(after)
            render()
          }
        })

        actions.appendChild(reveal)
        actions.appendChild(edit)
        actions.appendChild(del)

        front.appendChild(meta)
        front.appendChild(actions)

        const back = document.createElement('div')
        back.className = 'face back'
        const aEl = document.createElement('p')
        aEl.className = 'a'
        // preserve spaces/newlines using innerText
        aEl.innerText = card.a
        back.appendChild(aEl)

        // inner click flips
        wrap.addEventListener('click', ()=>{
          wrap.classList.toggle('is-flipped')
        })

        inner.appendChild(front)
        inner.appendChild(back)
        wrap.appendChild(inner)
        grid.appendChild(wrap)
      })
    }

    // --- Form handling ---
    const addBtn = qs('#addBtn')
    const formArea = qs('#formArea')
    const saveBtn = qs('#saveCard')
    const cancelBtn = qs('#cancelSave')
    const question = qs('#question')
    const answer = qs('#answer')
    let editingId = null

    addBtn.addEventListener('click', ()=>{
      openFormForNew()
    })
    cancelBtn.addEventListener('click', ()=>{
      hideForm()
    })

    function openFormForNew(){
      editingId = null
      question.value = ''
      answer.value = ''
      formArea.style.display = 'block'
      question.focus()
    }

    function openFormForEdit(id){
      const cards = loadCards()
      const found = cards.find(c=>c.id===id)
      if(!found) return alert('Card not found')
      editingId = id
      question.value = found.q
      answer.value = found.a
      formArea.style.display = 'block'
      question.focus()
    }

    function hideForm(){
      formArea.style.display = 'none'
      editingId = null
    }

    saveBtn.addEventListener('click', ()=>{
      const qtxt = question.value.trimEnd() // keep internal spaces/newlines, remove trailing blank lines
      const atxt = answer.value.trimEnd()
      if(!qtxt){ alert('Please type a question'); return }
      const cards = loadCards()
      if(editingId){
        const idx = cards.findIndex(c=>c.id===editingId)
        if(idx>-1){ cards[idx].q = qtxt; cards[idx].a=atxt }
      } else {
        cards.unshift({id: Date.now(), q: qtxt, a: atxt})
      }
      saveCards(cards)
      hideForm()
      render()
    })

    // --- Export / Import / Clear ---
    const exportBtn = qs('#exportBtn')
    const importBtn = qs('#importBtn')
    const clearBtn = qs('#clearBtn')

    exportBtn.addEventListener('click', ()=>{
      const data = localStorage.getItem(LS_KEY) || '[]'
      // download as file
      const blob = new Blob([data], {type:'application/json'})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'flashcards-export.json'
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
    })

    importBtn.addEventListener('click', ()=>{
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'application/json'
      input.onchange = () => {
        const f = input.files[0]
        if(!f) return
        const reader = new FileReader()
        reader.onload = e => {
          try{
            const parsed = JSON.parse(e.target.result)
            if(!Array.isArray(parsed)) throw new Error('invalid')
            saveCards(parsed)
            render()
            alert('Imported ' + parsed.length + ' cards')
          }catch(err){alert('Import failed: invalid file')}
        }
        reader.readAsText(f)
      }
      input.click()
    })

    clearBtn.addEventListener('click', ()=>{
      if(confirm('Delete all flashcards?')){
        localStorage.removeItem(LS_KEY)
        render()
      }
    })

    // initial render
    render()

    // expose for debugging
    window._flashcards = {loadCards, saveCards, render}
