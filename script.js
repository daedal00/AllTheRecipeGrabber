document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById('searchButton');
    const ingredientInput = document.getElementById('ingredientInput');
    const resultsList = document.getElementById('resultsList');
    const detailsContainer = document.getElementById('detailsContainer');
    const closeDetails = document.getElementById('closeDetails');

    searchButton.addEventListener('click', function() {
        detailsContainer.style.display = 'none';
        detailsContainer.innerHTML = '';
        resultsList.style.display = 'none';
        const ingredients = ingredientInput.value;
        searchRecipes(ingredients).then(displayResults);
    });

    async function searchRecipes(ingredients) {
        const response = await fetch(`https://alltherecipeapi.onrender.com/search?ingredients=${ingredients}`);
        // const response = await fetch(`http://localhost:5000/search?ingredients=${ingredients}`);
        const data = await response.json();

        return data;
    }

    function displayResults(recipes) {
        resultsList.style.display = 'block';
    
        resultsList.innerHTML = '';
    
        recipes.forEach(recipe => {
            const listItem = document.createElement('li');
            listItem.textContent = recipe.name;
            listItem.addEventListener('click', function() {
                (async function() {
                    const details = await getRecipeDetails(recipe.url);
                    displayDetails(details);
                })();
            });
            resultsList.appendChild(listItem);
        });
    }
        

    async function getRecipeDetails(url) {
        const response = await fetch(`https://alltherecipeapi.onrender.com/details/${encodeURIComponent(url)}`);
        // const response = await fetch (`http://localhost:5000/details/${encodeURIComponent(url)}`);
        const data = await response.json();

        return data;
    }

    function displayDetails(recipe) {
        const closeButton = '<span id="closeDetails" style="cursor: pointer; float: right; padding: 5px;">&times;</span>';
        
        detailsContainer.innerHTML = closeButton + `
            <h2>${recipe.name}</h2>
            <p>Rating: ${recipe.rating}</p>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
            <a href="${recipe.url}" target="_blank">View Full Recipe</a>
        `;
        detailsContainer.style.display = 'block';
        
        document.getElementById('closeDetails').addEventListener('click', function() {
            detailsContainer.style.display = 'none'; 
        });
    }
});