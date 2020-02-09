// When the user presses the enter button we will run the function to get recipes
$(document).on('keypress',function(event) {
    if(event.which == 13 && event.target.id === 'recipeSearch') {
        event.preventDefault();
        let inputValue = event.target.value;
        getRecipeList(inputValue);
    }

});

// when then user clicks the search button the app will run the function to find recipes
$('#recipeSearchButton').on('click',function(event) {
    event.preventDefault();
    let inputValue = $('#recipeSearch')[0].value;
    console.log(inputValue);
    
    if (!inputValue) {
        showError(false);
    } else {
        getRecipeList(inputValue);
    }
    

});

//function to populate the array of recipes
function getRecipeList (searchName){
    const edamamURL = `https://api.edamam.com/search?q=${searchName}&app_id=252cc057&app_key=26fd4bacc879752ae72c9f39cbf4e516&from=0&to=10&calories=591-722&health=alcohol-free`;
    $('.Recipes').empty();    
    $.ajax({
        url: edamamURL,
        method: 'GET'
    }).then(function(response){
        
        if (!response || response.hits.length === 0) {
            showError(false);
        } else {
            response.hits.map((i) => {
                let container = $('<div>').attr('class', 'container-fluid');
                let row = $('<div>').attr('class', 'row border').attr('data-nutrients', JSON.stringify(i.recipe.digest));
                let foodImg = $('<img>').attr('class', 'col-md-4 h-25 w-25').attr('src', i.recipe.image);
                let foodName = $('<div>').attr('class', 'col-md-4').text(i.recipe.label);
                let calorieNutrients = $('<div>').attr('class', 'col-md-4').text('Calories: ' + Math.round(i.recipe.calories));       
                row.append(foodImg, foodName, calorieNutrients);
                container.append(row);
                
                $('.Recipes').append(container);
            })
        }
    
    }).catch((err) => {
        console.log(err);
        showError(true);
    })
}

function showError(isAPIError) {
    $.ajax({
        method: 'GET',
        url: 'https://api.spoonacular.com/food/jokes/random?apiKey=03bbe11b8f5b4c9e91360249bbc5613b'
    }).then((joke) => {
        var text = isAPIError ?
            'Something went wrong,' :
            'No items match your search,';
        console.log(joke.text);
        $('.modal-body').html(`${text} please try again and enjoy this funny food joke: <br><br>${joke.text}`)
        $('#modal').modal();
    })
}

