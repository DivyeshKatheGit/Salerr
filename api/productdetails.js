const axios = require('axios');

function formatResponse(data)
{
    data.forEach(ele => {
        ele.product_price = (ele.product_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    });
    return data;
}

function filterResponse(data)
{ 

    // console.log('filter');
    let filteredData = {};
    data.forEach(d => {
        // console.log(d.category);
        if(d.category in filteredData)
        {
            // console.log('exists');
            filteredData[d.category].push(d);
        }
        else
        {
            // console.log('not exists');
            filteredData[d.category] = [d];
        }
    });

    // console.log(filteredData);
    return filteredData;
}

function getCategoryData(data,product)
{

    let CategoryData = data.filter((d)=>{
        return (d.category).toLowerCase() === (product).toLowerCase()
    });
    return CategoryData;
}

function getProduct(data,id)
{
    console.log(id);
    let product = data.filter((d)=>{
        return d.id === id
    });

    return product;
}

function getProductDetails()
{
    return new Promise((resolve,reject)=>{
        axios.get('https://vcat-nasa.herokuapp.com/nasas')
        .then(response=>{
            let Formatteddata = formatResponse(response.data)
            //filter data category wise
            let data = filterResponse(Formatteddata);
            resolve(data);
        })
        .catch(error =>{
            reject(error)
        })
    })
}


function getSearchedProduct(product)
{
    return new Promise((resolve,reject)=>{
        axios.get('https://vcat-nasa.herokuapp.com/nasas')
        .then(response => {
            let Cdata = getCategoryData(response.data,product);
            let data = formatResponse(Cdata);
            // console.log(data.length);
            resolve(data)
        })
        .catch(error =>{
            reject(error)
        })
    })
}

function getProductFromID(id)
{
    return new Promise((resolve,reject)=>{
        axios.get('https://vcat-nasa.herokuapp.com/nasas')
        .then(response => {
            let Cdata = getProduct(response.data,id);
            let data = formatResponse(Cdata);
            // console.log(data.length);
            resolve(data)
        })
        .catch(error =>{
            reject(error)
        })
    })
}

module.exports = {getProductDetails,getSearchedProduct,getProductFromID};