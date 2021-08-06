/* This consult_details.js JS file contains all the logic to display the consult details view properly, it's composed of
   three sections, the variable declaration, the details container events and the prescription modal events. */

let detailsContainer = document.querySelector('.details-container')
let prescriptionModal = document.querySelector('.prescription-modal')
let prescriptionModalContent = document.querySelector('.prescription-modal-content')
let exams = document.querySelectorAll('.exam')
let examsModal = document.querySelector('.exam-preview')
let examImg = document.querySelector('#exam-image')

/*///////////////////////////////////////////////////// Details Container ////////////////////////////////////////////*/

// Details container events
if (detailsContainer){

    // Details container mouseover events
    detailsContainer.addEventListener('mouseover', (e) => {

        if (e.target.classList.contains('print-prescription')){
            e.target.classList.add('print-prescription--active')
        }

        if (e.target.classList.contains('exam')){
            examsModal.classList.add('exam-preview--display')
            examImg.src = e.target.href
        }

    })

    // Details container mouseout events
    detailsContainer.addEventListener('mouseout', (e) => {

        if (e.target.classList.contains('print-prescription')){
            e.target.classList.remove('print-prescription--active')
        }

        if (e.target.classList.contains('exam')){
            examsModal.classList.remove('exam-preview--display')
        }

    })

    // Details container click events
    detailsContainer.addEventListener('click', (e) => {

        if (e.target.classList.contains('print-prescription')){
            let pdfPath = e.target.getAttribute('data-pdf')
            prescriptionModal.classList.add('prescription-modal--display')
            PDFObject.embed(pdfPath, prescriptionModalContent)
        }

        if (e.target.classList.contains('exam')){
            e.preventDefault()
            e.stopPropagation()
        }

    })
}

/*///////////////////////////////////////////////////// Prescription Modal ////////////////////////////////////////////*/

// Prescription Modal Events
// Prescription Modal Click Events
prescriptionModal.addEventListener('click', (e) => {
    if (e.target === prescriptionModal){
        prescriptionModal.classList.remove('prescription-modal--display')
    }
})

