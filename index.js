//global variables element from the DOM
const formHeaderEl = document.querySelector('form#select-state-form')
const mainContentEl = document.querySelector('main.main-content')


//-----------------------------------STATE OBJECT--------------------------------------

const state = {
    breweries: []
}

//--------------------------------END OF STATE OBJECT--------------------------------


//--------------------------SERVER FUNCTIONS-------------------------------------

function getBreweriesDataFromServer() {

    return fetch(`https://api.openbrewerydb.org/breweries?per_page=10&page=5`)
        .then(function (response) 
    {
        return response.json()
    })

}

function getBreweriesByStateDataFromServer(formInputStateParam) {

    return fetch(`https://api.openbrewerydb.org/breweries?per_page=10&page=5&by_state=${formInputStateParam}`)        .then(function (response) 
    {
        return response.json()
    })

}

//--------------------------END OF SERVER FUNCTIONS-------------------------------


//--------------------------HELPER FUNCTIONS-------------------------------------

function listenToFormStateSubmit() {

    formHeaderEl.addEventListener('submit' ,function(event) {

        event.preventDefault()

        //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
        getBreweriesByStateDataFromServer(formHeaderEl['select-state'].value)
            .then(function (breweriesArrayFromServer) {
                state.breweries = breweriesArrayFromServer
                formHeaderEl.reset()
                render()
            })

    })

}

//--------------------------END OF HELPER FUNCTIONS-------------------------------


//--------------------------RENDER FUNCTIONS-------------------------------------

function renderFilterSection(breweriesArrayParam) {

    const asideEl = document.createElement('aside')
    asideEl.setAttribute('class', 'filters-section')

    const h2El = document.createElement('h2')
    h2El.textContent = 'Filter By:'

    const formEl1 = document.createElement('form')
    formEl1.setAttribute('id', 'filter-by-type-form')
    formEl1.setAttribute('autocomplete', 'off')

    const labelEl1 = document.createElement('label')
    labelEl1.setAttribute('for', 'filter-by-type')

    const h3El = document.createElement('h3')
    h3El.textContent = 'Type of Brewery'
    labelEl1.append(h3El)

    const selectEl = document.createElement('select')
    selectEl.setAttribute('name', 'filter-by-type')
    selectEl.setAttribute('id', 'filter-by-type')

    const optionEl1 = document.createElement('option')
    optionEl1.setAttribute('value', '')
    optionEl1.textContent = 'Select a type....'

    const optionEl2 = document.createElement('option')
    optionEl2.setAttribute('value', 'micro')
    optionEl2.textContent = 'Micro'

    const optionEl3 = document.createElement('option')
    optionEl3.setAttribute('value', 'reginal')
    optionEl3.textContent = 'Regional'

    const optionEl4 = document.createElement('option')
    optionEl4.setAttribute('value', 'brewpub')
    optionEl4.textContent = 'Brewpub'

    //appending to the form
    selectEl.append(optionEl1, optionEl2, optionEl3, optionEl4)
    formEl1.append(labelEl1, selectEl)

    
    const divEl = document.createElement('div')
    divEl.setAttribute('class', 'filter-by-city-heading')

    const h3DivEl = document.createElement('h3')
    h3DivEl.textContent = 'Cities'

    const btnDivEl = document.createElement('button')
    btnDivEl.setAttribute('class', 'clear-all-btn')
    btnDivEl.textContent = 'Clear All'

    //appending to div
    divEl.append(h3DivEl, btnDivEl)


    const formEl2 = document.createElement('form')
    formEl2.setAttribute('id', 'filter-by-city-form')

    formEl2.innerHTML = ''

    for (const brewery of breweriesArrayParam) {

        const inputEl = document.createElement('input')
        inputEl.setAttribute('type', 'checkbox')
        inputEl.setAttribute('name', brewery.city)
        inputEl.setAttribute('value', brewery.city)

        const labelEl = document.createElement('label')
        labelEl.setAttribute('for', brewery.city)
        labelEl.textContent = brewery.city

        // const inputEl2 = document.createElement('input')
        // inputEl2.setAttribute('type', 'checkbox')
        // inputEl2.setAttribute('name', 'cincinnati')
        // inputEl2.setAttribute('value', 'cincinnati')

        // const labelEl3 = document.createElement('label')
        // labelEl3.setAttribute('for', 'cincinnati')
        // labelEl3.textContent = 'Cincinnati'

        //appending elements to their parent form
        formEl2.append(inputEl, labelEl)
    }

    //append everything to the aside element
    asideEl.append(h2El, formEl1, divEl, formEl2)
    mainContentEl.append(asideEl)

}

function renderListSection(breweriesArrayParam) {

    const h1El = document.createElement('h1')
    h1El.textContent = 'List of Breweries'

    const headerEl = document.createElement('header')
    headerEl.setAttribute('class', 'search-bar')

    const formEl = document.createElement('form')
    formEl.setAttribute('id', 'search-breweries-form')
    formEl.setAttribute('autocomplete', 'off')

    const labelFormEl = document.createElement('label')
    labelFormEl.setAttribute('for', 'search-breweries')

    const h2El = document.createElement('h2')
    h2El.textContent = 'Search Breweries'
    labelFormEl.append(h2El)

    const inputEl = document.createElement('input')
    inputEl.setAttribute('id', 'search-breweries')
    inputEl.setAttribute('name', 'search-breweries')
    inputEl.setAttribute('type', 'text')

    //appending in header
    formEl.append(labelFormEl, inputEl)
    headerEl.append(formEl)


    //creating article inside the main
    const articleEl = document.createElement('article')

    //creating the UL inside ARTICLE
    const ulArticleEl = document.createElement('ul')
    ulArticleEl.setAttribute('class', 'breweries-list')
    
    //destroy then recreate each time i rerender the ul with li in a for of loop
    ulArticleEl.innerHTML = ''

    for (const breweryObject of breweriesArrayParam) {

        //CREATING THE LI INSIDE UL
        const liArticleEl = document.createElement('li')

        const h2ArticleEl = document.createElement('h2')
        h2ArticleEl.textContent = breweryObject.name

        const divArticleEl = document.createElement('div')
        divArticleEl.setAttribute('class', 'type')
        divArticleEl.textContent = breweryObject.brewery_type


        const sectionArticleEl1 = document.createElement('section')
        sectionArticleEl1.setAttribute('class', 'address')

        const h3SectionEl1 = document.createElement('h3')
        h3SectionEl1.textContent = 'Address'

        const pSectionEl1 = document.createElement('p')
        pSectionEl1.textContent = `${breweryObject.street}`

        const pSectionEl2 = document.createElement('p')

        const strongSectionEl = document.createElement('strong')
        strongSectionEl.textContent = `${breweryObject.city}, ${breweryObject.postal_code}`

        pSectionEl2.append(strongSectionEl)
        sectionArticleEl1.append(h3SectionEl1, pSectionEl1, pSectionEl2)


        const sectionArticleEl2 = document.createElement('section')
        sectionArticleEl2.setAttribute('class', 'phone')

        const h3SectionEl2 = document.createElement('h3')
        h3SectionEl2.textContent = 'Phone:'

        const pSectionEl3 = document.createElement('p')
        pSectionEl3.textContent = breweryObject.phone

        sectionArticleEl2.append(h3SectionEl2, pSectionEl3)


        const sectionArticleEl3 = document.createElement('section')
        sectionArticleEl3.setAttribute('class', 'link')

        const aSectionEl = document.createElement('a')
        aSectionEl.setAttribute('href', `${breweryObject.website_url}`)
        aSectionEl.setAttribute('target', '_blank')
        aSectionEl.textContent = 'Visit Website'

        sectionArticleEl3.append(aSectionEl)

        //append all to the li
        liArticleEl.append(h2ArticleEl, divArticleEl, sectionArticleEl1, sectionArticleEl2, sectionArticleEl3)
        ulArticleEl.append(liArticleEl)
    }

    articleEl.append(ulArticleEl)

    //append everything to the main
    mainContentEl.append(h1El, headerEl, articleEl)

}

function renderMain(breweriesArrayParam) {

     //we destroy everything then recreate each time it renders the page and state changes
     mainContentEl.innerHTML = ''

     //recreate using the array to create individual render each post basech on each object inside the array
 
    renderFilterSection(breweriesArrayParam)
    renderListSection(breweriesArrayParam)
     
}

function render() {
    renderMain(state.breweries)
}

function init() {

    render()

    //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
    getBreweriesDataFromServer()
        .then(function (breweriesArrayFromServer) 
        {
            state.breweries = breweriesArrayFromServer
            render()
        })

    listenToFormStateSubmit()

}

//--------------------------END OF RENDER FUNCTIONS-------------------------------


//--------------------------------APP START------------------------------------------
init()