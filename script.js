document.getElementById('surveyForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Mostrar el loader al enviar el formulario
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    // Objeto para contar los puntos de cada categoría
    const scores = {
        mimos: 0,
        belleza: 0,
        abrazo: 0,
        salud: 0,
        hogar: 0,
        innovacion: 0
    };

    // Sumar puntos de cada selección de respuesta en el formulario
    Array.from(document.querySelectorAll('.form-select')).forEach(select => {
        const category = select.value;
        if (scores.hasOwnProperty(category)) {
            scores[category] += 1;  // Aumenta en 1 el contador para la categoría seleccionada
        }
    });

    // Tomar la categoría de la última pregunta y añadir 2 puntos adicionales
    let lastQuestionCategory = document.querySelector('#best').value;
    if (scores.hasOwnProperty(lastQuestionCategory)) {
        scores[lastQuestionCategory] += 2;  // Aumenta en 2 puntos adicionales para la última pregunta
    }

    console.log(scores);

    // Determinar el puntaje máximo
    let maxScore = Math.max(...Object.values(scores));

    // Encontrar todas las categorías con el puntaje máximo
    let maxCategories = Object.keys(scores).filter(key => scores[key] === maxScore);

    // Carga los productos filtrados por cualquier categoría con puntaje máximo
    fetch('products_description.json')
        .then(response => response.json())
        .then(products => {
            let filteredProducts = products.filter(product => maxCategories.includes(product.category) || product.category === lastQuestionCategory);
            displayProducts(filteredProducts);

            // Ocultar el loader después de un segundo como mínimo
            setTimeout(function() {
                loader.style.display = 'none';
            }, 1000);
        });
});

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        productList.innerHTML += `
            <div class="col-md-3 col-12 fila">
                <div class="card">
                    <div class="card-body">
                        <img class="card-img-top" src="${product.image}" alt="Imagen de ${product.name}">
                        <h5 class="card-title">${product.name}</h5>
                        <h6>${product.etiqueta}</h6>
                        <p>${product.description}</p>
                        <p class="price">${product.price}</p>
                        <a target="_blank" href="${product.url}" class="buttonvermas"><img src="images/bag.png" alt="Icono Buscar" class="icono-btn">Ver en la tienda</a>
                    </div>
                </div>
            </div>`;
    });
}
