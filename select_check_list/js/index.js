'use strict';
const registerCommunityListWrap = document.querySelector('.select_check_list_container')
const form = document.forms.form_select_check_list
const checkboxs = form.querySelectorAll('.check_box')
const labels = form.querySelectorAll('.check_label')
const btn = form.querySelector('.select_submit')
let checkedIds = []
let notYetCheckboxs = []
checkboxs.forEach(c => {
  c.addEventListener('change',(e) => {
    const isChecked = c.checked
    const id = c.id
    const label = c.nextElementSibling
    if ( isChecked ) {
      checkedIds.push(id)
      const ids = checkedIds.length
      label.setAttribute('data-check-count',ids)
      if (ids === 3) {
        btn.classList.add('slideup')
        registerCommunityListWrap.classList.add('display_select_submit')
      } else if (ids === 5) {
        notYetCheckboxs = [...form.querySelectorAll('.check_box:not(:checked)')]
        notYetCheckboxs.map(c => c.disabled = true)
      }
    } else {
      checkedIds = checkedIds.filter(o => o != id)
      checkboxs.forEach(cbox => {
        cbox.checked = false
        cbox.nextElementSibling.removeAttribute('data-check-count')
      })
      checkedIds.forEach((cid,cidx) => {
        const checkbox = document.querySelector(`input[id="${cid}"]`)
        const label = checkbox.nextElementSibling
        checkbox.checked = true
        label.setAttribute('data-check-count',cidx + 1)
      })
      const ids = checkedIds.length
      if (ids === 2) {
        btn.classList.remove('slideup')
        registerCommunityListWrap.classList.remove('display_select_submit')
      } else if (ids === 4) {
        notYetCheckboxs.map(c => c.disabled = false)
      }
    }
  })
})