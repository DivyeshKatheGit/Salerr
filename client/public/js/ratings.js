
document.addEventListener('DOMContentLoaded',getRatings)


function getRatings()
{
    console.log('get ratings')
    const totalStars = 5;
    const products = $('.stars_outer');
    // console.log(products);
    for(let i=0;i<products.length;i++)
    {
        let rating = parseFloat($(products[i]).data('rating'));
        let starPer = (rating/totalStars)*100;
        // console.log(starPer);
        let starPerRounded = `${Math.round(starPer/10)*10}%`;
        console.log(starPerRounded);
        $(products[i]).children('.stars_inner').css('width',starPerRounded);
        

    }
}