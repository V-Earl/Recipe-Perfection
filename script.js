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
            response.hits.map((i, index) => {
                let div = $('<div>').attr('class', 'row border recipe').attr('data-nutrients', JSON.stringify(i));
                let foodImg = $('<img>').attr('class', 'col-md-4 col-sm-4 col-xs-4  h-25 w-25').attr('src', i.recipe.image);
                let foodName = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(i.recipe.label);
                let calorieNutrients = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text('Calories: ' + Math.round(i.recipe.calories));       
                div.append(foodImg, foodName, calorieNutrients);
                // container.append(row);
                
                $('.Recipes').append(div);
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

$(document).on('click', '.recipe', function() {
    $('#ingredients').empty();
    $('#nutrients').empty();
    let data = $(this).attr('data-nutrients');
    let recipe = JSON.parse(data);
    console.log(recipe);
    let inputValue = $('#recipeSearch')[0].value;
    let healthLabel = ''; 
    let cautions = '';
    let foodWords = ['tasty', 'succulent', 'delicious', 'scrumptious', 'divine', 'flavorful', 'mouthwatering', 'yummy']
    let thisWord = foodWords[Math.floor(Math.random() * foodWords.length)];

    recipe.recipe.healthLabels.map((h, i) => {
        healthLabel = healthLabel + h;
        
        if (i != recipe.recipe.healthLabels.length) {
            healthLabel + ', ';
        }
        
    })

    recipe.recipe.cautions.map((c, i) => {
        cautions = cautions + c;
        
        if (i != recipe.recipe.cautions.length) {
            cautions + ', ';
        }
        
    })

    console.log(JSON.parse(data));
    $('#recipe-img').attr('src', recipe.recipe.image).attr('alt', recipe.recipe.label);
    $('#recipe-name').text(recipe.recipe.label);
    $('#recipe-description').html('This ' + thisWord + ' ' + inputValue + ' recipe is brought to you by ' + recipe.recipe.source + '.' + 
        '<br>Health Labels: ' + healthLabel + '<br> Cautions: ' + cautions + '<br> Yealds: ' + recipe.recipe.yield + ' Servings');

    // This is the ingredients   
    let ingredientsDiv = $('#ingredients');
    recipe.recipe.ingredientLines.map(i => {
        let li = $('<li>').attr('class', 'list-group-item').text(i);
        ingredientsDiv.append(li);
    })

    // nutrients area
    let nutrientsId = $('#nutrients');
    let nutrientHeader = $('<div>').attr('class', 'row border');
    let labelHeader = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4 font-weight-bold').text('Nutrient');
    let totalHeader = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4 font-weight-bold').text('Total');
    let dailyHeader = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4 font-weight-bold').text('Daily Total');
    nutrientHeader.append(labelHeader, totalHeader, dailyHeader);
    nutrientsId.append(nutrientHeader);

    recipe.recipe.digest.map(nutrient => {
        let div = $('<div>').attr('class', 'row border');
        let label = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(nutrient.label);
        let total = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(Math.round(nutrient.total) + nutrient.unit);
        let daily = $('<div>').attr('class', 'col-md-4 col-sm-4 col-xs-4').text(Math.round(nutrient.daily) + nutrient.unit);
        div.append(label, total, daily);
        nutrientsId.append(div);
    })
})
