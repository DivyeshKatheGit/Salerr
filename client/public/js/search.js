$('.product_filter').click(function (e) { 
        
    $('.filter_options').slideToggle(200);
    
});

function selectFilter(opt)
{
    console.log(opt);
    if(opt === 'price')
    {
        $('.price_card').css('display','flex');
        $('.rating_card').css('display','none');
        $('.filter_title>p').text('Price');
    }
    else if(opt === 'ratings')
    {
        $('.price_card').css('display','none');
        $('.rating_card').css('display','flex');
        $('.filter_title>p').text('Ratings');
    }
}