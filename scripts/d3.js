document.addEventListener("DOMContentLoaded", function () {

    carregarArquivos();
});


let data = [];

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
    const values = [];
    const distintos = [];
    const f = []

    for (let i = 1; i < order.length; i++) {
        const id = order[i].main;
        values.push({ main: id, page2: order[i].page2, desc: mainCategory[id] });
    }

    for (let j = 1; j <= 4; j++) {
        distintos.push(values.filter(e => e.main == j));
    }

    const arraySemDuplicados = distintos.map(d => removerDuplicados(d));


    ordemAlfabetica(arraySemDuplicados, mainCategory);
}

function ordemAlfabetica(val, mainCategory) {
    let eixo_x = [];
    let eixo_y = {};
    for (let j = 0; j < val.length; j++) {
        const categoria = val[j][0].desc;
        const valor = val[j].length;
        eixo_x.push(categoria);
        eixo_y[categoria] = valor;
    }

    mainCategory.splice(0, 1);

    eixo_x.sort();

    eixo_y = eixo_x.map(categoria => eixo_y[categoria]);


    for (let j = 0; j < val.length; j++) {
        data.push({ name: eixo_x[j], qtd: eixo_y[j] })
    }

    configurarChart(data);
}

function configurarChart(data) {

    
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const width = 400 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.qtd)])
        .range([height, 0]);

    
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.1);

   
    const yAxis = d3.axisLeft(yScale);

    
    const xAxis = d3.axisBottom(xScale);

    
    const svg = d3.select("#graficoBarras")
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.qtd))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.qtd))
        .attr("fill", "steelblue");

    
    svg.append("g")
        .call(yAxis);

    
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

}