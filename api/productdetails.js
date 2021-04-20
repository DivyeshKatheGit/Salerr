const axios = require('axios');

function formatResponse(data)
{
    data.forEach(ele => {
        ele.product_price = (ele.product_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    });
    return data;
}

function sortByPrice(data)
{

     return data.sort((a,b)=> a.product_price - b.product_price);
}

function sortByRating(data)
{
    return data.sort((a,b)=> b.rating - a.rating);
    
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

    let regxp = new RegExp(product,'gi');
    let CategoryData = data.filter((d)=>{
        if((d.category).match(regxp) || (d.product_name).match(regxp))
        {
            return d;
        }
    });
    return CategoryData;
}

function getProduct(data,id)
{
    // console.log(id);
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
            let sortedPrice = formatResponse(sortByPrice(JSON.parse(JSON.stringify(Cdata))));
            let sortedRating = formatResponse(sortByRating(JSON.parse(JSON.stringify(Cdata))));

        
            let data = {
                sortedPrice : sortedPrice,
                sortedRating : sortedRating,
                items : Cdata.length
            }
            resolve(data);
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
            let sdata = getSimilarProducts(response.data,id);
            let pdata = formatResponse(Cdata);

            let data = {
                sdata : sdata,
                pdata : pdata
            }
            resolve(data)
        })
        .catch(error =>{
            reject(error)
        })
    })
}

function getWishlist(IDarr)
{

    let products = [];
    return new Promise((resolve,reject)=>{
        var loop = new Promise((res,rej)=>{
            IDarr.forEach((id,indx)=>{
                getProductFromID(id)
                .then((resp)=>{
                    products.push(resp);
                    if(products.length == IDarr.length)
                    {
                        // console.log(products.length);
                        res(products);
                    }
                })
                .catch((err)=>{
                    rej(err);
                    console.log(err);
                })
                
            })
        })

        loop.then((response)=>{
            console.log(response.length);
            resolve(response)
        })
        .catch((err)=>{
            reject(err);
        })
        
    })
}

function getSimilarProducts(data,id)
{
    let product = data.filter((d)=>{
        return d.category === 'clothes' && d.id!== id
    });

    return product;
}

module.exports = {getProductDetails,getSearchedProduct,getProductFromID,getWishlist};