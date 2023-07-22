document.addEventListener("DOMContentLoaded", function () {

    carregarArquivos();
});

async function carregarArquivos() {
    const mainCategory = [];
    const order = [];

    const url = 'mainCategory.csv';

    const response = await fetch(url);
    const data = await response.text();


    const table = data.split('\n');
    table.forEach(row => {
        const column = row.split(';');
        const main = column[1];
        mainCategory.push(main)

    })


    const url2 = 'order.csv';
    const response2 = await fetch(url2);
    const data2 = await response2.text();


    const table2 = data2.split('\n');
    table2.forEach(row2 => {
        const column2 = row2.split(';');
        order.push({ main: column2[6], page2: column2[7] })

    })

    filterData(mainCategory, order)
}


function saoIguais(objeto1, objeto2) {
    return objeto1.main === objeto2.main && objeto1.page2 === objeto2.page2 && objeto1.desc === objeto2.desc;
}

function removerDuplicados(array) {
    return array.filter((item, index) => {
        return index === array.findIndex(objeto => saoIguais(objeto, item));
    });
}

async function filterData(mainCategory, order) {
    const data = [];
    const distintos = [];


    for (let i = 1; i < order.length; i++) {
        const id = order[i].main;
        data.push({ main: id, page2: order[i].page2, desc: mainCategory[id] });
    }

    for (let j = 1; j <= 4; j++) {
        distintos.push(data.filter(e => e.main == j));
    }

    const arraySemDuplicados = distintos.map(d => removerDuplicados(d));

    ordemAlfabetica(arraySemDuplicados, mainCategory);
}



function ordemAlfabetica(data, mainCategory) {
    let eixo_x = [];
    let eixo_y = {};
    for (let j = 0; j < data.length; j++) {
        const categoria = data[j][0].desc;
        const valor = data[j].length;
        eixo_x.push(categoria);
        eixo_y[categoria] = valor;
    }

    mainCategory.splice(0, 1);

    eixo_x.sort();

    eixo_y = eixo_x.map(categoria => eixo_y[categoria]);

    criarGrafico(eixo_x, eixo_y);
}


function criarGrafico(x, y) {
    const ctx = document.getElementById('meuGrafico');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: x,
            datasets: [{

                label: 'page 2 (clothing model)',
                data: y,
                borderWidth: 1,
                backgroundColor: '#1f77b4'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}




