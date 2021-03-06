//global variables element from the DOM
const formHeaderEl = document.querySelector('form#select-state-form')
const mainContentEl = document.querySelector('main.main-content')
const apiUrlBase = `https://api.openbrewerydb.org/breweries`

//------------------------------------------STATE OBJECT-----------------------------------------------------------------------------

const state = {
    breweries: [], //this is stored on API others are for app use
    selectedState: '',
    selectedCity: '',
    selectedName: '',
    selectedType: ''

}

//--------------------------------------END OF STATE OBJECT------------------------------------------------------------------------


//---------------------------------------SERVER FUNCTIONS------------------------------------------------------------------------------
//FETCHING DATA WHEN I NEED 4 DIFFERENT SCENARIOS

//getBreweriesByStateDataFromServer :: (string) ==> promise(json)
function getBreweriesByStateDataFromServer(formInputStateParam) {

    return fetch(`${apiUrlBase}?per_page=50&page=1&by_state=${formInputStateParam}`)        
        .then(function (response) 
        {
            return response.json()
        })

}

//getBreweriesByNameDataFromServer :: (string, string) ==> promise(json)
function getBreweriesByNameDataFromServer(formInputNameParam, formInputStateParam) {

    return fetch(`${apiUrlBase}?page=1&by_state=${formInputStateParam}&by_name=${formInputNameParam}`)        
        .then(function (response) 
        {
            return response.json()
        })

}

//getBreweriesByTypeDataFromServer :: (string, string) ==> promise(json)
function getBreweriesByTypeDataFromServer(formInputTypeParam, formInputStateParam) {

    return fetch(`${apiUrlBase}?page=1&by_state=${formInputStateParam}&by_type=${formInputTypeParam}`)        
        .then(function (response) 
        {
            return response.json()
        })

}

//getBreweriesByCityDataFromServer :: (string, string) ==> promise(json) this is not called replaced by the one below
function getBreweriesByCityDataFromServer(formInputCityParam, formInputStateParam) {

    return fetch(`${apiUrlBase}?page=1&by_state=${formInputStateParam}&by_city=${formInputCityParam}`)        
        .then(function (response) 
        {
            // console.log(response.json())
            return response.json()
        })

}

//getBreweriesByCityAndTypeDataFromServer :: (string, string, string) ==> promise(json)
function getBreweriesByCityAndTypeDataFromServer(formInputCityParam, formInputStateParam, formInputTypeParam) {

    return fetch(`${apiUrlBase}?page=1&by_state=${formInputStateParam}&by_city=${formInputCityParam}&by_type=${formInputTypeParam}`)        
        .then(function (response) 
        {
            // console.log(response.json())
            return response.json()
        })

}

//-----------------------------------------------END OF SERVER FUNCTIONS--------------------------------------------------------------------


//------------------------------------------------HELPER FUNCTIONS---------------------------------------------------------------------------

//returns nothing also no input, just does stuff when called, changes state, gets stuff from the function call and rerenders
function listenToFormStateSubmit() {

    formHeaderEl['select-state'].value = state.selectedState

    formHeaderEl.addEventListener('submit' ,function(event) {

        event.preventDefault()

        if (formHeaderEl['select-state'].value === '') {
            console.log('Empty space in form, exit program no render')
        }

        else {

            //FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
            getBreweriesByStateDataFromServer(formHeaderEl['select-state'].value)
                .then(function (breweriesArrayFromServer) {

                state.breweries = breweriesArrayFromServer //updates the state
                state.selectedState = formHeaderEl['select-state'].value //updates the state
                render() //rerender after changing state

            })

        } //end of else

    }) //end of event listener
 
}

//--------------------------------------------END OF HELPER FUNCTIONS-----------------------------------------------------------------


//------------------------------------------------RENDER FUNCTIONS----------------------------------------------------------------------

//this render filter, takes an array states.breweries and doesnt return
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
    optionEl3.setAttribute('value', 'regional')
    optionEl3.textContent = 'Regional'

    const optionEl4 = document.createElement('option')
    optionEl4.setAttribute('value', 'brewpub')
    optionEl4.textContent = 'Brewpub'

    //appending to the form
    selectEl.append(optionEl1, optionEl2, optionEl3, optionEl4)
    formEl1.append(labelEl1, selectEl)

    selectEl.value = state.selectedType //linking this with the state

    //event listener to the select option
    selectEl.addEventListener('change', function() {

        // event.preventDefault()
        // optionEl1.textContent = selectEl.options[selectEl.selectedIndex].text

        // FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
        getBreweriesByTypeDataFromServer(selectEl.value, state.selectedState) //give me errors cause i parsed the Brewpub text content
            .then(function (breweriesArrayFromServer) {

                 //i did this selectEl.options[selectEl.selectedIndex].text
                state.breweries = breweriesArrayFromServer //updates and changes state value
                state.selectedType = selectEl.value //updates and changes state value

                render() //rerenders content in the page after updating state

            })

    });


    //CHECKBOX LIST
    const divEl = document.createElement('div')
    divEl.setAttribute('class', 'filter-by-city-heading')

    const h3DivEl = document.createElement('h3')
    h3DivEl.textContent = 'Cities'

    const btnDivEl = document.createElement('button')
    btnDivEl.setAttribute('class', 'clear-all-btn')
    btnDivEl.textContent = 'Clear All'

    //appending to div
    divEl.append(h3DivEl, btnDivEl)


    //checkbox form
    const formEl2 = document.createElement('form')
    formEl2.setAttribute('id', 'filter-by-city-form')

    //destroy then recreate
    formEl2.innerHTML = ''

    for (const brewery of breweriesArrayParam) {

        const inputEl = document.createElement('input')
        inputEl.setAttribute('type', 'checkbox')
        inputEl.setAttribute('name', `${brewery.city}`) //it didnt work with just variable name
        inputEl.setAttribute('value', `${brewery.city}`) //also this didnt

        const labelEl = document.createElement('label')
        labelEl.setAttribute('for', `${brewery.city}`)
        labelEl.textContent = brewery.city

        //appending elements to their parent form
        formEl2.append(inputEl, labelEl)

        // if (inputEl.value === state.selectedCity) {

        //     inputEl.checked //linking state and dom

        // }


        //event listener to the select option
        inputEl.addEventListener('change', function() {

            if (inputEl.checked) { 

                // FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
                getBreweriesByCityAndTypeDataFromServer(inputEl.value, state.selectedState, state.selectedType) //give me errors cause i parsed the Brewpub text content
                    .then(function (breweriesArrayFromServer) {

                         //i did this selectEl.options[selectEl.selectedIndex].text
                        console.log(breweriesArrayFromServer) //just for checking debugging things

                        state.breweries = breweriesArrayFromServer//we always change the state after events array gets data from FETCH from API
                        state.selectedCity = inputEl.value //update the state value didnt work with .value
                        console.log(state.breweries) //HERE THE PROBLEM DONT KNOW WHAT HAPPENS AFTER INPUT IS CHECKED BUG
                       
                        render() //rerenders the page after chaning state

                    })

            }

        });

    }

    //append everything to the aside element
    asideEl.append(h2El, formEl1, divEl, formEl2)
    mainContentEl.append(asideEl)

}

//this render list, takes an array states.breweries and doesnt return
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

    formEl['search-breweries'].value = state.selectedName //linking state and DOM

    //event listener to this form to check by NAME
    formEl.addEventListener('submit' ,function(event) {

        event.preventDefault() //when you have submit form this should prevent reloading of the page

        // FETCHING AND STORING DATA FROM SERVER TO STATE both arrays from json server
        getBreweriesByNameDataFromServer(formEl['search-breweries'].value, state.selectedState)
            .then(function (breweriesArrayFromServer) {

                state.breweries = (breweriesArrayFromServer) //updates the state
                state.selectedName = formEl['search-breweries'].value //updates the state
    
                render() //rerenders the page after changing state
            })


    })


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

//this renders main, this doesnt return anything, destroys and recreates the main, and calls 2 other render sections
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

    // listenToFormStateSubmit() same thing as below
    render()
    listenToFormStateSubmit()

}

//-------------------------------------------END OF RENDER FUNCTIONS--------------------------------------------------------------------------


//---------------------------------------------------APP START---------------------------------------------------------------------------
init()